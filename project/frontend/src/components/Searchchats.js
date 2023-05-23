import React, {useState} from "react";
import AddGroupChat from "./AddGroupChat";
import GetSearch from "./GetSearch";

const Searchchats = () =>{

    const [isOpen, setIsOpen] = useState(false);
    const [sign, setSign] = useState("+")
    const [isSearch, setIsSearch] = useState(false);
    const [signSearch, setSignSearch] = useState("Поиск");
    const [searchValue, setSearchValue] = useState({
      message: "",
  });

    const handleSearchChange = (event) => {
      setSearchValue(event.target.value);
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
        setSignSearch("Назад");
        setIsSearch(!isOpen);
        } else {
          setSignSearch("Поиск");
          setIsSearch(false);
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
                onChange={handleSearchChange}
                />
                <label htmlFor="search" className="form_label">Поиск групповых чатов</label>
                <button type="button" style={{marginLeft: '20px', padding: '6px 15px'}} className="form_button"onClick={SearchGroup}>{signSearch}</button>
                <button type="button" style={{marginLeft: '20px', padding: '6px 15px'}} className="form_button" onClick={AddGroup}>{sign}</button>
          </div>
        </form>

        {isOpen && (<AddGroupChat/>)}
        {isSearch && (<GetSearch message={searchValue}/>)}
        </>

    )
}

export default Searchchats