import { useState } from "react";
import React from "react";
import ContenSettings from "./ContentSettings";

const SettingsMenu = ({selectedChat}) => {
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
        <ContenSettings isOpen={isModalOpen} onClose={closeModal} selectedChat = {selectedChat}/>
        </>
    )
}

export default SettingsMenu