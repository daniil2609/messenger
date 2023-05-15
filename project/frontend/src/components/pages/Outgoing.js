import React from "react";
import HeaderPersonalPage from "../HeaderPersonalpage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Outgoing = () => {
    const [friend, setFriend] = useState([{}])
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/v1/friend/sent_requests/", { withCredentials: true })
            .then( response => {
                console.log(response.data)
                setFriend(response.data)
            })
            .catch (error => console.error(error));
        }, []);

    if (friend.length === 0){
        return(
            <>
            <Link to="/personalpage/my_friends">Назад</Link>
            <HeaderPersonalPage />
                <form className="form">
                    <div className="form_group"> Нет исходящих запросов</div>
                </form>
            </>
            )}
    else{
        return (
            <>
            <Link to="/personalpage/my_friends">Назад</Link>
            <HeaderPersonalPage />
            {friend.map((friendData, index)=>(
                <form className="form" key={index}>
                    <div className="form_group"> Пользователь:
                        {friendData.to_user}
                    </div>
                    <div className="form_group"> Почта: 
                        {friendData.to_user}
                    </div>
            </form>
                ))}
          </>
                )
            }
}

export default Outgoing