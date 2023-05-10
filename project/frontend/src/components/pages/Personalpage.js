import React from "react"
import axios from "axios"
import Datauser from "../Datauser"

const Personalpage = () => {

    axios.get("http://127.0.0.1:8000/api/v1/auth/session/", { withCredentials: true })
    .then(response => {
        const isAuth = response.data;
        if (isAuth){
            //const session = response.headers['set-cookie'][0];
            //console.log(session)
            console.log("Успешно!")
        }
        else{
            alert("Пользователь не авторизирован")
        }
    })
    .catch(error => {
        console.error(error)
    })



    return  (
        <>
            <div>YourPage!</div>
            <Datauser />
        </>
    )
}

export default Personalpage