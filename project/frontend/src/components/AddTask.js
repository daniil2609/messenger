import React, {useState} from "react";


const AddTask = ({sendJsonMessage, typeTask, setIsOpenToDo, setIsOpenInProgress, setIsOpenReview, setIsOpenDone}) => {

    const [data, setData] = useState({
        type: "add",
        type_task: typeTask,
        name_task: '',
        description_task: ''
    })

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
          });
        }
    
    console.log(data.type_task)
    const AddTaskKanban = () => { 
        if (data.type_task === "ToDo"){
            setIsOpenToDo(false);
            sendJsonMessage(data);
            return;
        } else if (data.type_task === "InProgress"){
            setIsOpenInProgress(false);
            sendJsonMessage(data);
            return;
        } else if (data.type_task === "Review"){
            setIsOpenReview(false);
            sendJsonMessage(data);
            return;
    } else if (data.type_task === "Done"){
        setIsOpenDone(false);
        sendJsonMessage(data);
        return;
    }}

    return(
        <>

        <div className="form" style={{width: '165px', marginTop: '10px'}}>
        <div className="form_group">
                    <input
                    className="form_input" 
                    type="text" 
                    id="name_task" 
                    name="name_task" 
                    placeholder=" "
                    value={data.name_task}
                    onChange={handleChange}
                    />
                    <label htmlFor="name_task" className="form_label">Название</label>
            </div>
            <div className="form_group">        
                    <input
                    className="form_input" 
                    type="text" 
                    id="description_task" 
                    name="description_task"
                    placeholder=" "
                    value={data.description_task}
                    onChange={handleChange}
                    />
                    <label htmlFor="description_task" className="form_label">Описание</label>
            </div>
            <div className="parent_button">
                <button className="form_button" onClick={AddTaskKanban} style={{ padding: "5px" }}>Добавить</button>
            </div>
        </div>

        </>
    )
}

export default AddTask