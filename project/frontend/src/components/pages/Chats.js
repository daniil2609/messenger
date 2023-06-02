import React, { useState, useRef, useEffect } from "react";
import HeaderPersonalPage from "../HeaderPersonalpage";
import ListChats from "../ListChats"
import useWebSocket from "react-use-websocket"; 
import axios from "axios";

const Chats = () => { 
    const [user, setUser] = useState('')

    useEffect(() => {
        axios
        .get("http://127.0.0.1:8000/api/v1/auth/me/", { withCredentials: true })
        .then( response => {
            //setData(response.data)
            setUser(response.data.username)
            console.log(response.data)
        })
        .catch (error => console.error(error));
        }, []);

    //вебсокет для уведомлений: 
    const { readyStateNotifications } = useWebSocket("ws://127.0.0.1:8000/ws/chat/notifications/", { 
        onOpen: () => { 
            console.log("Connected Notifications!"); 
        }, 
        onClose: () => { 
            console.log("Disconnected Notifications!"); 
        }, 
        // тут приходят сообщения с сервера 
        onMessage: (e) => { 
            const data = JSON.parse(e.data); 
            switch (data.type) { 
                case "notification": 
                    console.log('Начало уведомления:')
                    console.log(user) 
                    console.log(data.message) 
                    console.log(data.room) 
                    console.log('Конец уведомления:') 
                    break; 
                default: 
                    bash.error("Unknown message type!"); 
                    break; 
                } 
        } 
    });

    return(
        <>
        <HeaderPersonalPage/>
        <ListChats user={user}/>
        </>

    )
}
export default Chats