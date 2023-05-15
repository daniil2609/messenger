import React from "react";
import { useNavigate } from "react-router-dom";



const AdditionFriends = () => {
    const navigate = useNavigate();
    
    const outgoing = () => {
        navigate("/personalpage/history/outgoing")
    }
    const putgoing = () => {
        navigate("/personalpage/history/putgoing")
    }
    const rejected = () => {
        navigate("/personalpage/history/rejected")
    }

    return(
        <>
        <form className="form">
          <div className="form_group">
            <div className="form_title">История запросов:</div>
          </div>
          <div className="parent_button">
            <button type="button" className="form_button" onClick={outgoing}>Исходящие</button>
          </div>
          <div className="parent_button" style={{marginTop: '20px'}}>
            <button type="button" className="form_button" onClick={putgoing}>Входящие</button>
          </div>
          <div className="parent_button" style={{marginTop: '20px'}}>
            <button type="button" className="form_button" onClick={rejected}>Ранее отклоненные</button>
          </div>
        </form>
        </>
    )
}

export default AdditionFriends