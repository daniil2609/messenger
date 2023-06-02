import React, {useState} from "react";


const DelTask = ({sendJsonMessage, id}) => {

    const [data, setData] = useState({
        type: "delete",
        id_task: id,
    })
 
    const DeleteTaskKanban = () => {
        console.log(data)
        sendJsonMessage(data);
      };

    return(
        <>
            <div className="parent_button">
                <button className="form_button" style={{ padding: "5px", marginTop: '10px' }} onClick={DeleteTaskKanban}>&#128465;</button>
            </div>
        </>
    )
}

export default DelTask