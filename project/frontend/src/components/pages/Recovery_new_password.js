import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom" 
import axios from "axios"
import HeaderHomePage from "../HeaderHomepage"

const Recovery_new_password = () => {
    const query = window.location.pathname.split('/')
    const uidb64 = query[2]
    const token = query[3]
    const navigate = useNavigate();
    //создание formData с помощью хука Реакта - useState 
    const [formData, setFormData] = useState({
        password: "",
    });

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
        try{
        axios.post(`http://127.0.0.1:8000/api/v1/auth/new_password/${uidb64}/${token}/`, formData, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            })
            .then((responce) => {
                console.log(responce.data.detail)
                if (responce.data.detail = "Successfully recovery password"){
                    navigate("/sign_in")
                    alert("Пароль был успешно изменен")
                }
            })
        }
        catch (error) {
            console.error(error)
            navigate("/sign_in")
            alert("Что то пошло не так")
        }

            }
    return (
        <>
        <HeaderHomePage/>
        <div className="moving">
            <form onSubmit={hadleSubmit} className="form">
            <div className="form_title">Введите новый пароль</div>
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
                    <label htmlFor="email" className="form_label">Новый пароль</label>
            </div>
            <div className="parent_button">
                <input type="submit" value="Продолжить" className="form_button"/>
            </div>
            </form>
            </div>
            </>
    )
}

export default Recovery_new_password