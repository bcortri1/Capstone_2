import React from "react";
import ToolBox from "./ToolBox";
import BlockDetail from "./BlockDetail";
import "./Styles/DetailContainer.css";

const DetailContainer = ({ selected, samples, loading, setTool, tool, togglePlaying, playing, saveSong}) => {

    return (
        <div className="DetailContainer">
            <ToolBox toolChange={setTool} tool={tool} togglePlaying={togglePlaying} playing={playing} saveSong={saveSong} />
            <BlockDetail selected={selected} samples={samples} loading={loading} />
        </div>

    )
}

export default DetailContainer;