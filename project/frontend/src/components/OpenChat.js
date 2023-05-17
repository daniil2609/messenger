import React, { useState } from "react"; 
import useWebSocket, { ReadyState } from "react-use-websocket"; 

export default function OpenChat(props) {
    const [startMessage, setStartMessage] = useState([]); 
    const [up_id, setMessageidUp] = useState(""); 
    const [down_id, setMessageidDown] = useState(""); 
    const [onlineUsers, setOnlineUsers] = useState([]); 
    const [messageHistory, setMessageHistory] = useState([]); 
    const [message, setMessage] = useState(""); 

     //для чата: 
     const { readyState, sendJsonMessage } = useWebSocket(`ws://127.0.0.1:8000/ws/chat/room/${props.selectedChat.name}/`, { 
        onOpen: () => { 
            console.log("Connected chat!"); 
        }, 
        onClose: () => { 
            console.log("Disconnected chat!"); 
        }, 
        // тут приходят сообщения с сервера 
        onMessage: (e) => { 
            const data = JSON.parse(e.data); 
            switch (data.type) { 
                case "start_messages": 
                    console.log(data.message) 
                    setStartMessage((prev) => prev.concat(data.message)); 
                    break; 
                case "chat_message": 
                    console.log(data.message) 
                    setMessageHistory((prev) => prev.concat(data.message)); 
                    break; 
                case "online_users": 
                    console.log(data.users) 
                    setOnlineUsers((prev) => prev.concat(data.users)); 
                    break; 
                case "paginate_up": 
                    console.log(data.message) 
                    //setOnlineUsers((prev) => prev.concat(data.users)); 
                    break; 
                case "paginate_down": 
                    console.log(data.message) 
                    //setOnlineUsers((prev) => prev.concat(data.users)); 
                    break; 
                default: 
                    bash.error("Unknown message type!"); 
                    break; 
                } 
        } 
    }); 
 
    const connectionStatus = { 
        [ReadyState.CONNECTING]: "Connecting", 
        [ReadyState.OPEN]: "Open", 
        [ReadyState.CLOSING]: "Closing", 
        [ReadyState.CLOSED]: "Closed", 
        [ReadyState.UNINSTANTIATED]: "Uninstantiated" 
    }[readyState]; 
 
    function handleChangeMessage(e) { 
        setMessage(e.target.value); 
    } 
 
    const handleSubmit = () => { 
        sendJsonMessage({ 
            type: "chat_message", 
            message, 
        }); 
        setMessage(""); 
    }; 
 
 
    function handleChangePaginateUp(e) { 
        setMessageidUp(e.target.value); 
    } 
 
    const handlePaginateUp = () => { 
        sendJsonMessage({ 
            type: "paginate_up", 
            up_id, 
        }); 
        setMessageidUp(""); 
    }; 
 
 
    function handleChangePaginateDown(e) { 
        setMessageidDown(e.target.value); 
    } 
 
    const handlePaginateDown = () => { 
        sendJsonMessage({ 
            type: "paginate_down", 
            down_id, 
        }); 
        setMessageidDown(""); 
    }; 


    return ( 

        <div>
            <ul> 
                {startMessage.map((message, idx) => ( 
                    <div className="border border-gray-200 py-3 px-3" key={idx}> 
                        {message.text}:{message.user.username}:{message.time_message} 
                    </div> 
                ))} 
                {messageHistory.map((message, idx) => ( 
                    <div className="border border-gray-200 py-3 px-3" key={idx}> 
                        {message.text}:{message.user.username}:{message.time_message} 
                    </div> 
                ))} 
            </ul> 
             
            <span>WebSocket статус чата: {connectionStatus}</span> 
            <br></br> 
            <br></br> 
            <input 
                name="message" 
                placeholder="Введите сообщение" 
                onChange={handleChangeMessage} 
                value={message} 
                className="ml-2 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md" 
            /> 
            <button className="ml-3 bg-gray-300 px-3 py-1" onClick={handleSubmit}> 
                Отправить 
            </button> 
             
            <p>Пользователи онлайн:</p> 
            <p>{onlineUsers}</p> 
             
            <input 
                name="paginate_up" 
                placeholder="Введите последний id сообщения которое у вас есть (он самый маленький)" 
                onChange={handleChangePaginateUp} 
                value={up_id} 
                className="ml-2 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md" 
            /> 
            <button className="ml-3 bg-gray-300 px-3 py-1" onClick={handlePaginateUp}> 
                Загрузить сообщения выше 
            </button> 
 
            <br></br> 
 
            <input 
                name="paginate_down" 
                placeholder="Введите последний id сообщения которое у вас есть (он самый большой)" 
                onChange={handleChangePaginateDown} 
                value={down_id} 
                className="ml-2 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md" 
            /> 
            <button className="ml-3 bg-gray-300 px-3 py-1" onClick={handlePaginateDown}> 
                Загрузить сообщения ниже 
            </button> 
             
        </div> 
    ); 
}
