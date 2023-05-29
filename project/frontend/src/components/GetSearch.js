import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";


const GetSearch = ({ selectedChat, searchValue, changeSelected}) => {

    const [data, setData] = useState([]);

    const handleChatClick = (index, event) => {
      event.preventDefault();
      changeSelected(data[index])
  }

      
    const searching = () => {
      
      axios.get(`http://127.0.0.1:8000/api/v1/chat/search_room/?message=${searchValue.message}`, {
                withCredentials: true
    })
            .then(responce => {
                setData(responce.data)
                console.log(responce.data)
            })
            .catch(error => {
                alert("Ошибка поиска")
            })
            }
            
            useEffect(() => {
                if (searchValue) {
                  if (searchValue.message === "") {
                    alert("Заполните поле поиска!");
                    window.location.reload();
                  } else {
                    searching();
                  }
                }
              }, [searchValue]);
            
            if (data.length === 0){
                return (
                    <>
                    <div className="form" style={{marginLeft: "10px", marginTop: '10px', textAlign: "center", width: '350px'}}>
                        Таких чатов не существует
                    </div>
                    </>)
            } else {
                return (
                    <>
                    <div className="form" style={{width: '350px', padding: '20px', marginTop: '10px', marginLeft:'10px'}}>
                      <ul className="names_list">
                                {data.map((chat, index) =>
                                     <li key={index} 
                                     onClick={(event) => {
                                      handleChatClick(index, event);
                                      }}
                                      className={`display_name ${selectedChat === chat ? 'selected' : ''}`}
                                     style={{ padding: "10px" }}>
                                     {chat.display_name} 
                                   </li>
                                )}
                      </ul>
                    </div>
                    </>)

            } 
           
        
    }
    


export default GetSearch