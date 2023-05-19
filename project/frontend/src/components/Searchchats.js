import React, {useState} from "react";
import AddGroupChat from "./AddGroupChat";

const Searchchats = () =>{

    const [isOpen, setIsOpen] = useState(false);
    const [sign, setSign] = useState("+")

    const AddGroup = () => {
        if (sign === "+") {
            setSign("-");
            setIsOpen(!isOpen);
          } else {
            setSign("+");
            setIsOpen(false);
          }
    }
    

    return(
        <>
        <form className="form" style={{width: '350px', padding: '20px', marginTop: '10px', marginLeft:'10px'}}>
            <div className="form_group" style={{display: 'flex'}}>
                <input 
                className="form_input"
                type="text" 
                id="message" 
                name="message" 
                placeholder=" "
                />
                <label htmlFor="search" className="form_label">Поиск групповых чатов</label>
                <button type="button" style={{marginLeft: '20px', padding: '6px 15px'}} className="form_button">&#128270;</button>
                <button type="button" style={{marginLeft: '20px', padding: '6px 15px'}} className="form_button" onClick={AddGroup}>{sign}</button>
          </div>
        </form>

        {isOpen && (<AddGroupChat/>)}
        </>

    )
}

export default Searchchats