import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const GetSearch = (message) => {

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);


    const searching = () => {
        axios.post("http://127.0.0.1:8000/api/v1/chat/search_room/", message, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            .then(responce => {
                console.log(responce.data)
            })
            .catch(error => {
                alert("Ошибка поиска")
            })
            }
        
        if (csrfToken && message) {
            console.log(csrfToken)
            console.log(message)
            searching();
            return (
                <>
                Готово!
                </>
            )
        }
        
    

}

export default GetSearch