import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom" 
import axios from "axios"

const Logout = () => {

    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);


    const handleLogout = () => { 
        axios
        .post("http://127.0.0.1:8000/api/v1/auth/logout/", null, { 
            headers: { 
                'X-CSRFToken': csrfToken
            } 
        })
        .then((response) => {
            if (response.status = 200){
                navigate("/")
            }
            else{
                alert("Ошибка выхода!")
            }
        })
        .catch ((error) => {
            console.log(error)
        })


    }

    return  (
        <>
            <button onClick={handleLogout}>Выйти</button>
        </>
    )
}

export default Logout