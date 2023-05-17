import React from "react"; 
import HeaderPersonalPage from "../HeaderPersonalpage";
import Searchchats from "./Searchchats";
import ListChats from "../ListChats"
import useWebSocket from "react-use-websocket"; 

const Chats = () => { 

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
                    console.log(data.message) 
                    console.log(data.room_name) 
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
        <Searchchats/>
        <ListChats/>
        </>

    )
}
export default Chats