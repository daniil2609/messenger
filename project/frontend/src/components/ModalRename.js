import React, { useState } from "react";

const InputModal = ({ isOpen, onClose, onSubmit, selectedChat }) => {
  const [inputValue, setInputValue] = useState({
    id: selectedChat.id,
    name: selectedChat.display_name
  });

  const handleInputChange = (event) => {
    event.preventDefault();
    const updateData = {
        ...inputValue,
        [event.target.name] : event.target.value
    };
    setInputValue(updateData);
    console.log(updateData)
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose();
  };

  const closed = (event) => {
    event.preventDefault();
    onClose();
  };

  const stopRefresh = (event) => {
    event.stopPropagation(); // Предотвращаем всплытие события
  };


    
  return (
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
                <div className="form_title" style={{padding:'5px', margin: '0 0 10px 0'}}>Переименовать название чата
                </div>
                <div className="form_group" style={{display: 'flex', alignItems: 'center', padding:'5px' }}>
                    <label htmlFor="name" className="form__label" style={{flex: 1, marginRight: '1rem', marginBottom: '10px'}} >Новое имя: </label> 
                    <input 
                    className="form_input"
                    type="text" 
                    name="name" 
                    value={inputValue.name || ''}
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
  );
};

export default InputModal;