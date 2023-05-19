import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

const AddGroupChat = () => {

    const [formData, setFormData] = useState({
        name : '',
        type: ''
    })

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
    
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const fieldValue = type === "checkbox" ? (checked ? value : "") : value;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: fieldValue
        }));
      };

      const hadleSubmit = e => {
        e.preventDefault();
        console.log(formData)
        console.log('X-CSRF-Token: ' + csrfToken)
        axios.post("http://127.0.0.1:8000/api/v1/chat/create_room/", formData, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            .then(responce => {
                console.log("Чат создан!")
                window.location.reload();
            })
            .catch(function(error) {
                console.log("Чат не создан!")
            })
            }

        return (
            <>
            <form className="form" onSubmit={hadleSubmit} style={{marginLeft: '10px', marginTop: '10px'}}>
            <div className="form_title">Создать групповой чат</div>
            <div className="form_group">
                    <input
                    className="form_input" 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    />
                    <label htmlFor="name" className="form_label">Название группы</label>
            </div>
            <div className="form_group">        
            <label>
                Публичный чат
                <input
                type="checkbox"
                name="type"
                value={"2"}
                checked={formData.type === "2"}
                onChange={handleChange}
                />
            </label>
            </div>
            <div className="form_group"> 
            <label>
                Приватный чат
                <input
                type="checkbox"
                name="type"
                value={"3"}
                checked={formData.type === "3"}
                onChange={handleChange}
                />
            </label>

            </div>
            <div className="parent_button">
                <button type="submit" className="form_button"> Создать </button>
            </div>
            </form>
            </>
        )
    }

export default AddGroupChat   