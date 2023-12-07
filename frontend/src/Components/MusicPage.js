import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import Path from "./Path";
import MusicGrid from "./MusicGrid";
import "./Styles/MusicPage.css"
import DetailContainer from "./DetailContainer";
import playBuffer from "../helpers/playBuffer";
import MusicProcApi from "../api";


const MusicPage = ({ samples, loading, setSave, username, save = { title: null, data: null } }) => {
    const initialState = {
        tool: "Add/Delete", //DEFAULT TOOL
        playing: false, // IS THE SONG CURRENTLY PLAYING
        looping: false,
        selected: {},
        startBlocks: [], // LIST OF NOTES TO BEGIN PLAYBACK ON
    }

    const [tool, setTool] = useState(initialState.tool);
    const [playing, setPlaying] = useState(initialState.playing);
    const [selected, setSelected] = useState(initialState.selected);
    const [startBlocks, setStarts] = useState(initialState.startBlocks);
    const [paths, setPaths] = useState([]);
    const [blockList, setBlockList] = useState({});
    const looping = useRef(false);
    const playArr = useRef([]);
    const timeOutArr = useRef([]);

    //Adds a Path
    const addPath = (startId, endId) => {
        let key = "path" + startId.replace('block', '') + endId.replace('block', '');
        setPaths((paths) => [...paths, <Path id={key} key={key} startId={startId} endId={endId} active={false} />])
    }

    //Adds all saved paths back
    //Issue with duplicate paths *Solved by turning off Strict mode*
    const loadPaths = (data) => {
        if (data) {
            data.pathProps.forEach((props) => {
                addPath(props.startId, props.endId)
            })
        }
    }

    //Loads starting block data
    const loadStartBlocks = (data) => {
        setStarts(() => data.startBlocks);
    }

    //Loads blockList and changes arrays back to sets
    const loadBlockList = (data) => {
        if (data) {
            for (const [key, value] of Object.entries(data.blockList)) {
                data.blockList[key].prevBlocks = new Set(value.prevBlocks);
                data.blockList[key].nextBlocks = new Set(value.nextBlocks);
            }
            setBlockList(() => data.blockList);
        }
    }

    //Loads save on first render
    useEffect(() => {
        if (save.data !== null) {
            loadPaths(save.data)
            loadBlockList(save.data)
            loadStartBlocks(save.data)
        }
    }, [])

    //Removes a Path
    const removePath = (startId, endId) => {
        let key = "path" + startId.replace('block', '') + endId.replace('block', '');
        setPaths((paths) => {
            return paths.filter((path) => path.key !== key);
        })
    }

    //Handles music loop state
    const handleLoop = () => {
        //Will set looping to false only during playback to break loop
        if (playing === true) {
            looping.current = false;
        }
        else {
            looping.current = true;
        }

    }

    //Toggles play state
    const togglePlaying = () => {
        //await Tone.start(); //needed for playback to begin
        handleLoop();
        setPlaying((playing) => !playing);
    }

    //Handles Music Playback
    useEffect(() => {
        //All valid instruments
        const instruments = {
            AM: Tone.AMSynth,
            Duo: Tone.DuoSynth,
            FM: Tone.FMSynth,
            Membrane: Tone.MembraneSynth,
            Metal: Tone.MetalSynth,
            Mono: Tone.MonoSynth,
            Pluck: Tone.PluckSynth,
            Synth: Tone.Synth
        }

        //Returns random set item
        const pickRandom = (set) => {
            let arr = Array.from(set);
            return arr[Math.floor(Math.random() * arr.length)];
        }

        //Picks the next block then play either a sample or synth note
        const getNextBlock = (buffer, nextSet = []) => {//NEEDS REWORKED
            //Currently blocks are calculated in advance and synchronized to Transport timer
            if ((nextSet.size > 0)) {
                let blockId = pickRandom(nextSet);
                let block = blockList[blockId];
                //Does not allow next block to be starting block
                if (!block.start) {
                    playNoteType(buffer, blockId);
                }
                else if (looping.current) {
                    prepareLoop();
                }
            }
            else {
                awaitLongest();
            }
        }

        //Handles Synth Playback
        const playSynth = (buffer, block) => {
            // if (block !== undefined) {
            console.debug("This is a block", block)
            if (block.length > 0) {
                let play = new Tone.PolySynth(instruments[block.sample]).toDestination();
                play.sync();
                block.notes.forEach(note => {
                    let duration = block.length;
                    let attackTime = buffer.now + buffer.delay;
                    play.triggerAttackRelease(note.pitch + note.octave, duration, attackTime);
                });
                buffer.add(play, Number(block.length));
            }
            getNextBlock(buffer, block.nextBlocks);
            // }
        }

        //Handles Sample Playback
        const playSample = (buffer, block) => {
            // if (block !== undefined) {
            if (block.length > 0) {
                let sample = samples.find((el) => el.name === block.sample);
                let sampleNote = sample.pitch + sample.octave;
                let attackTime = buffer.now + buffer.delay;
                let notes = block.notes.map(note => `${note.pitch}${note.octave}`)
                let duration = block.length;
                let play = new Tone.Sampler({
                    urls: {
                        [sampleNote]: sample.sound,
                    },
                    baseUrl: "",
                    onload: async () => {
                        //Current Implementation unable to lengthen samples [would need to utilize Tone JS Grain Player and need more input from user]
                        play.sync();
                        play.triggerAttackRelease(notes, duration, attackTime);
                    }
                }).toDestination();
                buffer.add(play, Number(block.length));
            }
            getNextBlock(buffer, block.nextBlocks);
            // }
        }

        //Directs function to play correct note type synth or sample
        const playNoteType = (buffer, blockId) => {
            let block = blockList[blockId];
            if (Object.keys(instruments).includes(block.sample)) {
                playSynth(buffer, block)
            }
            else {
                playSample(buffer, block)
            }
        }

        //Stops all buffers immediately, including loops
        const stopBuffers = () => {
            playArr.current.forEach((buffer) => {
                buffer.stopAll();
            })
            if (!looping.current) {
                timeOutArr.current.forEach((id) => {
                    clearTimeout(id);
                })
            }
            timeOutArr.current = [];
            playArr.current = [];
        }

        //Waits until longest buffer ends, then set playing to false
        const awaitLongest = () => {
            //Ensures all buffers exist before evaluating longest
            if (playArr.current.length === startBlocks.length) {
                let longest = -1;
                playArr.current.forEach((buffer) => {
                    if (buffer.delay > longest) {
                        longest = buffer.delay;
                    }
                });
                setTimeout(() => {
                    setPlaying(() => false)
                }, longest * 1000);
            }
        }

        //Gets longest loop delay then loops 
        //Current setup has everything to loop if one path loops
        const prepareLoop = () => {
            //Ensures all buffers exist before evaluating longest
            if (playArr.current.length === startBlocks.length) {
                let longest = -1;
                playArr.current.forEach((buffer) => {
                    if (buffer.delay > longest) {
                        longest = buffer.delay;
                    }
                });
                console.debug("Looping Longest:", longest)
                setTimeout(() => {
                    setPlaying(() => false)
                }, longest * 1000);
                let id = setTimeout(() => {
                    setPlaying(() => true)
                }, (longest + .2) * 1000); //Might shorten delay
                timeOutArr.current.push(id);
            }
        }

        //Function that allows audio to start
        const audioStart = async () => {
            await Tone.start();
            let now = Tone.now();
            await Tone.Transport.start(now, "+0.1");
            startBlocks.forEach((blockId) => {
                let buffer = new playBuffer(now);
                //Allows tracking of audio buffers
                playArr.current.push(buffer);
                playNoteType(buffer, blockId)
            })
        }

        if (playing) {
            //PLAY MUSIC
            audioStart();
        }
        else {
            //STOP MUSIC
            stopBuffers();
            Tone.Transport.cancel(0);
        }
        //Ignoring warnings until refactor for future date
        // eslint-disable-next-line
    }, [playing, samples, startBlocks])

    //Updates startblocks
    const updateStart = useCallback((id) => {
        const addStart = (blockId) => {
            console.log("Starting block added")
            setStarts((idList) => [...idList, blockId])
        }

        const removeStart = (blockId) => {
            console.log("Starting block removed")
            setStarts((blocks) => {
                let idList = blocks.filter((id) => id !== blockId);
                return [...idList]
            })
        }


        if (!blockList[id].start) {
            addStart(id);
        }
        else {
            removeStart(id);
        }
    }, [blockList])

    //Save current song and changes current save
    const handleSave = async () => {
        let title = prompt("Song Name: ", save.title || "");
        if (title !== null) {
            let pathProps = []
            paths.forEach((path) => {
                pathProps.push(path.props);
            })

            let data = JSON.stringify({ startBlocks: startBlocks, pathProps, blockList }, (key, value) => value instanceof Set ? [...value] : value)
            console.debug("Save Func", { title, username })
            let res = await MusicProcApi.getSong(title, username)
            if (!res) {
                await MusicProcApi.addSong(title, data, username);
            }
            else {
                await MusicProcApi.updateSong(title, data, username);
            }
            setSave(() => ({ title, data:{ startBlocks: startBlocks, pathProps, blockList } }));
        }
    }

    return (
        <div id="MusicPage">
            <audio id="AudioPlayer" />
            <MusicGrid blockList={blockList} setBlockList={setBlockList} tool={tool} setSelected={setSelected} selected={selected} addPath={addPath} removePath={removePath} paths={paths} />
            <DetailContainer selected={selected} updateStart={updateStart} setSelected={setSelected} samples={samples} loading={loading} setTool={setTool} tool={tool} togglePlaying={togglePlaying} playing={playing} saveSong={handleSave} />
        </div>
    )
}

export default MusicPage;