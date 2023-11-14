import React from "react";
import { Button, ButtonGroup } from "reactstrap";
import "./Styles/ToolBox.css"


const ToolBox = ({ toolChange, tool, togglePlaying, playing }) => {

    const handleTool = (evt) => {
        evt.preventDefault();
        toolChange(evt.target.title);
    }

    const handleSave = (evt) => {
        console.log("Saving")
    }

    return (
        <div className="ToolBox">
            <ButtonGroup id="save-btn-group">
                <Button onClick={handleSave} title="Save">&#128190;&#xFE0E;</Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    className="tool-btn"
                    onClick={handleTool}
                    style={{ backgroundColor: tool === "Select" ? "black" : "gray" }}
                    id="select-note-btn"
                    title="Select"
                >&#9757;</Button>
                <Button
                    className="tool-btn"
                    onClick={handleTool}
                    style={{ backgroundColor: tool === "Add/Delete" ? "black" : "gray" }}
                    id="add-note-btn"
                    title="Add/Delete"
                >&#177;</Button>
                <Button
                    className="tool-btn"
                    onClick={handleTool}
                    style={{ backgroundColor: tool === "Paths" ? "black" : "gray" }}
                    id="path-note-btn"
                    title="Paths"
                >&#8599;</Button>
            </ButtonGroup>

            <ButtonGroup>
                {playing ?
                    <Button color="danger" onClick={togglePlaying} title="Play/Pause">&#9208;&#xFE0E;</Button>
                    : <Button color="success" onClick={togglePlaying} title="Play/Pause">&#x25B6;&#xFE0E;</Button>}
            </ButtonGroup>


        </div>
    )
}

export default ToolBox;