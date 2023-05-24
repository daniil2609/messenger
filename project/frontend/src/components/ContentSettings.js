import React, { useState } from "react";
import ShowMenu from "./ShowMenu";
import ExitChat from "./ExitChat";

const ContenSettings = ({ isOpen, onClose, selectedChat, onlineUsers }) => {

  const closed = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <>
      <div className={`modal ${isOpen ? "open" : ""}`}>
        <form
          className="form"
          style={{
            backgroundColor: "white",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            width: "350px",
          }}
          onClick={closed}
        >
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            &#10006;
          </button>
          <div
            className="form_title"
            style={{ padding: "5px", margin: "0 0 10px 0" }}
          >
            Настройки чата: {selectedChat.display_name}
          </div>
          <div
            className="parent_button"
            style={{ flexDirection: "column", padding: "10px" }}
          >
            <div onClick={(event) => event.stopPropagation()}>
            <ShowMenu selectedChat={selectedChat} onlineUsers={onlineUsers}/>
            </div>
            {selectedChat.type > '1' ? (<>
              <button className="form_button" style={{ marginTop: "10px" }}>
              Добавить участников
              </button>
            </>) : ('')}
            <ExitChat selectedChat={selectedChat} />
          </div>
        </form>
      </div>
    </>
  );
};

export default ContenSettings;
