import React, { useState, useRef, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import AddTask from "./AddTask";
import DelTask from "./DelTask";
import EditTask from "./EditTask";

export default function KanbanBoard(props) {
  const [tasksToDo, setTasksTodo] = useState([]);
  const [taskInProgress, setInProgress] = useState([]);
  const [taskReview, setReview] = useState([]);
  const [tasksDone, setDone] = useState([]);

  // вебсокет для досок kanban:
  const { readyState, sendJsonMessage } = useWebSocket(`ws://127.0.0.1:8000/ws/chat/board/${props.selectedChat.name}/`,
    {
      onOpen: () => {
        console.log("Connected Kanban");
      },
      onClose: () => {
        console.log("Disconnected Kanban");
      },
      // тут приходят сообщения с сервера
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "board":
            console.log(data.ToDo)
            setTasksTodo(data.ToDo);
            setInProgress(data.InProgress);
            setReview(data.Review);
            setDone(data.Done);
            break;
          case "Kanban_error":
            console.log("Начало ОШИБКИ kanban:");
            console.log(data.message);
            console.log("Конец ОШИБКИ kanban:");
          default:
            bash.error("Unknown message type!");
            break;
        }
      },
    }
  );
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  //*************************************************************************************

  const [isOpenToDo, setIsOpenToDo] = useState(false);
  const [isOpenInProgress, setIsOpenInProgress] = useState(false);
  const [isOpenReview, setIsOpenReview] = useState(false);
  const [isOpenDone, setIsOpenDone] = useState(false);

  const [typeTask, setTypeTask] = useState('');

  const toggleFormToDo = () => {
    setTypeTask("ToDo");
    if (isOpenInProgress || isOpenReview || isOpenDone) {
        setIsOpenInProgress(false);
        setIsOpenReview(false);
        setIsOpenDone(false);
        setIsOpenToDo(true);
    } else {
        setIsOpenToDo(!isOpenToDo);
    }
};


const toggleFormInProgress = () => {
  setTypeTask('InProgress');
    if (isOpenToDo || isOpenReview || isOpenDone) {
        setIsOpenToDo(false);
        setIsOpenReview(false);
        setIsOpenDone(false);
        setIsOpenInProgress(true);
    } else {
        setIsOpenInProgress(!isOpenInProgress);
    }
};

const toggleFormReview = () => {
  setTypeTask("Review");
    if (isOpenToDo || isOpenInProgress || isOpenDone) {
        setIsOpenToDo(false);
        setIsOpenInProgress(false);
        setIsOpenDone(false);
        setIsOpenReview(true);
    } else {
        setIsOpenReview(!isOpenReview);
    }
};

const toggleFormDone = () => {
  setTypeTask("Done");
    if (isOpenToDo || isOpenReview || isOpenInProgress) {
        setIsOpenToDo(false);
        setIsOpenReview(false);
        setIsOpenInProgress(false);
        setIsOpenDone(true);
    } else {
        setIsOpenDone(!isOpenDone);
    }
};

const handleDragStart = (event, id) => {
  event.dataTransfer.setData('Text', id);
  event.currentTarget.classList.add('dragged-element');
};

const handleDragEnd = (event) => {
  event.currentTarget.classList.remove('dragged-element'); 
};

const handleDragOver = (event) => {
  event.preventDefault();
};

const handleDrop = (event, newTypeTask) => {
  event.preventDefault();
  const idTask = event.dataTransfer.getData('Text');

  // Отправить запрос на редактирование типа задачи с использованием idTask и newTypeTask
  const data = {
    type: "move",
    id_task: idTask,
    new_type_task: newTypeTask,
  };
  sendJsonMessage(data);
};

