import React, {useState} from "react";
import ModuleEditTask from "./ModuleEditTask";


const EditTask = ({sendJsonMessage, tasks}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
      };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const EditTaskKanban = (data) => {
        sendJsonMessage(data);
      };
    
    return(
        <>
        <button onClick={openModal} style={{
            backgroundColor: "transparent", 
            border: "none", 
            cursor: "pointer",
            fontSize: '20px',
            marginTop: '8px'
            }}>&#128393;</button>
            <ModuleEditTask isOpen={isModalOpen} onClose={closeModal} onSubmit={EditTaskKanban} tasks={tasks}/>
        </>
    )
}

export default EditTask