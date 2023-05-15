import React, { useEffect, useState } from "react"
import axios from "axios"
import HeaderPersonalPage from "../HeaderPersonalpage"

const Datauser = () => {
    const [data, setData] = useState({
        username: "",
        email: "",
        last_name: ""
    });

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
    
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);
    
    useEffect(() => {
        axios
        .get("http://127.0.0.1:8000/api/v1/auth/me/", { withCredentials: true })
        .then( response => {
            setData(response.data)
            console.log(response.data)
        })
        .catch (error => console.error(error));
    }, []);

    const handleChange = e =>{
        const updateData = {
            ...data,
            [e.target.name] : e.target.value
        };
        setData(updateData);
    }

    const hadleSubmit = e => {
        e.preventDefault();
        const form = document.getElementById("#put_form")
        const data = new FormData(form)
        axios.put("http://127.0.0.1:8000/api/v1/auth/me/", data, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true
            })
            .then(responce => {
                setData(responce.data);
                alert("Данные успешно изменены!")
            })
            .catch((error) => console.error(error));
        }


    return(
        <>
        <HeaderPersonalPage/>
        <div className="moving">
            <form className="form" onSubmit={hadleSubmit} id="#put_form">
                <div className="form_title">Контактная информация</div>
                <div className="form_group" style={{ display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="username" className="form__label" style={{flex: 1, marginRight: '1rem', marginBottom: '10px'}} >Логин: </label> 
                    <input 
                    className="form_input"
                    type="text" 
                    name="username" 
                    value={data.username}
                    style={{ flex: 2 }}
                    onChange={handleChange}
                    />
                </div>
                <div className="form_group" style={{ display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="email" className="form__label" style={{flex: 1, marginRight: '1rem', marginBottom: '10px'}}>Почта: </label> 
                    <input
                    className="form_input" 
                    type="text" 
                    name="email" 
                    value={data.email}
                    style={{ flex: 2 }}
                    onChange={handleChange}
                    />
                </div>
                <div className="form_group" style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="password" className="form__label" style={{flex: 1, marginRight: '1rem', marginBottom: '10px'}}>Фамилия: </label> 
                    <input
                    className="form_input" 
                    type="text" 
                    name="last_name"
                    value={data.last_name || ''}
                    style={{ flex: 2 }}
                    onChange={handleChange}
                    />
                </div>
                <div className="parent_button">
                <input type="submit" value="Редактировать" className="form_button"/>
                </div>
            </form>
            </div>
        </>
    )
}

export default Datauser