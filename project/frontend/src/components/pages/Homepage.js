import React from "react"
import { Link } from "react-router-dom"

const Homepage = () => {
    return (
        <>
        <Link to="sign_up">Регистрация</Link>
        <Link to="sign_in">Авторизация</Link>
        <div>
            <h1>Домашняя страница 1</h1>
        </div>
        </>
    )
}

export default Homepage