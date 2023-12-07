import React, { useEffect} from "react";
import MusicBlock from "./MusicBlock";
import "./Styles/MusicGrid.css";

//We are saving each block inside an object list
//We have all the starting blocks set to an id Array
//We need to save path info as they are made or destroyed
//OR
//We need to make function for recreating paths based on blockList


//A component meant to render, connect, and save/load all MusicBlocks and Paths
const MusicGrid = ({ blockList, setBlockList, tool, setSelected, selected, paths, addPath, removePath }) => {
    const gridX = 25;
    const gridY = 35;
    let gridRows = [];
    let gridColumns = [];

    //Starting defaults for a block
    const blockDefaults = {
        visible: false,
        sample: "Synth",
        length: 1.0,
        notes: [],
        //Set of id's
        prevBlocks: new Set(),
        //Set of id's
        nextBlocks: new Set(),
        start: false
    }

    //Calculates class based off MusicBlock values
    const calcClass = (block) => {
        let result = "MusicBlock"
        if (block.visible) {
            result += " created";
            if (selected) {
                if (selected.id === block.id) {
                    result += " selected";
                }
            }
            if (block.start) {
                result += " start";
            }
        }
        return result;
    }

    //Calculates what a blocks symbol should be
    const calcSymbol = (block) => {
        if (block.visible && !block.start) {
            if (block.notes.length > 9) {
                return `\u{0001F4E3}`
            }
            if (block.notes.length > 0) {
                return `\u{1D15F}x${block.notes.length}`
            }
            else {
                return '\u{1D13D}'
            }
        }
        return block.start ? '\u{23F5}' : '\u{2311}';
    }

    //=======================BLOCKLIST FUNCTIONS========================

    //Updates the specified block in the blockList
    //('block-x-y', {id, created, sample, ... }) => {'block-0-1':..., 'block-0-2':...}
    const updateBlock = (id, obj) => {
        setBlockList((list) => {
            list[id] = { ...list[id], ...obj };
            return list;
        })
    }

    //Whenever selected block values change, the blockList will update block to match
    useEffect(() => {
        //Defining duplicate function here to satisfy react warning (useCallback would work as well)
        const updateBlock = (id, obj) => {
            setBlockList((list) => {
                list[id] = { ...list[id], ...obj };
                return list;
            })
        }

        if (selected.id) {
            console.log("Selected Block Values Updating")
            updateBlock(selected.id, selected);
        }
    }, [selected, setBlockList])

    //Adds a specified block to the blockList with default values
    //({id, created, sample, ... }) => {'block-0-1':..., 'block-0-2':...}
    const addBlock = (id) => {
        setBlockList((list) => {
            list[id] = { id, ...blockDefaults, visible: true };
            return list;
        })
        //Have to include all values else selected ends up incomplete
        changeSelected(id, { id, ...blockDefaults, visible: true });
    }

    //Resets block to default values
    const resetBlock = (id) => {
        let rBlock = blockList[id];
        let nextBlocks = rBlock.nextBlocks;
        let prevBlocks = rBlock.prevBlocks;

        //Remove path from each next block
        //Workaround for issue with function binding
        nextBlocks.forEach((blockId) => {
            removePath(id, blockId);
        })

        //Remove path from each previous block
        //Workaround for issue with function binding
        prevBlocks.forEach((blockId) => {
            removePath(blockId, id);
        })

        setBlockList((list) => {
            //Remove block from each next block
            nextBlocks.forEach((blockId) => {
                list[blockId].prevBlocks.delete(id);
            })

            //Remove block from each previous block
            prevBlocks.forEach((blockId) => {
                list[blockId].nextBlocks.delete(id);
            })

            list[id] = { ...blockDefaults, id };
            return list;
        })
    }

    //Changes current selected to specified block id, also allows specified value updates
    //Requires block id
    const changeSelected = (id, obj = null) => {
        let values = { ...blockList[id], ...obj };
        setSelected(() => values);
    }

    //Adds ids between both blocks
    const addBlockPath = (id) => {
        setBlockList((list) => {
            let pBlock = list[selected.id];
            let nBlock = list[id];
            pBlock.nextBlocks.add(id);
            nBlock.prevBlocks.add(selected.id);
            return list
        })
    }

    //Removes both blocks to each others respective values
    const removeBlockPath = (id) => {
        setBlockList((list) => {
            let pBlock = list[selected.id];
            let nBlock = list[id];

            //Removing nBlock id from previous block
            pBlock.nextBlocks.delete(id);

            //Removing pBlock id from nBlock block
            nBlock.prevBlocks.delete(selected.id);
            return list
        })
    }

    //Updates selected to empty object
    const nullSelected = () => {
        setSelected(() => ({}));
    }

    //Handles Block Visibility
    const toggleVisible = (id) => {
        //Resets created visible blocks and removes them from selection
        if (blockList[id] !== undefined) {
            if (blockList[id].visible) {
                resetBlock(id);
                nullSelected();
            }
            //Makes block visible and sets it as selected
            else {
                updateBlock(id, { ...blockDefaults, ...blockList[id], visible: true })
                changeSelected(id, { visible: true });
            }
        }
        //If block has yet to be created
        else {
            addBlock(id);
        }

    };

    //Handles various behaviors of Paths Tool
    const handlePathsTool = (targetId) => {
        //Checks if block is previously in path, returns a number, if that number is greater than zero a loop has been found
        const checkLoop = (id, result = 0) => {
            let block = blockList[id];
            if (!block.start && block.id === targetId) {
                return result + 1;
            }
            block.prevBlocks.forEach((pBlock) => {
                result += checkLoop(pBlock, result);
            });
            return result;
        }
        //Preventing path tool from targeting undefined blocks
        if (selected.id !== undefined && blockList[targetId]) {
            let startId = selected.id;
            //If not targeting self
            if (selected.id !== targetId) {
                if (!selected.start || !blockList[targetId].start) {
                    let loop = checkLoop(selected.id) > 0;
                    let duplicate = selected.nextBlocks.has(targetId);

                    //If not found
                    if ((duplicate === false) && (loop === false)) {
                        addPath(startId, targetId);
                        //addPrev(targetId);
                        addBlockPath(targetId);
                        changeSelected(targetId);
                    }
                    else {
                        removePath(startId, targetId);
                        //removePrev(targetId);
                        removeBlockPath(targetId);
                        changeSelected(startId);
                    }
                }
            }
        }
    }

    //Handles Tool Actions
    const Action = (evt) => {
        let message = `Used ${tool} on TARGET ${evt.target.id}`;
        if (tool === "Select") {
            changeSelected(evt.target.id);
        }
        else if (tool === "Add/Delete") {
            toggleVisible(evt.target.id);
        }
        else if (tool === "Paths") {
            message = `SELECTED was ${selected.id} USED ${tool} on TARGET ${evt.target.id}`;
            handlePathsTool(evt.target.id);
        }
        console.log(message);
    }

    //============================================================

    //Prevents context menu and changes selected to target on right click
    const handleRightClick = (evt) => {
        evt.preventDefault()
        changeSelected(evt.target.id);
    }

    //Main loop for grid
    for (let x = 0; x < gridX; x++) {
        for (let y = 0; y < gridY; y++) {
            let key = `block-${x}-${y}`;
            let values = blockList[key];
            //Ensures selected values are prioritized over blockList
            if (selected.id === key) {
                values = selected;
            }

            if (values !== undefined) {
                gridColumns.push(<MusicBlock key={key} id={key} classes={calcClass(values)} symbol={calcSymbol(values)} />)
            }
            else {
                gridColumns.push(<MusicBlock key={key} id={key} />)
            }
        }
        gridRows.push(<tr key={`row-${x}`}>{gridColumns}</tr>)
        gridColumns = [];
    }

    return (
        <div className="TableContainer">
            <table id="MusicGrid">
                <tbody onClick={Action} onContextMenu={handleRightClick}>
                    {gridRows}
                </tbody>
            </table>
            {paths}
        </div>
    );
}

export default MusicGrid;