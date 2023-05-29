import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowForAdd = ({ selectedChat }) => {
  const [isShow, setIsShow] = useState(false);
  const [addmember, setAddMember] = useState({
    id: "",
    participant: [],
  });
  const [members1, setMembers1] = useState([]);
  const [members2, setMembers2] = useState([]);

  const [csrfToken, setCsrfToken] = useState("");
  useEffect(() => {
    const cookieValue = document.cookie
      .split(';')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    setCsrfToken(cookieValue);
  }, []);
    
  const addToGroup = (id, event) => {
    event.preventDefault();
    if (addmember.participant.includes(id)) {
      setAddMember((prevAddMember) => ({
        ...prevAddMember,
        participant: prevAddMember.participant.filter((participantId) => participantId !== id),
      }));
    } else {
      setAddMember((prevAddMember) => ({
        ...prevAddMember,
        id: selectedChat.id,
        participant: [...prevAddMember.participant, id],
      }));
    }
  };

  const actionAdd = () => {
    axios.post("http://127.0.0.1:8000/api/v1/chat/add_user/", addmember, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      })
      .then(response => {
        updateMembers(addmember.participant)
        if (addmember.participant.length === 1) {
          alert("Пользователь добавлен в чат");
        } else {
          alert("Пользователи добавлены в чат");
        }
        //window.location.reload();
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const updateMembers = (membersID) => {
    const addmembers = members2.filter((elem)=>{
      const id = elem.id;
      if (membersID.includes(id)) {
        return elem
      }
      
    })
    const deletemembers = members2.filter((elem)=>{
      const id = elem.id;
      if (!membersID.includes(id)) {
        return elem
      }
      
    })
    setMembers1((prev)=>
      [ 
        ...prev,
        ...addmembers
      ] 
    )
    setMembers2((prev)=>
    [
      ...deletemembers
    ])
    setAddMember({
      id: "",
      participant: [],
    });
  }

  
  const showfriends = (event) => {
    
    event.preventDefault();
    axios
      .get(`http://127.0.0.1:8000/api/v1/friend/`, { withCredentials: true })
      .then((response) => {
        setIsShow(!isShow);
        const [members1, members2] = UbleAdd(response.data)
        setMembers1(members1);
        setMembers2(members2);
      })
      .catch((error) => console.error(error));
  };

  const UbleAdd = (friendsList) => {
    let members1 = []; // друзья
    let members2 = []; // кто состоит в группе
  
    for (let i = 0; i < friendsList.length; i++) {
      let found = false;
      for (let j = 0; j < selectedChat.participant.length; j++) {
        if (friendsList[i].id === selectedChat.participant[j]) {
          members1.push(friendsList[i]);
          found = true;
          break;
        }
      }
  
      if (!found) {
        members2.push(friendsList[i]);
      }
    }
    return [members1, members2];
  };

  return (
    <>
      <button
        className="form_button"
        style={{ marginTop: "10px" }}
        onClick={showfriends}
      >
        Добавить участников
      </button>
      {isShow && (
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
                {member1.username} 
              </li>
            ))}
            {members2.map((member2, index) => (
              <li key={index} style={{ padding: "10px", display: 'flex' }}>
                <div style={{ marginTop: "4px" }}>{member2.username}</div>
                <button
                  className="form_button"
                  style={{ padding: "4px", marginLeft: "10px" }}
                  onClick={(event) => addToGroup(member2.id, event)}
                >
                  {addmember.participant.includes(member2.id) ? "-" : "+"}
                </button> 
              </li>
            ))}
            {addmember.participant.length > 0 && (
              <div className="parent_button">
                <button type="button" className="form_button" onClick={actionAdd}>
                  ОК
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default ShowForAdd;
