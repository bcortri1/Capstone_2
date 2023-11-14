import React from "react";
import { Button } from "reactstrap";
import "./Styles/NoteList.css"

const NoteList = ({notes=[], remove}) => {

    return (
        <div className="NoteList">
            {notes.map((note, index)=>
                <div className="NoteCard" key={index +'note-card'}>
                    <span>{note.pitch+note.octave}</span>
                    <Button color="danger" style={{float:"right"}} onClick={()=>remove(index)}>&minus;</Button>
                </div>
            )}
        </div>
    )
}

export default NoteList;