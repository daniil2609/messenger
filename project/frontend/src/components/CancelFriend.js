import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";

const CancelFriend = (props) => {

    const cancelFriend = (e, idA) => {
        e.preventDefault();
        sendRequest(idA)
    }

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
    
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);

    const sendRequest = async (id_) =>{
        const data = {
            id: id_
        }
        try{
            const response = await axios.post("http://127.0.0.1:8000/api/v1/friend/reject_request/", data, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            props.setFriend((prev)=>{
                return prev.filter((elem)=> 
                    elem.id !== id_
                )
            });
        }
        catch (error) {
            console.error(error)
        }
    }
    

    return(
        <>
        <div className="parent_button" style={{marginTop: '20px'}}>
            <button type="button" onClick={(e) => {cancelFriend(e, props.friendData.id)}} className="form_button">Отменить запрос</button>
        </div>
        </>
    )
}

export default CancelFriend