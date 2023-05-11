import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom" 
import axios from "axios"
import HeaderHomePage from "../HeaderHomepage"

const Authorization = () => {
    //создание formData с помощью хука Реакта - useState 
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
    
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);

    //функция для добавления значений в объект
    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
          });
        }
    
        //функция для отправки данных с токеном на сервер
        const hadleSubmit = e => {
        e.preventDefault();
        console.log(formData)
        console.log('X-CSRF-Token: ' + csrfToken)
        axios.post("http://127.0.0.1:8000/api/v1/auth/login/", formData, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            .then(responce => {
                if (responce.data.detail = "Successfully logged in."){
                    navigate("/personalpage/chats")
                }
            })
            .catch(function(error) {
                if (error.message = "Request failed with status code 403"){
                    console.log("Ошибка авторизации")
                }
            })
            }
    return (
        <>
        <HeaderHomePage/>
        <div className="moving">
            <form onSubmit={hadleSubmit} className="form">
            <div className="form_title">Авторизация</div>
            <div className="form_group">
                    <input
                    className="form_input" 
                    type="text" 
                    id="email" 
                    name="email" 
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    />
                    <label htmlFor="email" className="form_label">Почта</label>
            </div>
            <div className="form_group">        
                    <input
                    className="form_input" 
                    type="text" 
                    id="password" 
                    name="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    />
                    <label htmlFor="password" className="form_label">Пароль</label>
            </div>
            <div className="parent_button">
                <input type="submit" value="Войти" className="form_button"/>
            </div>
            </form>
            </div>
            </>
    )
}

export default Authorization