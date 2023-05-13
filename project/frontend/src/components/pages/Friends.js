import React from "react";
import HeaderPersonalPage from "../HeaderPersonalpage"
import HeaderFriends from "../HeaderFriends";
import axios from "axios";


const Friends = () => {
    
    axios
        .get("http://127.0.0.1:8000/api/v1/friend/", { withCredentials: true })
        .then( response => {
            setData(response.data)
            console.log(response.data)
        })
        .catch (error => console.error(error));

    
    
    return (
        <>
        <HeaderPersonalPage/>
        <HeaderFriends />
        


        </>
    )
}

export default Friends