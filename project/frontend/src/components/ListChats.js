import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import OpenChat from "./OpenChat";
import Searchchats from "./Searchchats";
import ModuleRename from "./ModulRename";
import GetSearch from "./GetSearch";

const ListChats = (props) =>{
    const [chatfriends, setChatFriends] = useState('')
    const [selectedChat, setSelectedChat] = useState(null);
    const [searhing, setSearching] = useState(false);
    const [searchValue, setSearchValue] = useState({
        message: "",
    });

    const handleSearchValue = (value) => {
        setSearchValue(value); 
      };

    const handleChatClick = (index, event) => {
        event.preventDefault();
        setSelectedChat(chatfriends[index])
    }

    const changeSelected = (value) => {
        setSelectedChat(value);
    }
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
      };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);


    const handleSubmit = (inputValue) => {
        console.log(inputValue)
        console.log(csrfToken)
        axios.post("http://127.0.0.1:8000/api/v1/chat/edit_name/", inputValue, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            .then(responce => {
                console.log("Успех")
            })
            .catch(error => {
                alert("Ошибка переименовки")
            })
      };
    
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/v1/chat/room_list/", { withCredentials: true })
            .then( response => {
                setChatFriends(response.data)
                console.log(response.data)
            })
            .catch (error => console.error(error));
        }, []);

        if (chatfriends.length > 0){
            return(
                <>
                    <div className="container">
                        <div> 
                        <Searchchats setSearching={setSearching} handleSearchValue={handleSearchValue} searchValue={searchValue}/>
                        {!searhing && 
                            <form className="form" style={{width: '350px', padding: '20px', marginTop: '10px', marginLeft:'10px'}}>
                            <ul className="names_list">
                                {chatfriends.map((chat, index) =>
                                    <li 
                                    key={index}
                                    onClick={(event) => {
                                        handleChatClick(index, event);
                                    }}
                                    className={`display_name ${selectedChat === chat ? 'selected' : ''}`}
                                    >
                                         {chat.display_name.replace(`_${props.user}`, '').replace(`${props.user}_`, '')}
                                    </li>
                                )}
                            </ul>
                        </form>
                        }
                        {searhing && <GetSearch selectedChat={selectedChat} searchValue={searchValue} changeSelected={changeSelected}/>}
                        </div>
                        <div className="chat" >
                            {selectedChat ? (
                            <>  
                            <div className="parrent_title">
                                <div className="username_in_chat" style={{justifyContent:'center', marginTop:'10px'}}>{selectedChat.display_name}</div>
                                {(selectedChat.type > '1' && selectedChat.room_user_type !== "new_chat") ? (
                                    <>
                                        <button onClick={openModal} style={{
                                            backgroundColor: "transparent", 
                                            border: "none", 
                                            cursor: "pointer",
                                            fontSize: '20px',
                                            marginTop: '8px'
                                         }}>&#128257;</button>
                                        <ModuleRename isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} selectedChat={selectedChat}/>
                                    </>
                                ) : (
                                    ""
                                )
                                }
                            </div>
                                <div className="chat_messages">
                                    <OpenChat selectedChat={selectedChat}/>
                                </div>
                            </>
                            ) : (
                            <div className="no-chat-selected">Чат не выбран!</div>
                            )}
                        </div>
                    </div>
                </>
            )
        }
        else{
            return (
                <>
                <Searchchats setSearching={setSearching}/>
                {!searhing && 
                <div className="form-wrapper">
                <form className="form" style={{height: '40px', textAlign: 'center'}}>
                        <div className="form_group" > Список чатов пуст</div>
                </form>
                </div>}
                </>
            )
        }
}

export default ListChats