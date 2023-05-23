import React, { useState } from "react";
import axios from "axios";

const ShowMenu = ({ selectedChat }) => {
    const [isShow, setIsShow] = useState(false);
    const [data, setData] = useState([{}])
  const showmembers = (event) => {
    event.preventDefault();
    axios
      .get(
        `http://127.0.0.1:8000/api/v1/chat/partipicant/?room_name=${selectedChat.name}`,
        { withCredentials: true }
      )
      .then((response) => {
        setIsShow(!isShow);
        setData(response.data)
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <button className="form_button" onClick={showmembers}>
        Список участников
      </button>
      {isShow && 
         <form className="form" style={{marginTop: '10px', width: '100%', padding: '0px', overflowY: "auto", maxHeight: "150px"}}>
         <ul className="names_list" style={{padding: 0}}>
             { data.map(( data, index) =>
                 <li key={index} style={{padding: '10px'}}>
                      {data.username}
                 </li>
             )}
         </ul>
     </form>
      }
    </>
  );
};

export default ShowMenu;
