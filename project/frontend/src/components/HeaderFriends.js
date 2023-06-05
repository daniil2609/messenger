import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderFriends = ({setFriends}) => {
    const navigate = useNavigate();

    const my_friends = () => {
        navigate("/personalpage/my_friends")
    }
    const search_friends = () => {
        navigate("/personalpage/search_friends")
    }

    return (
        <>
        <form className="form" style={{height: '100px'}} >
          <div className="parent_button">
            <button type="button" className="form_button" onClick={my_friends}>Мои контакты</button>
          </div>
          <div className="parent_button" style={{marginTop: '20px'}}>
            <button type="button" className="form_button" onClick={search_friends}>Найти пользователей</button>
          </div>
        </form>
        </>
    )
}

export default HeaderFriends