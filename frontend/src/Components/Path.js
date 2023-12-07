import React from "react";
import Xarrow from "react-xarrows";
import "./Styles/Path.css";

//Path between two music blocks
const Path = ({ startId, endId}) => {
    return (
        <Xarrow start={startId} end={endId} path="grid"/>
    )
}

export default Path;