import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React from 'react';
import Homepage from "./pages/Homepage";
import Registration from "./pages/Registration"
import Authorization from './pages/Authorization';
import Datauser from './pages/Datauser';
import Friends from './pages/Friends';
import Chats from './pages/Chats';
import SearchFriends from './pages/Searchfriends';
import Outgoing from './pages/Outgoing';
import Putgoing from './pages/Putgoing';
import Rejected from './pages/Rejected';



function App() {
    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/sign_up" element={<Registration/>}/>
            <Route path="/sign_in" element={<Authorization/>}/>
            <Route path="/personalpage/datauser" element={<Datauser/>}/>
            <Route path="/personalpage/my_friends" element={<Friends/>}/>
            <Route path="/personalpage/search_friends" element={<SearchFriends/>}/>
            <Route path="/personalpage/chats" element={<Chats/>}/>
            <Route path="/personalpage/history/outgoing" element={<Outgoing/>}/>
            <Route path="/personalpage/history/putgoing" element={<Putgoing/>}/>
            <Route path="/personalpage/history/rejected" element={<Rejected/>}/>
        </Routes>
        </BrowserRouter>

        </>
    );
}

export default App;
