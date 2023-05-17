import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import OpenChat from "./OpenChat";


const ListChats = () =>{
    const [chatfriends, setChatFriends] = useState('')
    const [selectedChat, setSelectedChat] = useState(null);
    
    const handleChatClick = (index, event) => {
        event.preventDefault();
        setSelectedChat(chatfriends[index])
    }

    
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/v1/chat/room_list/", { withCredentials: true })
            .then( response => {
                setChatFriends(response.data)
                console.log(response.data)
            })
            .catch (error => console.error(error));
        }, []);

        if (chatfriends.length === 0){
            return (
                <>
                <div className="form-wrapper">
                <form className="form" style={{height: '40px', textAlign: 'center'}}>
                        <div className="form_group" > Список чатов пуст</div>
                </form>
                </div>
                </>
            )
        }
        else{
            return(
                <>
                    <div className="container">
                        <div className="names">
                            <ul className="names_list">
                                {chatfriends.map((chat, index) =>
                                    <li 
                                    key={index}
                                    onClick={(event) => {
                                        handleChatClick(index, event);
                                    }}
                                    className={`display_name ${selectedChat === chat ? 'selected' : ''}`}
                                    >
                                         {chat.display_name}
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="chat">
                            {selectedChat ? (
                            <>
                                <div className="chat_title">{selectedChat.display_name}</div>
                                <div className="chat_messages">
                                    <OpenChat selectedChat={selectedChat}/>
                                </div>
                            </>
                            ) : (
                            <div className="no-chat-selected">Чат не выбран</div>
                            )}
                        </div>
                    </div>
                </>
            )
        }
}

export default ListChats