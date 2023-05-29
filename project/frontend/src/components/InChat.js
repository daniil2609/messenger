import React, {useEffect, useState} from "react";
import axios from "axios";

const InChat = ({selectedChat}) => {
    
    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
    
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);

      const inchat = () => {
        axios.post("http://127.0.0.1:8000/api/v1/chat/enter_room/", {id: selectedChat.id}, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            .then(responce => {
                window.location.reload();
                console.log(responce.data)
            })
            .catch(error => {
                alert("Ошибка входа")
            })}

    return (
        <>
        <div className="parent_button">
            <button type="button" onClick={(e) => {inchat()}} className="form_button">Войти</button>
        </div>
        </>
    )
}

export default InChat;