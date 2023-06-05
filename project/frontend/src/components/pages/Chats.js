import React, { useState, useRef, useEffect } from "react";
import HeaderPersonalPage from "../HeaderPersonalpage";
import ListChats from "../ListChats";
import useWebSocket from "react-use-websocket";
import axios from "axios";

const Chats = () => {
  const [user, setUser] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/auth/me/", { withCredentials: true })
      .then((response) => {
        setUser(response.data.username);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const removeNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const addNotification = (data) => {
    const newNotification = {
      id: Date.now(),
      message: data.message && data.message.text ? data.message.text : "",
      user: data.message.user && data.message.user.username ? data.message.user.username : "",
    };

    console.log(newNotification)

    setNotifications((prevNotifications) => {
      if (prevNotifications.length >= 5) {
        // Удаление первого уведомления, если массив уже содержит 5 уведомлений
        prevNotifications.shift();
      }
      return [...prevNotifications, newNotification];
    });
  };

  // Веб-сокет для уведомлений:
  const { readyStateNotifications } = useWebSocket(
    "ws://127.0.0.1:8000/ws/chat/notifications/",
    {
      onOpen: () => {
        console.log("Connected Notifications!");
      },
      onClose: () => {
        console.log("Disconnected Notifications!");
      },
      // Здесь приходят сообщения с сервера
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "notification":
            if (user !== data.message.user.username){
                addNotification(data);
            }
            break;
          default:
            console.error("Unknown message type!");
            break;
        }
      },
    }
  );

  useEffect(() => {
    // Функция для автоматического удаления уведомления после 15 секунд
    const timeout = setTimeout(() => {
      if (notifications.length > 0) {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [notifications]);

  console.log(notifications)
  return (
    <>
      <HeaderPersonalPage />
      <ListChats user={user} />
      <div className="container_notification">
        {notifications.map((notification) => (
          <div className="form" key={notification.id} style={{display: 'flex', flexDirection: 'column', padding: '15px 15px 15px 15px', marginBottom: '10px'}}>
            <button style={{ 
            backgroundColor: "transparent", 
            border: "none", 
            cursor: "pointer",
            marginLeft: 'auto',
            }} onClick={() => removeNotification(notification.id)} 
            >&#10006;</button>
            <div className="username_in_chat"> {notification.user} </div> 
            <div className="messages"> {notification.message} </div> 
          </div>
        ))}
      </div>
    </>
  );
};

export default Chats;
