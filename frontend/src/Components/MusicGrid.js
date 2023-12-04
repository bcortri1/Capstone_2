import React, { useEffect, useState } from "react";
import MusicBlock from "./MusicBlock";
import Path from "./Path";
import "./Styles/MusicGrid.css";
//We need to save path info
//We need to save block values
//We need to create a function that keeps each connected block up to date with eachother
//Theoretically this could be an array of connected blocks [starting blocks or not]

const MusicGrid = ({ tool, setSelected, selected, updateStart, save = { data: null, title: null }, paths, addPath, removePath }) => {
    const gridX = 25;
    const gridY = 35;
    let gridRows = [];
    let gridColumns = [];
    //let blockList = {};//Maybe instead of storing only the starting block I need to store each block
    const [blockList, setBlockList] = useState({});

    const Action = (evt)=>{
        console.log("Action");
        console.log(evt.target);
    }
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

    //Recursively loads blocks from saved path
    //Returns an object
    const handleLoadBlocks = (blockArr, blockObj = {}) => {
        if (blockArr !== null) {
            console.log(blockArr)
            blockArr.forEach((nBlock) => {
                blockObj[nBlock.id] = nBlock;
                handleLoadBlocks(nBlock.nextBlocks, blockObj);
            })
        }
        return blockObj;
    }


    let savedBlocks = handleLoadBlocks(save.data);
    //console.debug("Loading Paths:", savedBlocks);


    for (let x = 0; x < gridX; x++) {
        for (let y = 0; y < gridY; y++) {
            if (savedBlocks[`block-${x}-${y}`]) {
                console.debug("Loading Saved Block", `block-${x}-${y}` )
                gridColumns.push(<MusicBlock id={`block-${x}-${y}`} updateStart={updateStart} setSelected={setSelected} tool={tool} selected={selected} key={`block-${x}-${y}`} addPath={addPath} removePath={removePath} save={savedBlocks[`block-${x}-${y}`]} />)
            }
            else {
                gridColumns.push(<MusicBlock id={`block-${x}-${y}`} updateStart={updateStart} setSelected={setSelected} tool={tool} selected={selected} key={`block-${x}-${y}`} addPath={addPath} removePath={removePath} />)
            }
        }
        gridRows.push(<tr key={`row-${x}`}>{gridColumns}</tr>)
        gridColumns = [];
    }

    return (
        <div className="TableContainer">
            <table id="MusicGrid">
                <tbody onClick={Action}>
                    {gridRows}
                </tbody>
            </table>
            {paths}
        </div>
    );
}

export default MusicGrid;