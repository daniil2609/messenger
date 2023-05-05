import React from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const Personalpage = () => {

    axios.get("http://127.0.0.1:8000/api/v1/auth/session/")
    .then(() => {
        console.log("Вы авторизорованы!")
    })
    .catch(error => {
        console.error(error)
    })




    return  (
        <>
            <Link to="/">Выйти</Link>
        </>
    )
}

export default Personalpage