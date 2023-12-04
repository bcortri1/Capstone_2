import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import Path from "./Path";
import MusicGrid from "./MusicGrid";
import "./Styles/MusicPage.css"
import DetailContainer from "./DetailContainer";
import playBuffer from "../helpers/playBuffer";
import {parse, stringify, toJSON, fromJSON} from 'flatted';
import MusicProcApi from "../api";


const MusicPage = ({ samples, loading, setSave, username, save = {title: null, data: null} }) => {
    const initialState = {
        tool: "Add/Delete", //DEFAULT TOOL
        playing: false, // IS THE SONG CURRENTLY PLAYING
        looping: false,
        selected: {  // THE MUSIC BLOCK THAT IS SELECTED
            setValues: null,
            values: null
        },
        startBlocks: [], // LIST OF NOTES TO BEGIN PLAYBACK ON
    }


    //CURRENT ISSUE PATHS NEED TO BE SAME LENGTH OR THEY ARE CUT SHORT
    const [tool, setTool] = useState(initialState.tool);
    const [playing, setPlaying] = useState(initialState.playing);
    const [selected, setSelected] = useState(initialState.selected);
    const [startBlocks, setStarts] = useState(initialState.startBlocks);
    const [paths, setPaths] = useState([]);
    const looping = useRef(false);
    const playArr = useRef([]);
    const timeOutArr = useRef([]);
    //console.log(startBlocks)



    //Adds a Path
    const addPath = (startId, endId) => {
        console.log("Creating A Path");
        let key = "path" + startId.replace('block', '') + endId.replace('block', '');
        console.log(key);
        setPaths((paths) => [...paths, <Path id={key} key={key} startId={startId} endId={endId} active={false} />])
    }

    //Removes a Path
    const removePath = (startId, endId) => {
        console.log("Removing A Path");
        let key = "path" + startId.replace('block', '') + endId.replace('block', '');
        console.log(key)
        setPaths((paths) => {
            paths = paths.filter((path) => path.key !== key);
            return paths;
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
        //console.debug("Looping changed to:", looping.current)
    }

    //Toggles play state
    const togglePlaying = () => {
        //await Tone.start(); //needed for playback to begin
        handleLoop();
        setPlaying((playing) => !playing);
    }

    useEffect(() => {
        console.debug("Selected Changed", selected)
    }, [selected]);

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

        //Returns random arr item
        const pickRandom = (arr) => {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        //Picks the next block then play either a sample or synth note
        const getNextBlock = (buffer, nextArr = []) => {//NEEDS REWORKED
            //Currently blocks are calculated in advance and synchronized to Transport timer
            let block = pickRandom(nextArr);
            if ((nextArr.length > 0)){
                //Does not allow next block to be starting block
                if (!block.start) {
                    playNoteType(buffer, block);
                }
                else if (looping.current){
                    prepareLoop();
                }
            }
            else{
                awaitLongest();
            }
        }

        //Handles Synth Playback
        const playSynth = (buffer, block) => {
            if (block !== undefined) {
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
            }
        }

        //Handles Sample Playback
        const playSample = (buffer, block) => {
            if (block !== undefined) {
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
            }
        }

        //Directs function to play correct note type synth or sample
        const playNoteType = (buffer, block) => {
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
            if(!looping.current){
                timeOutArr.current.forEach((id)=>{
                    clearTimeout(id);
                })
            }
            timeOutArr.current = [];
            playArr.current = [];
        }
        
        //Waits until longest buffer ends, then set playing to false
        const awaitLongest = () => {
            let longest = -1;
            playArr.current.forEach((buffer) => {
                if (buffer.delay > longest){
                    longest = buffer.delay;
                }
            });
            setTimeout(() => {
                setPlaying(() => false)
            }, longest * 1000);
        }

        //Gets longest loop delay then loops 
        //Current setup has everything to loop if one path loops
        const prepareLoop = () => {
            let longest = -1;
            playArr.current.forEach((buffer) => {
                if (buffer.delay > longest){
                    longest = buffer.delay;
                }
            });
            console.debug("Looping Longest:", longest)
            setTimeout(() => {
                setPlaying(() => false)
            }, longest * 1000);
            let id = setTimeout(() => {
                setPlaying(() => true)
            }, (longest + .5) * 1000); //Might shorten delay
            timeOutArr.current.push(id);
        }

        const audioStart = async () => {
            await Tone.start();
            let now = Tone.now();
            await Tone.Transport.start(now,"+0.1");
            startBlocks.forEach((block) => {
                let buffer = new playBuffer(now);
                playArr.current.push(buffer);
                playNoteType(buffer, block)
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
        //Ignoring warnings until refactor future date
        // eslint-disable-next-line
    }, [playing, samples, startBlocks])

    //Updates startblocks
    const updateStart = useCallback((block) => {
        const addStart = (newBlock) => {
            setStarts((blocks) => [...blocks, newBlock])
        }

        const removeStart = (blockId) => {
            setStarts((blocks) => {
                let blockList = blocks.filter((block) => block.id !== blockId);
                return [...blockList]
            })
        }

        removeStart(block.id);
        if (block.start) {
            addStart(block);
        }
    }, [])

        //Save current song and change current save
        const handleSave = async () => {
            let title =  prompt("Song Name: ", save.title || "");
            console.debug("BEFORE", startBlocks)
            let data = JSON.stringify(startBlocks)
            console.debug("Save Func" , {title, username})
            let res = await MusicProcApi.getSong(title, username)
            if(!res){
                await MusicProcApi.addSong(title, data, username);
            }
            else{
                await MusicProcApi.updateSong(title, data, username);
            }
            setSave(() => ({title, data: startBlocks}));
        }

    return (
        <div id="MusicPage">
            <audio id="AudioPlayer" />
            <MusicGrid tool={tool} setSelected={setSelected} selected={selected} startBlocks={startBlocks} updateStart={updateStart} addPath={addPath} removePath={removePath} paths={paths} save={save} />
            <DetailContainer selected={selected} setSelected={setSelected} samples={samples} loading={loading} setTool={setTool} tool={tool} togglePlaying={togglePlaying} playing={playing} saveSong = {handleSave} />
        </div>
    )
}

export default MusicPage;