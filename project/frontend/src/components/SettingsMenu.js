import { useState } from "react";
import React from "react";
import ContenSettings from "./ContentSettings";

const SettingsMenu = ({selectedChat, onlineUsers}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
      };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return(
        <>
        <button className="form_button" onClick={openModal}>&equiv;</button>
        <ContenSettings isOpen={isModalOpen} onClose={closeModal} selectedChat = {selectedChat} onlineUsers = {onlineUsers}/>
        </>
    )
}

export default SettingsMenu