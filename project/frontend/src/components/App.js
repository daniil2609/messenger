import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React from 'react';
import Homepage from "./pages/Homepage";
import Registration from "./pages/Registration"
import Authorization from './pages/Authorization';
import Datauser from './pages/Datauser';
import Friends from './pages/Friends';
import Chats from './pages/Chats';


function App() {
    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/sign_up" element={<Registration/>}/>
            <Route path="/sign_in" element={<Authorization/>}/>
            <Route path="/personalpage/datauser" element={<Datauser/>}/>
            <Route path="/personalpage/friends" element={<Friends/>}/>
            <Route path="/personalpage/chats" element={<Chats/>}/>
        </Routes>
        </BrowserRouter>

        </>
    );
}

export default App;
