import React from "react";
import Xarrow from "react-xarrows";
import "./Styles/Path.css";

//Path between two music blocks
const Path = ({ startId, endId, active }) => {
    return (
        <Xarrow start={startId} end={endId}/>
    )
}

export default Path;