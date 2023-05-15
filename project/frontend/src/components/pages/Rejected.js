import React from "react";
import HeaderPersonalPage from "../HeaderPersonalpage";
import axios from "axios";
import { useEffect } from "react";

const Rejected = () => {
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/v1/friend/rejected_requests/", { withCredentials: true })
            .then( response => {
                console.log(response.data)
            })
            .catch (error => console.error(error));
        }, []);
    return(
        <>
        <HeaderPersonalPage/>
        <div>rejected</div>
        </>
    )
}

export default Rejected