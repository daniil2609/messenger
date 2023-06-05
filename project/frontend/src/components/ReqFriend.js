import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";

const ReqFriend = (props) =>{

    const reqFriend = (e, emailD) => {
        e.preventDefault();
        sendRequest(emailD)
    }

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);

    const sendRequest = async (emailD) => {
        const data = {
            to_user: emailD,
            message: ''
        }
        console.log(data)
        console.log(csrfToken)
        try{
            const response = await axios.post("http://127.0.0.1:8000/api/v1/friend/add_friend/", data, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            console.log(response)
            props.setFriend((prev)=>{
                return prev.filter((elem)=> 
                    elem.email !== emailD
                )
            });
        }
        catch (error) {
            console.error(error)
        }
    }
    

    return(
        <>
        <div className="parent_button">
            <button type="button" onClick={(e) => {reqFriend(e, props.friendData.email)}} className="form_button">Добавить друга</button>
        </div>
        </>
    )
}

export default ReqFriend