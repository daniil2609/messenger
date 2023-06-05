import React, {useState, useEffect} from "react"
import axios from "axios"
import HeaderHomePage from "../HeaderHomepage"
import ResponseModule from "../ResponseModule"

const Registration = () => {
    //создание formData с помощью хука Реакта - useState 
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });


    const [response_, setResponse] = useState(false)
    const [text, setText] = useState("")

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
    axios.post("http://127.0.0.1:8000/api/v1/auth/register/", formData, {
            headers: {
                'X-CSRFToken': csrfToken
            },
            withCredentials: true
        })
        .then(response => {
            if (response.data.detail === "Regestration successfully, confirm email"){
                setResponse(true)
                setText("Регистрация выполнилась успешно, необходимо подтвердить почту!")
            }
        })
        .catch(error => {
            console.log(error.response.data)
            if (error.response.data.detail === "User already exists") {
                setResponse(true)
                setText("Такой пользователь уже существует!")
            } else if (error.response.data.detail === "Bad data regestration"){
                setResponse(true)
                setText("Пожалуйста, проверьте введенные данные!")
            }
        })
        }

        return (
            <>
            <HeaderHomePage/>
            {response_ && <ResponseModule response_={response_} text={text} setResponse={setResponse}/>}
            <div className="moving">
            <form onSubmit={hadleSubmit} className="form">
                <div className="form_title">Регистрация</div>
                <div className="form_group">
                    <input 
                    className="form_input"
                    type="text" 
                    id="username" 
                    name="username" 
                    placeholder=" "
                    value={formData.username}
                    onChange={handleChange}
                    />
                    <label htmlFor="username" className="form_label">Логин</label> 
                </div>
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
                <input type="submit" value="Зарегистрироваться" className="form_button"/>
                </div>
            </form>
            </div>
                
            </>
        )
  
}
        
export default Registration