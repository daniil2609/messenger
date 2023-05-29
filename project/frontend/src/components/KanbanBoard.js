import React, { useState, useRef, useEffect } from "react"; 
import useWebSocket, { ReadyState } from "react-use-websocket"; 
import axios from "axios";

export default function KanbanBoard(props) {
        //******************************************************************************
    //вебсокет для досок kanban: 
    const { readyState, sendJsonMessageKanban } = useWebSocket(`ws://127.0.0.1:8000/ws/chat/board/${props.selectedChat.name}/`, { 
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
                    console.log('Начало kanban:') 
                    console.log(data.ToDo) 
                    console.log(data.InProgress)
                    console.log(data.Review)
                    console.log(data.Done) 
                    console.log('Конец kanban:') 
                    break; 
                case "Kanban_error":
                    console.log('Начало ОШИБКИ kanban:') 
                    console.log(data.message)
                    console.log('Конец ОШИБКИ kanban:')
                default: 
                    bash.error("Unknown message type!"); 
                    break; 
                } 
        } 
    }); 
    const connectionStatus = { 
        [ReadyState.CONNECTING]: "Connecting", 
        [ReadyState.OPEN]: "Open", 
        [ReadyState.CLOSING]: "Closing", 
        [ReadyState.CLOSED]: "Closed", 
        [ReadyState.UNINSTANTIATED]: "Uninstantiated" 
    }[readyState]; 

    const AddTaskKanban = () => { 
        sendJsonMessageKanban({ 
            type: "add", 
            type_task, //ToDo, InProgress, Review, Done (строкой) (если не так, то в ToDo запихнет)
            name_task,
            description_task,
        }); 
    };

    const DeleteTaskKanban = () => { 
        sendJsonMessageKanban({ 
            type: "delete", 
            id_task,
        }); 
    };

    const EditTaskKanban = () => { 
        sendJsonMessageKanban({ 
            type: "edit", 
            id_task,
            new_name_task, //если пустая строка, то оставит имя прежним
            new_description_task, //если пустая строка, то оставит описание прежним
        }); 
    };

    const MoveTaskKanban = () => { 
        sendJsonMessageKanban({ 
            type: "move", 
            id_task,
            new_type_task, //ToDo, InProgress, Review, Done (строкой) (если не так, то в ToDo запихнет)
        }); 
    };

    //*************************************************************************************

    return ( 
        <>
            <div>
                <div className="parrent_title" style={{justifyContent:'space-between'}}>KanbanBoard Соединение: {' ' + connectionStatus}</div>
            </div>
        </>
    ); 
}