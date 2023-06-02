import React, {useState} from "react";

const ModuleEditTask = ({isOpen, onClose, onSubmit, tasks}) => {

    const [data, setData] = useState({
        type: "edit",
        id_task: tasks.id,
        new_name_task: tasks.name,
        new_description_task: tasks.description
    })

    const handleSubmit = () => {
        onSubmit(data);
        onClose();
      };
    
      const closed = (event) => {
        event.preventDefault();
        onClose();
      };

      const handleInputChange = (event) => {
        event.preventDefault();
        const updateData = {
            ...data,
            [event.target.name] : event.target.value
        };
        setData(updateData);
        console.log(updateData)
      };

      const stopRefresh = (event) => {
        event.stopPropagation(); // Предотвращаем всплытие события
      };
    

    return(
        <>
        <div className={`modal ${isOpen ? "open" : ""}`}>
      <form className="form" style={{
        backgroundColor: 'white',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        width: '350px'
      }} onClick={closed}>
        <button style={{ 
            backgroundColor: "transparent", 
            border: "none", 
            cursor: "pointer",
            marginLeft: 'auto',
            }} 
        >&#10006;
        </button>
                <div className="form_title" style={{padding:'5px', margin: '0 0 10px 0'}}>Редактирование задачи
                </div>
                <div className="form_group" style={{display: 'flex', alignItems: 'center', padding:'5px' }}>
                    <label htmlFor="new_name_task" className="form__label" style={{flex: 1, marginRight: '1rem', marginBottom: '10px'}} >Задача: </label> 
                    <input 
                    className="form_input"
                    type="text" 
                    name="new_name_task" 
                    value={data.new_name_task || ''}
                    onChange={handleInputChange}
                    style={{ flex: 2 }}
                    onClick={stopRefresh}
                    />
                </div>
                <div className="form_group" style={{display: 'flex', alignItems: 'center', padding:'5px' }}>
                    <label htmlFor="new_description_task" className="form__label" style={{flex: 1, marginRight: '1rem', marginBottom: '10px'}} >Описание: </label> 
                    <input 
                    className="form_input"
                    type="text" 
                    name="new_description_task" 
                    value={data.new_description_task || ''}
                    onChange={handleInputChange}
                    style={{ flex: 2 }}
                    onClick={stopRefresh}
                    />
                </div>
                <div className="parent_button">
                <button className="form_button" onClick={handleSubmit}>Ок</button>
                </div>
            </form>
      </div>
        </>
    )
}

export default ModuleEditTask