const [isExpanded, setIsExpanded] = useState(false);

  const ShowClick = () => {
    setIsExpanded(!isExpanded);
  };


  return (
    <>
      <div className="parrent_title" style={{ justifyContent: "space-between" }}>
        KanbanBoard Соединение: {connectionStatus}
        <button type="button" onClick={props.changeSide} className="form_button">
          {props.wordChange}
        </button>
      </div>

      <div className="message_text" style={{ display: "flex", paddingLeft: 0, paddingBottom: 0, height:'500px' }}>
        <div className="form" 
        style={{ flexDirection: "column", width: "100%", padding: "10px", overflowY: "auto", maxHeight: "500px" }}
        onDragOver={(event) => handleDragOver(event)}
        onDrop={(event) => handleDrop(event, "ToDo")}
        >
          <div className="board_top">
            <div className="board_name"> Создать </div>
            <button className="form_button" style={{ padding: "5px" }} onClick={toggleFormToDo}>
              {isOpenToDo ? "-" : "+"}
            </button>
          </div>
          {isOpenToDo && <AddTask sendJsonMessage={sendJsonMessage} typeTask={typeTask} setIsOpenToDo={setIsOpenToDo} />}
          {tasksToDo.length > 0 ? (
            <div>
                {tasksToDo.map((tasksToDo, index) =>
                    <div className="form" 
                    style={{marginTop: '10px', width: '220px', padding: '0px 10px 10px 10px'}} 
                    key={index} 
                    draggable="true"
                    onDragStart={(event) => handleDragStart(event, tasksToDo.id)}
                    onDragEnd={handleDragEnd} 
                    >
                    <div className="edit_delete" style={{display: 'flex', justifyContent: "flex-end"}}>
                      <EditTask sendJsonMessage={sendJsonMessage} tasks={tasksToDo}/>
                    </div>
                        <div className="username_in_chat" style={{width:"auto", marginTop: "10px"}}>{tasksToDo.name} </div>
                        <div className="messages" style={{padding: "10px 10px"}}>
                          {tasksToDo.description.length > 45 && !isExpanded ? (
                          <>
                            {tasksToDo.description.slice(0, 45)}
                            <button onClick={ShowClick} style={{
                            backgroundColor: "transparent", 
                            border: "none", 
                            cursor: "pointer",
                            }}>&hellip;</button>
                          </>) : (<>
                            {tasksToDo.description}
                          </>)}
                          
                        </div> 
                        <div className="no-chat-selected" style={{textAlign:"right", padding: '0px'}}>{tasksToDo.time_create.substring(0, 16)}  </div> 
                    <div className="edit_delete" style={{display: 'flex', justifyContent: "flex-end"}}>
                      <DelTask sendJsonMessage={sendJsonMessage} id={tasksToDo.id}/>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="no-chat-selected">Нет задач</div>
          )}
        </div>
        <div className="form" 
        style={{ flexDirection: "column", width: "100%", padding: "10px", overflowY: "auto", maxHeight: "500px" }}
        onDragOver={(event) => handleDragOver(event)}
        onDrop={(event) => handleDrop(event, "InProgress")}
        >
          <div className="board_top">
            <div className="board_name"> В процессе </div>
            <button className="form_button" style={{ padding: "5px" }} onClick={toggleFormInProgress}>
              {isOpenInProgress ? "-" : "+"}
            </button>
          </div>
          {isOpenInProgress && <AddTask sendJsonMessage={sendJsonMessage} typeTask={typeTask} setIsOpenInProgress={setIsOpenInProgress}/>}
          {taskInProgress.length > 0 ? (
            <div>
            {taskInProgress.map((taskInProgress, index) =>
                <div className="form" 
                style={{marginTop: '10px', width: '220px', padding: '0px 10px 10px 10px'}} 
                key={index} 
                draggable="true"
                onDragStart={(event) => handleDragStart(event, taskInProgress.id)}
                onDragEnd={handleDragEnd} 
                >
                <div className="edit_delete" style={{display: 'flex', justifyContent: "flex-end"}}>
                  <EditTask sendJsonMessage={sendJsonMessage} tasks={taskInProgress}/>
                </div>
                    <div className="username_in_chat" style={{width:"auto", marginTop: "10px"}}>{taskInProgress.name} </div>
                    <div className="messages" style={{padding: "10px 10px"}}>
                      {taskInProgress.description.length > 45 && !isExpanded ? (
                      <>
                        {taskInProgress.description.slice(0, 45)}
                        <button onClick={ShowClick} style={{
                        backgroundColor: "transparent", 
                        border: "none", 
                        cursor: "pointer",
                        }}>&hellip;</button>
                      </>) : (<>
                        {taskInProgress.description}
                      </>)}
                      
                    </div> 
                    <div className="no-chat-selected" style={{textAlign:"right", padding: '0px'}}>{taskInProgress.time_create.substring(0, 16)}  </div> 
                <div className="edit_delete" style={{display: 'flex', justifyContent: "flex-end"}}>
                  <DelTask sendJsonMessage={sendJsonMessage} id={taskInProgress.id}/>
                </div>
              </div>
            )}
        </div>
          ) : (
            <div className="no-chat-selected">Нет задач</div>
          )}
        </div>
        <div className="form" 
        style={{ flexDirection: "column", width: "100%", padding: "10px", overflowY: "auto", maxHeight: "500px" }}
        onDragOver={(event) => handleDragOver(event)}
        onDrop={(event) => handleDrop(event, "Review")}
        >
          <div className="board_top">
            <div className="board_name"> На проверке </div>
            <button className="form_button" style={{ padding: "5px" }} onClick={toggleFormReview}>
              {isOpenReview ? "-" : "+"}
            </button>
          </div>
          {isOpenReview && <AddTask sendJsonMessage={sendJsonMessage} typeTask={typeTask} setIsOpenReview={setIsOpenReview}/>}
          {taskReview.length > 0 ? (
            <div>
            {taskReview.map((taskReview, index) =>
                <div className="form" 
                style={{marginTop: '10px', width: '220px', padding: '0px 10px 10px 10px'}} 
                key={index} 
                draggable="true"
                onDragStart={(event) => handleDragStart(event, taskReview.id)}
                onDragEnd={handleDragEnd} 
                >
                <div className="edit_delete" style={{display: 'flex', justifyContent: "flex-end"}}>
                  <EditTask sendJsonMessage={sendJsonMessage} tasks={taskReview}/>
                </div>
                    <div className="username_in_chat" style={{width:"auto", marginTop: "10px"}}>{taskReview.name} </div>
                    <div className="messages" style={{padding: "10px 10px"}}>
                      {taskReview.description.length > 45 && !isExpanded ? (
                      <>
                        {taskReview.description.slice(0, 45)}
                        <button onClick={ShowClick} style={{
                        backgroundColor: "transparent", 
                        border: "none", 
                        cursor: "pointer",
                        }}>&hellip;</button>
                      </>) : (<>
                        {taskReview.description}
                      </>)}
                      
                    </div> 
                    <div className="no-chat-selected" style={{textAlign:"right", padding: '0px'}}>{taskReview.time_create.substring(0, 16)}  </div> 
                <div className="edit_delete" style={{display: 'flex', justifyContent: "flex-end"}}>
                  <DelTask sendJsonMessage={sendJsonMessage} id={taskReview.id}/>
                </div>
              </div>
            )}
        </div>
          ) : (
            <div className="no-chat-selected">Нет задач</div>
          )}
        </div>
        <div className="form" 
        style={{ flexDirection: "column", width: "100%", padding: "10px", overflowY: "auto", maxHeight: "500px" }}
        onDragOver={(event) => handleDragOver(event)}
        onDrop={(event) => handleDrop(event, "Done")}
        >
          <div className="board_top">
            <div className="board_name"> Выполнено </div>
            <button className="form_button" style={{ padding: "5px" }} onClick={toggleFormDone}>
              {isOpenDone ? "-" : "+"}
            </button>
          </div>
          {isOpenDone && <AddTask sendJsonMessage={sendJsonMessage} typeTask={typeTask} setIsOpenDone={setIsOpenDone}/>}
          {tasksDone.length > 0 ? (
            <div>
            {tasksDone.map((tasksDone, index) =>
                <div className="form" 
                style={{marginTop: '10px', width: '220px', padding: '0px 10px 10px 10px'}} 
                key={index} 
                draggable="true"
                onDragStart={(event) => handleDragStart(event, tasksDone.id)}
                onDragEnd={handleDragEnd} 
                >
                <div className="edit_delete" style={{display: 'flex', justifyContent: "flex-end"}}>
                  <EditTask sendJsonMessage={sendJsonMessage} tasks={tasksDone}/>
                </div>
                    <div className="username_in_chat" style={{width:"auto", marginTop: "10px"}}>{tasksDone.name} </div>
                    <div className="messages" style={{padding: "10px 10px"}}>
                      {tasksDone.description.length > 45 && !isExpanded ? (
                      <>
                        {tasksDone.description.slice(0, 45)}
                        <button onClick={ShowClick} style={{
                        backgroundColor: "transparent", 
                        border: "none", 
                        cursor: "pointer",
                        }}>&hellip;</button>
                      </>) : (<>
                        {tasksDone.description}
                      </>)}
                      
                    </div> 
                    <div className="no-chat-selected" style={{textAlign:"right", padding: '0px'}}>{tasksDone.time_create.substring(0, 16)}  </div> 
                <div className="edit_delete" style={{display: 'flex', justifyContent: "flex-end"}}>
                  <DelTask sendJsonMessage={sendJsonMessage} id={tasksDone.id}/>
                </div>
              </div>
            )}
        </div>
          ) : (
            <div className="no-chat-selected">Нет задач</div>
          )}
        </div>
      </div>
    </>
  );
}
