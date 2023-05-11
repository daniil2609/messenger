import React, { useEffect, useState } from "react"
import axios from "axios"
import HeaderPersonalPage from "../HeaderPersonalpage"


const Datauser = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [last_name, setLast_name] = useState("")
    const [pnone_number, setPhone_number] = useState("")
    const [password, setPassword] = useState("")
    


    useEffect(() => {
        axios
        .get("http://127.0.0.1:8000/api/v1/auth/me/", { withCredentials: true })
        .then( response => {
            console.log(response.data)
            setUsername(response.data.username)
            setUsername(response.data.email)
        })
    })

    return(
        <>
        <HeaderPersonalPage/>
        
        <div> {username} </div>
        <div> {email} </div>
        </>
    )
}

export default Datauser