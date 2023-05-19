import React, { useState, useRef, useEffect } from "react"; 
import useWebSocket, { ReadyState } from "react-use-websocket"; 

export default function OpenChat(props) {
    const [startMessage, setStartMessage] = useState([]); 
    const [up_id, setMessageidUp] = useState(""); 
    const [down_id, setMessageidDown] = useState(""); 
    const [onlineUsers, setOnlineUsers] = useState([]); 
    const [messageHistory, setMessageHistory] = useState([]); 
    const [message, setMessage] = useState(""); 

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, [messageHistory, startMessage]);

    const handleClose = () => {
        console.log("Disconnected chat!");
        setStartMessage([]);
        setMessageHistory([]);
        setOnlineUsers([]);
    }


    const OnlineMenu = () => {
        const users = onlineUsers;
        const arrayString = users.join("\n");
        alert("В сети: \n" + arrayString);
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
        <>
            <div className="parrent_title" style={{justifyContent:'space-between'}}> Соединение: {' ' + connectionStatus}
                <button className="form_button" style={{height: '40px'}} onClick={OnlineMenu}>Онлайн</button>
            </div>
            
            <ul className="message_text" style={{ overflowY: "auto", maxHeight: "400px" }} ref={chatContainerRef}> 
                {startMessage.map((message, idx) => ( 
                    <form className="form" style={{marginTop: '20px', padding: '10px'}} key={idx}>
                        <div className="username_in_chat">{message.user.username} </div>
                        <div className="messages">{message.text} </div> 
                        <div className="time">{message.time_message.substring(11, 16)}  </div>  
                    </form> 
                ))} 
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
 

                 
            {/*<input 
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
            </button> */}
            
             
            </>
    ); 
}
