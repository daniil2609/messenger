import React from 'react';
import { Link } from 'react-router-dom';

const HeaderHomePage = () => {
  return (
    <>
    <header>
      <div className="logo">ThyssenkruppChat</div>
        <nav>
            <ul>
              <li><Link to="/">Главная страница</Link></li>
              <li><Link to="/sign_up">Регистрация</Link></li>
              <li><Link to="/sign_in">Авторизация</Link></li>
            </ul>
        </nav>
      </header>
    </>
  );
}

export default HeaderHomePage
