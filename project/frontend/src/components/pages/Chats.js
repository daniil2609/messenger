import HeaderPersonalPage from "../HeaderPersonalpage"
import React, { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Chats() {
const [startMessage, setStartMessage] = useState([]);
const [messageHistory, setMessageHistory] = useState([]);
const [message, setMessage] = useState("");
const [onlineUsers, setOnlineUsers] = useState([]);

const { readyState, sendJsonMessage } = useWebSocket("ws://127.0.0.1:8000/ws/chat/re/", {
onOpen: () => {
console.log("Connected!");
},
onClose: () => {
console.log("Disconnected!");
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

return (
    <div>
    <HeaderPersonalPage/>
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
    
    <span>WebSocket статус: {connectionStatus}</span>
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
    
    </div>
    );
    }