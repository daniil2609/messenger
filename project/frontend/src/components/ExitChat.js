import React, { useState, useEffect } from "react";
import axios from "axios";

const ExitChat = ({selectedChat}) => {
    
    

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);

    const exit = () => {
        const data = {id: selectedChat.id}
        console.log(data)
        console.log(csrfToken)
        axios.post("http://127.0.0.1:8000/api/v1/chat/delete_room/", data, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            .then(responce => {
                console.log("Успех!")
                window.location.reload();
            })
            .catch(error => {
                console.log(error)
            })
            }
        return (
            <>
                <button className="form_button" style={{marginTop:"10px"}} onClick={exit}>Выйти из чата</button>
            </>
        )
    }

    

export default ExitChat