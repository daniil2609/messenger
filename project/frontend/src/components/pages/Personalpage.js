import React from "react"
import axios from "axios"

const Personalpage = () => {

    axios.get("http://127.0.0.1:8000/api/v1/friend/")
    .then(responce => {
        console.log(responce.data.detail)
    })
    .catch(error => {
        console.error(error)
    })

    return  (
        <>
            <div>YourPage!</div>
        </>
    )
}

export default Personalpage