import React, { useState, useEffect} from "react";
import HeaderFriends from "../HeaderFriends";
import HeaderPersonalPage from "../HeaderPersonalpage";
import axios from "axios";
import AdditionFriends from "../AdditionFriends";
import ReqFriend from "../ReqFriend";

const SearchFriends = () => {
    const [formData, setFormData] = useState({
        message: ''
    })

    const [friend, setFriend] = useState([{}])

    const [searching, setSearching] = useState(false)

      const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
          });
        }

        const hadleSubmit = e => {
            e.preventDefault();
            axios.get(`http://127.0.0.1:8000/api/v1/friend/search_friends/?message=${formData.message}`, {
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
    if (searching == false){
        return (
            <>
                <HeaderPersonalPage/>
                <div className="form-wrapper">
                <HeaderFriends />
                <form onSubmit={hadleSubmit} className="form" style={{height: '100px'}}>
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
                <AdditionFriends />
                </div>
            </>
        )
    } else{
        if (friend.length === 0){
            return(
                <>
                    <HeaderPersonalPage />
                    <div className="form-wrapper">
                    <HeaderFriends />
                    <div className="form-center">
                    <form onSubmit={hadleSubmit} className="form" style={{height: '100px'}}>
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
            <form className="form" style={{marginTop: '20px', textAlign: 'center'}}>
                <div className="form_group"> Пользователи не найдены! </div>  
            </form>
            </div>
            <AdditionFriends />
            </div>
                </>
            )
        }
        else{
            return (
                <>
        <HeaderPersonalPage />
        <div className="form-wrapper">
        <HeaderFriends />
        <div className="form-center">
        <form onSubmit={hadleSubmit} className="form" style={{height: '100px'}}>
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
            <form className="form" key={index} style={{marginTop: '20px'}}>
                <div className="form_group"> Логин: 
                    {friendData.username}
                </div>
                <div className="form_group"> Почта: 
                    {friendData.email}
                </div>
                <ReqFriend friendData={friendData} setFriend={setFriend}></ReqFriend>
        </form>
            ))}
        </div>
        <AdditionFriends />
        </div>
      </>
            )
        }
    }

}

export default SearchFriends