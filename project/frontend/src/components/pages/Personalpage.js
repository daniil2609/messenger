import React, { useEffect, useState } from "react"
import axios from "axios"
import HeaderPersonalPage from "../HeaderPersonalpage";


const Isauth = () => {
    
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
    axios
    .get("http://127.0.0.1:8000/api/v1/auth/session/")
    .then((response) => {
        if(response.status = 200){
            setAuthenticated(true)
        }
        
    })
    .catch((error)=> {
        console.error(error)
    });
}, []);

    if (authenticated){
        return (
            <>
            <HeaderPersonalPage/>
            </>
        )
    }
    else {
        return <div>Пользователь не авторизирован</div>;
    }

}

export default Isauth