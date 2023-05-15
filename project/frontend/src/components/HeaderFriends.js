import React from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderFriends = () => {
    const Location = useLocation();
    return (
        <>
        <div className="moving">
            <header>
            <nav>
                <ul>
                <li><Link to="/personalpage/my_friends">Мои друзья</Link></li>
                <li><Link to="/personalpage/search_friends">Найти друзей</Link></li>
                </ul>
            </nav>
            </header>  
            
        </div>
        </>
    )
}

export default HeaderFriends