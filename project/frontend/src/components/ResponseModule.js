import React from "react";

const ResponseModule = ({response_, text, setResponse}) => {
    
    const removeModule = () => {
        setResponse(false)
    }

    return (
        <>
        {response_ ? (
        <>
            <div className="container_responses">
            <div className="form" style={{display: 'flex', flexDirection: 'column', padding: '15px'}}>
            <button style={{ 
            backgroundColor: "transparent", 
            border: "none", 
            cursor: "pointer",
            marginLeft: 'auto',
            }} onClick={() => removeModule()} 
            >&#10006;</button>
            <div className="messages" style={{textAlign:'center'}}> {text} </div> 
            </div>
            </div>
        </>) : ("")}
        </>
    )
}

export default ResponseModule