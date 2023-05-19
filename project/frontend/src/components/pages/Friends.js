import React, { useState, useEffect } from "react";
import HeaderPersonalPage from "../HeaderPersonalpage"
import HeaderFriends from "../HeaderFriends";
import axios from "axios";
import AdditionFriends from "../AdditionFriends";
import DelFriend from "../DelFriend";


const Friends = () => {
    
    const [friends, setFriends] = useState([{
        username: '',
        email: '',
        last_name: '',
        phone_number: ''
    }])

    useEffect(() => {
    axios
        .get("http://127.0.0.1:8000/api/v1/friend/", { withCredentials: true })
        .then( response => {
            setFriends(response.data)
        })
        .catch (error => console.error(error));
    }, []);

    if (friends.length === 0){
        return (
            <>
            <HeaderPersonalPage/>
            <div className="form-wrapper">
            <HeaderFriends />
            <form className="form" style={{height: '40px', textAlign: 'center'}}>
                    <div className="form_group" > Список друзей пуст</div>
                </form>
            <AdditionFriends/>
            </div>
            </>
        )
    }
    else{
        return(
            <>
            <HeaderPersonalPage/>
            <div className="form-wrapper">
            <HeaderFriends />
            <div className="center" style={{justifyContent: "center"}}>
            {friends.map((friendData, index)=>(
                    <form className="form" key={index} style={{height: '130px', marginBottom:'20px'}}>
                        <div className="form_group"> Логин:
                            {friendData.username}
                        </div>
                        <div className="form_group"> Почта:
                            {friendData.email}
                        </div>
                        <DelFriend friendData={friendData}/>
                </form>
            ))}
            </div>
            <AdditionFriends/>
            </div>
            </>
        )
    }
}

export default Friends