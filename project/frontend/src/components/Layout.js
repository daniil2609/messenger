import { Link, Outlet } from "react-router-dom";
import React from "react"

const Layout = () => {
    return (
        <>
        <header>
            <Link to="/">Домашняя страница</Link>
            <Link to="/sign_up">Регистрация</Link>
            <Link to="/sign_in">Авторизация</Link>
        </header>
        <Outlet />
        </>
    )
}

export {Layout}