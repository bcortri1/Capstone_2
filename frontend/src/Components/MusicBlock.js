import React from "react";
import "./Styles/MusicBlock.css";

//UI representation of Music Block, interactions handled by MusicGrid
const MusicBlock = ({id, classes="MusicBlock", symbol='\u{2311}' }) => {
    
    return <td id={id} className={classes}>{symbol}</td>
}

export default MusicBlock;