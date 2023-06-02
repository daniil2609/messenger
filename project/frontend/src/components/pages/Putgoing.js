import React from "react";
import HeaderPersonalPage from "../HeaderPersonalpage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddFriend from "../AddFriend";
import CancelFriend from "../CancelFriend";

const Putgoing = () => {
    const [friend, setFriend] = useState([{}])
    
        useEffect(() => {
            axios
                .get("http://127.0.0.1:8000/api/v1/friend/requests/", { withCredentials: true })
                .then( response => {
                    console.log(response.data)
                    setFriend(response.data)
                })
                .catch (error => console.error(error));
            }, []);
        if (friend.length === 0){
            return(
                <>
                <HeaderPersonalPage />
                <Link to="/personalpage/my_friends">Назад</Link>
                    <form className="form">
                        <div className="form_group"> Нет входящих запросов</div>
                    </form>
                </>
                )}
        else{
            return (
                <>
                <HeaderPersonalPage />
                <Link to="/personalpage/my_friends">Назад</Link>
                {friend.map((friendData, index)=>(
                    <form className="form" key={index}>
                        <div className="form_group"> Пользователь:
                            {friendData.from_user}
                            {friendData.id}
                        </div>
                    <AddFriend friendData={friendData}/>
                    <CancelFriend friendData={friendData}/>
                </form>
                    ))}
              </>
                    )
                }
}

export default Putgoing