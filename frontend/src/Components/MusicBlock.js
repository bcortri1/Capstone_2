import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Styles/MusicBlock.css";

//UI representation of Music Block, handles interation with it
const MusicBlock = ({ id, tool, setSelected, selected, saved = null, updateStart, addPath, removePath }) => {
    const elRef = useRef(null);
    const initialState = {
        id: id,
        created: false,
        sample: "Synth",
        length: 1.0,
        notes: [],
        prevBlock: [], //needs to be an array
        nextBlocks: [], //needs to be an arr
        start: false
    }

    const [values, setValues] = useState(saved || initialState);
    const [symbol, setSymbol] = useState('\u{2311}');
    const [classes, setClasses] = useState("MusicBlock");
    //const [paths, setPaths] = useState([]);

    //Updates selected to null
    const nullSelected = () => {
        setSelected(() => ({ setValues: null, values: null, el: null }));
    }

    //Updates selected to current MusicBlock, also can take obj val to be changed
    const updateSelected = useCallback((obj = null) => {
        let val = { ...values, ...obj };
        setSelected(() => ({ setValues, values: val, el: elRef.current }));
    },[values, setSelected])

    //Resets all MusicBlock values, except for prev and next
    const resetBlock = () => {
        setValues((vals) => ({ ...initialState, prevBlock: vals.prevBlock, nextBlocks: vals.nextBlocks }));
    }

    //Handles Block Creation
    const toggleCreated = () => {
        //Resets created blocks and removes them from selection
        if (values.created) {
            resetBlock();
            nullSelected();
        }
        //Creates new blocks and selects them
        else {
            setValues((vals) => ({ ...vals, created: true }));
            updateSelected({ created: true });
        }
    };

    //Adds previous block to clicked music block
    const addPrev = () => {
        setValues((vals) => {
            let prevBlock = [...vals.prevBlock, selected];
            return { ...vals, prevBlock };
        });
    }

    //Removes previous block to clicked music block
    const removePrev = () => {
        setValues((vals) => {
            let prevBlock = vals.prevBlock.filter((block) => block.values.id !== selected.values.id)
            return { ...vals, prevBlock };
        });
    }

    const updatePrev = useCallback(() => {
        console.log("updating previous blocks")
        values.prevBlock.forEach((pBlock) => {
            pBlock.setValues((vals) => {
                let index = vals.nextBlocks.findIndex((block) => block.id === values.id)
                vals.nextBlocks[index] = values;
                return vals;
            })
        })
    }, [values])

    //Adds current block to selected's nextBlocks
    const addNextBlock = () => {
        selected.setValues((vals) => {
            //Ends path
            if (values.start){
                let nextBlocks = [...vals.nextBlocks, {id:values.id, start: true}]
                return { ...vals, nextBlocks }
            }
            //Continues path
            let nextBlocks = [...vals.nextBlocks, values]
            return { ...vals, nextBlocks }
        });
    }
    //Removes current block to from selected's nextBlocks
    const removeNextBlock = () => {
        selected.setValues((vals) => {
            let nextBlocks = vals.nextBlocks.filter((block) => block.id !== values.id)
            return { ...vals, nextBlocks }
        });
    }

    const handlePathsTool = (target) => {
        if (selected.values !== null) {
            let startId = selected.values.id;
            let endId = target.id;

            //If not targeting self
            if (selected.values.id !== values.id) {
                let found = selected.values.nextBlocks.findIndex((block) => block.id === values.id);
                //If not found
                if (found === -1) {
                    addPath(startId, endId);
                    addNextBlock();
                    addPrev();
                    updateSelected();
                }
                else {
                    removePath(startId, endId);
                    removePrev();
                    removeNextBlock();
                }
            }
        }
    }

    //Updates symbol
    useEffect(() => {
        setSymbol(() => {
            if (values.created && !values.start){
                if (values.notes.length > 9){
                    return `\u{0001F4E3}`
                }
                if (values.notes.length > 0){
                    return `\u{1D15F}x${values.notes.length}`
                    
                }
                else {
                    return '\u{1D13D}'
                }
            }
            return values.start ? '\u{23F5}' : '\u{2311}';
        })
    }, [values.created, values.notes.length, values.start])

    //Updates start block arrays values
    useEffect(()=>{
        updateStart(values);
    },[values, values.nextBlocks, updateStart])

    //Updates previous block on value change
    useEffect(()=>{
        if ((values.prevBlock.length > 0) && !values.start) {
            updatePrev();
        }
    },[values, updatePrev])

    //Causes selection upon value update 
    useEffect(() => {
        //Prevents selection upon music grid creation
        if (selected.values !== null) {
            //Allows values to update selected, if already selected
            if (selected.values.id === values.id) {
                updateSelected();
                //Updates previous blocks on value changes
            }
        }
        //updateStart(values);
    }, [values, updateSelected])

    //Updates Block Class
    useEffect(() => {
        setClasses(() => {
            let result = "MusicBlock"
            if (values.created) {
                result += " created";
                if (selected.values !== null && selected.values.id === values.id) {
                    result += " selected";
                }
                if (values.start) {
                    result += " start";
                }
            }
            return result;
        })
    }, [selected, values.created, values.start, values.id])

    function Action(evt) {
        if (tool === "Select") {
            updateSelected();
        }
        else if (tool === "Add/Delete") {
            toggleCreated();
        }
        else if (tool === "Paths") {
            handlePathsTool(evt.target);
        }
    }

    //Right Click Selects Without needing to change tool
    function handleRightClick(evt) {
        evt.preventDefault()
        updateSelected();
    }

    //&#8728;
    return (
        <>
            {values.created ?
                <td ref={elRef} id={id} onClick={Action} onContextMenu={handleRightClick} className={classes}>{symbol}</td>
                : <td ref={elRef} id={id} onClick={Action} onContextMenu={handleRightClick} className="MusicBlock">{symbol}</td>
            }

        </>
    )
}

export default MusicBlock;