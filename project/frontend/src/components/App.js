import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React from 'react';
import Homepage from "./pages/Homepage";
import Registration from "./pages/Registration"
import Authorization from './pages/Authorization';
import Personalpage from "./pages/Personalpage"

function App() {
    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/sign_up" element={<Registration/>}/>
            <Route path="/sign_in" element={<Authorization/>}/>
            <Route path="/personalpage" element={<Personalpage/>}/>
        </Routes>
        </BrowserRouter>

        </>
    );
}

export default App;
