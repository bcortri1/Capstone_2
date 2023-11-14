import React, { useEffect, useState } from "react";
import MusicBlock from "./MusicBlock";
import Path from "./Path";
import "./Styles/MusicGrid.css";

const MusicGrid = ({ tool, setSelected, selected, updateStart, saved = {paths:[], startBlocks:[]}, paths, addPath, removePath }) => {
    const gridX = 25;
    const gridY = 35;
    let gridRows = [];
    let gridColumns = [];
    ///const startItems = [];

    // const initialState = {
    //     paths: saved.paths || [],
    //     blocks: saved.startBlocks || []
    // }
    // const [paths, setPaths] = useState(initialState.paths);

    // const addPath = (startId, endId) => {
    //     console.log("Creating A Path");
    //     let key = "path" + startId.replace('block', '') + endId.replace('block', '');
    //     console.log(key);
    //     setPaths((paths) => [...paths, <Path id={key} key={key} startId={startId} endId={endId} active={false} />])
    // }



    // const removePath = (startId, endId) => {
    //     console.log("Removing A Path");
    //     let key = "path" + startId.replace('block', '') + endId.replace('block', '');
    //     console.log(key)
    //     setPaths((paths) => {
    //         paths = paths.filter((path) => path.key !== key);
    //         return paths;
    //     })
    // }


    for (let x = 0; x < gridX; x++) {
        for (let y = 0; y < gridY; y++) {
            gridColumns.push(<MusicBlock id={`block-${x}-${y}`} updateStart={updateStart} setSelected={setSelected} tool={tool} selected={selected} key={`block-${x}-${y}`} addPath={addPath} removePath={removePath} />)
        }
        gridRows.push(<tr key={`row-${x}`}>{gridColumns}</tr>)
        gridColumns = [];
    }

    return (
        <div className="TableContainer">
            <table id="MusicGrid">
                <tbody>
                    {gridRows}
                </tbody>
            </table>
            {paths}
        </div>
    );
}

export default MusicGrid;