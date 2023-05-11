import React from 'react';
import { Link } from 'react-router-dom';
import Logout from "./Logout"

const HeaderPersonalPage = () => {
  return (
    <>
    <header>
      <div className="logo">ThyssenkruppChat</div>
        <nav>
            <ul>
              <li><Link to="/personalpage/datauser">Мой профиль</Link></li>
              <li><Link to="/personalpage/friends">Друзья</Link></li>
              <li><Link to="/personalpage/chats">Сообщения</Link></li>
            </ul>
        </nav>
      <div className="logout"><Logout /></div>
      </header>
    </>
  );
}

export default HeaderPersonalPage

