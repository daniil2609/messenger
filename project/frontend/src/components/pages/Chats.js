import React from "react"; 
import HeaderPersonalPage from "../HeaderPersonalpage";
import Searchchats from "./Searchchats";
import ListChats from "../ListChats"


const Chats = () => { 

    return(
        <>
        <HeaderPersonalPage/>
        <Searchchats/>
        <ListChats/>
        <div>Hello!</div>
        </>

    )
}
export default Chats