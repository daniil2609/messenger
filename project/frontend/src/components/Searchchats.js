import React, {useState} from "react";
import AddGroupChat from "./AddGroupChat";

const Searchchats = ({setSearching, handleSearchValue, searchValue}) =>{

    const [isOpen, setIsOpen] = useState(false);
    const [sign, setSign] = useState("+")
    const [signSearch, setSignSearch] = useState("Поиск");

    const handleSearchChange = (event) => {
      handleSearchValue({
        ...searchValue,
        [event.target.name]: event.target.value
      });
    };

    const AddGroup = () => {
        if (sign === "+") {
            setSign("-");
            setIsOpen(!isOpen);
          } else {
            setSign("+");
            setIsOpen(false);
          }
    }

    const SearchGroup = () => {
      if (signSearch === "Поиск") {
        setSearching(true); 
        setSignSearch("Назад");
        handleSearchValue(searchValue);
      } else {
        document.getElementById("message").value = ""
        setSearching(false); 
        setSignSearch("Поиск");
      }
    };
    

    return(
        <>
        <form className="form" style={{width: '350px', padding: '20SearchGroupmopx', marginTop: '10px', marginLeft:'10px'}}>
            <div id='input_error' className="form_group" style={{display: 'flex'}}>
                <input 
                className="form_input"
                type="text" 
                id="message" 
                name="message" 
                placeholder=" "
                onChange={handleSearchChange}
                />
                <label htmlFor="search" className="form_label">Поиск групповых чатов</label>
                <button type="button" style={{marginLeft: '20px', padding: '6px 15px'}} className="form_button"onClick={SearchGroup}>{signSearch}</button>
                <button type="button" style={{marginLeft: '20px', padding: '6px 15px'}} className="form_button" onClick={AddGroup}>{sign}</button>
          </div>
        </form>

        {isOpen && (<AddGroupChat/>)}
        </>

    )
}

export default Searchchats