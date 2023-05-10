import React from "react"
import axios from "axios"

const Datauser = () => {

    axios
    .get("http://127.0.0.1:8000/api/v1/auth/me/", { withCredentials: true })
    .then( response => {
        console.log(response.data)
    })

    return(
        <div> Данные </div>
    )
}

export default Datauser