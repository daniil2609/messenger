import React, { useState, useRef, useEffect } from "react"; 
import useWebSocket, { ReadyState } from "react-use-websocket"; 
import KanbanBoard from './KanbanBoard'
import SettingsMenu from "./SettingsMenu";

export default function OpenChat(props) {
    const [onlineUsers, setOnlineUsers] = useState([]); 
    const [messageHistory, setMessageHistory] = useState([]); 
    const [message, setMessage] = useState(""); 
    const chatContainerRef = useRef(null);

    //для пагинации:
    const [upId, setUpId] = useState();

    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.clientHeight;
        }
      }, [messageHistory]);

    const onScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            if (scrollTop === 0) {
                if (upId === 0) {}
                else {
                    sendJsonMessage({ 
                        type: "paginate_up", 
                        up_id: upId, 
                        }); 
                }
            }
        }
    };

    const handleClose = () => {
        console.log("Disconnected chat!");
        setMessageHistory([]);
        setOnlineUsers([]);
        setUpId(0)
    }

    const OnlineMenu = () => {
        console.log(onlineUsers);
      };


    //для чата: 
     const { readyState, sendJsonMessage } = useWebSocket(`ws://127.0.0.1:8000/ws/chat/room/${props.selectedChat.name}/`, { 
        onOpen: () => { 
            console.log("Connected chat!"); 
        }, 
        onClose: () => {
            handleClose()
        }, 
        // тут приходят сообщения с сервера 
        onMessage: (e) => { 
            const data = JSON.parse(e.data); 
            switch (data.type) { 
                case "start_messages": 
                    console.log(data.message)
                    if (data.message.length !== 0) {setUpId(data.message[data.message.length - 1].id);}
                    setMessageHistory((prev) => prev.concat(data.message.reverse())); 
                    break;
                case "chat_message": 
                    console.log(data.message) 
                    setMessageHistory((prev) => prev.concat(data.message)); 
                    break; 
                case "online_users": 
                    console.log(data.users) 
                    setOnlineUsers(data.users); 
                    break; 
                case "paginate_up": 
                    console.log(data.message)
                    if (data.message.length === 0) {
                        setUpId(0);
                    }
                    else{
                        setUpId(data.message[data.message.length - 1].id);
                    }
                    setMessageHistory((prev) => [...data.message.reverse(), ...prev]);
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
        <>
            <div className="parrent_title" style={{justifyContent:'space-between'}}> Соединение: {' ' + connectionStatus}
                <KanbanBoard selectedChat={props.selectedChat}/>
                <button className="form_button" style={{height: '40px'}} onClick={OnlineMenu}>Онлайн</button>
                <SettingsMenu selectedChat = {props.selectedChat} onlineUsers = {onlineUsers}/>
            </div>
            
            <ul className="message_text" 
                style={{ overflowY: "auto", maxHeight: "400px" }} 
                ref={chatContainerRef}
                onScroll={onScroll}> 

                {messageHistory.map((message, idx) => ( 
                    <form className="form" style={{marginTop: '20px', padding: '10px', transition: '1s'}} key={idx}>
                        <div className="username_in_chat">{message.user.username} </div>
                        <div className="messages">{message.text} </div> 
                        <div className="time">{message.time_message.substring(11, 16)}  </div> 
                    </form>
                ))} 
            </ul> 

            <div className="parrent_title">
            <form className="form" style={{width: '350px', height: '45px', padding: '20px'}}>
            <div className="form_group" style={{display: 'flex'}}>
                <input 
                    onChange={handleChangeMessage} 
                    className="form_input"
                    type="text" 
                    id="message" 
                    name="message" 
                    placeholder=" "
                    value={message} 
                />
                <label htmlFor="search" className="form_label">Напечатать...</label>
                <button type="button" onClick={handleSubmit} style={{padding: '6px 15px', marginLeft: '10px'}} className="form_button">&uarr;</button>    
          </div>
        </form>
        </div>
            </>
    ); 
}
