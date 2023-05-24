import React, { useState } from "react";
import axios from "axios";

const ShowMenu = ({ selectedChat, onlineUsers }) => {
    const [isShow, setIsShow] = useState(false);
    const [data, setData] = useState([{}])
    const [members1, setMembers1] = useState([]);
    const [members2, setMembers2] = useState([]);

  const showmembers = (event) => {
    event.preventDefault();

    axios
      .get(
        `http://127.0.0.1:8000/api/v1/chat/partipicant/?room_name=${selectedChat.name}`,
        { withCredentials: true }
      )
      .then((response) => {
        const [members1, members2] = onlineMembers(response.data, onlineUsers);
        setMembers1(members1);
        setMembers2(members2);
        setIsShow(!isShow);
        setData(response.data)
      })
      .catch((error) => console.error(error));
  };

  const onlineMembers = (data, onlineUsers) => {
    let members1 = [];
    let members2 = [];
  
    for (let i = 0; i < data.length; i++) {
      let found = false;
  
      for (let j = 0; j < onlineUsers.length; j++) {
        if (data[i].username === onlineUsers[j].username) {
          members1.push(data[i].username);
          found = true;
          break;
        }
      }
  
      if (!found) {
        members2.push(data[i].username);
      }
    }
    return [members1, members2];
  };
  


  return (
    <>
      <button className="form_button" onClick={showmembers}>
        Список участников
      </button>
      {isShow && 
          <div
          className="form"
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "0px",
            overflowY: "auto",
            maxHeight: "150px",
          }}
        >
          <ul className="names_list" style={{ padding: 0 }}>
            {members1.map((member1, index) => (
              <li key={index} style={{ padding: "10px" }}>
                {member1} <span>&#128994;</span>
              </li>
            ))}
            {members2.map((member2, index) => (
              <li key={index} style={{ padding: "10px" }}>
                {member2} <span>&#128308;</span>
              </li>
            ))}
          </ul>
        </div>
      }
    </>
  );
};

export default ShowMenu;
