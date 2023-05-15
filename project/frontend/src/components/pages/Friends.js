import React, { useState, useEffect } from "react";
import HeaderPersonalPage from "../HeaderPersonalpage"
import HeaderFriends from "../HeaderFriends";
import axios from "axios";
import AdditionFriends from "../AdditionFriends";


const Friends = () => {
    
    const [friends, setFriends] = useState([])

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
            <HeaderFriends />
            <AdditionFriends/>
            <div>Список друзей пуст</div>
            </>
        )
    }
    else{
        return(
            <>
            <HeaderPersonalPage/>
            <HeaderFriends />
            <AdditionFriends/>
            <div>{friends}</div>
            </>
        )
    }
}

export default Friends