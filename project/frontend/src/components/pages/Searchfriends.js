import React, { useState, useEffect} from "react";
import HeaderFriends from "../HeaderFriends";
import HeaderPersonalPage from "../HeaderPersonalpage";
import axios from "axios";
import AdditionFriends from "../AdditionFriends";

const SearchFriends = () => {
    const [formData, setFormData] = useState({
        message: ''
    })

    const [reqfriend, setreqfriend] = useState({
        to_user: '',
        message: ''
    })

    const [friend, setFriend] = useState([{}])

    const [searching, setSearching] = useState(false)

    const [csrfToken, setCsrfToken] = useState("");
    useEffect(() => {
        const cookieValue = document.cookie //получаем все cookie в виде строки
        .split(';') //разбитие строки на массив из строк 
        .find(row => row.startsWith('csrftoken=')) //поиск cookie с названием csrftoken 
        ?.split('=')[1]; //получение значение токена
    
        setCsrfToken(cookieValue); //сохранение значение в состоянии компонента
      }, []);

      const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
          });
        }

        const hadleSubmit = e => {
            e.preventDefault();
            console.log('X-CSRF-Token: ' + csrfToken)
            axios.post("http://127.0.0.1:8000/api/v1/friend/search_friends/", formData, {
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    withCredentials: true
                })
                .then(responce => {
                    setSearching(true)
                    setFriend(responce.data)
                })
                .catch(error => {
                    alert("Ошибка поиска")
                })
                }

                const AddFriend = (e, email) => {
                    e.preventDefault();
                    console.log(email)
                    setreqfriend({
                        to_user : email,
                        message : ''
                    })
                }

                useEffect(() => {
                    axios.post("http://127.0.0.1:8000/api/v1/friend/add_friend/", reqfriend, {
                        headers: {
                          'X-CSRFToken': csrfToken
                        },
                        withCredentials: true
                      })
                      .then(response => {
                        console.log(response);
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  }, [reqfriend]);

    if (searching == false){
        return (
            <>
                <HeaderPersonalPage/>
                <HeaderFriends />
                <AdditionFriends />
                <form onSubmit={hadleSubmit} className="form" >
                    <div className="form_group">
                        <input 
                        className="form_input"
                        type="text" 
                        id="message" 
                        name="message" 
                        placeholder=" "
                        value={formData.message}
                        onChange={handleChange}
                        />
                        <label htmlFor="search" className="form_label">Поиск</label> 
                    </div>
                    <div className="parent_button">
                    <input type="submit" value="Поиск" className="form_button"/>
                    </div>
                </form>
            </>
        )
    } else{
        if (friend.length === 0){
            return(
                <>
                    <HeaderPersonalPage />
                    <HeaderFriends />
                    <AdditionFriends />
                    <form onSubmit={hadleSubmit} className="form">
          <div className="form_group">
            <input 
              className="form_input"
              type="text" 
              id="message" 
              name="message" 
              placeholder=" "
              value={formData.message}
              onChange={handleChange}
            />
            <label htmlFor="search" className="form_label">Поиск</label> 
          </div>
          <div className="parent_button">
            <input type="submit" value="Поиск" className="form_button"/>
          </div>
        </form>
            <form className="form">
                <div className="form_group"> Пользователи не найдены! </div>  
            </form>
                </>
            )
        }
        else{
            return (
                <>
        <HeaderPersonalPage />
        <HeaderFriends />
        <AdditionFriends />
        <form onSubmit={hadleSubmit} className="form">
          <div className="form_group">
            <input 
              className="form_input"
              type="text" 
              id="message" 
              name="message" 
              placeholder=" "
              value={formData.message}
              onChange={handleChange}
            />
            <label htmlFor="search" className="form_label">Поиск</label> 
          </div>
          <div className="parent_button">
            <input type="submit" value="Поиск" className="form_button"/>
          </div>
        </form>
        {friend.map((friendData, index)=>(
            <form className="form" key={index}>
                <div className="form_group"> Логин: 
                    {friendData.username}
                </div>
                <div className="form_group"> Почта: 
                    {friendData.email}
                </div>
                <div className="parent_button">
                    <button className="form_button" onClick={(e) => {AddFriend(e, friendData.email)}}> Добавить в друзья </button>
                </div>
        </form>
            ))}
      </>
            )
        }
    }

}

export default SearchFriends