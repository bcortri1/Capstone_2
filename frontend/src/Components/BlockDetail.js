import React, { useState } from "react";
import { FormGroup, Label, Input, Button, InputGroup } from "reactstrap";
import noteOptions from "../helpers/NoteOptions";

import NoteList from "./NoteList";

import "./Styles/BlockDetail.css";
import { v4 as uuid } from 'uuid';

//Form allowing you adjust values of selected MusicBlock
const BlockDetail = ({ selected, updateStart, setSelected,  samples, loading = true }) => {

    //note {pitch, octave}
    const [note, setNote] = useState({pitch: "C", octave: "4" });

    const sampleOptions = [
        <option key={uuid() + 'option'} value='AM'>AM</option>,
        <option key={uuid() + 'option'} value='Duo'>Duo</option>,
        <option key={uuid() + 'option'} value='FM'>FM</option>,
        <option key={uuid() + 'option'} value='Membrane'>Membrane</option>,
        <option key={uuid() + 'option'} value='Metal'>Metal</option>,
        <option key={uuid() + 'option'} value='Mono'>Mono</option>,
        <option key={uuid() + 'option'} value='Pluck'>Pluck</option>,
        <option key={uuid() + 'option'} value='Synth'>Synth</option>,
        ...samples.map((sample) => <option key={uuid() + 'option'} value={sample.value}>{sample.name}</option>)];

    //Handles note selection, keeps note selection the same between blocks
    const handleNote = (evt) => {
        const { name, value } = evt.target;
        setNote((data) => {
            return { ...data, [name]: value }
        })
    }

    //Adds note to selected block
    const addNote = () => {
        setSelected((values) => { 
            return { ...values, notes: [...values.notes, note] } 
        })
    }

    //Removes note from selected block
    const removeNote = (index) => {
        setSelected((values) => {
            values.notes.splice(index, 1);
            return { ...values, notes: values.notes } })
    }

    //Handles majority of value changes
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setSelected((data) => ({
            ...data,
            [name]: value
        }))
    };

    //Handles switch value changes
    const handleSwitch = (evt) => {
        //Switch uses different variable for true/false value
        const { name, checked } = evt.target;
        setSelected((data) => ({
            ...data,
            [name]: checked
        }))
        updateStart(selected.id);
    }

    return (
        <div className="BlockDetail">
            {selected.visible ?
                <>
                    <div>
                        <FormGroup switch>
                            <Label>Starting Block</Label>
                            <Input checked={selected.start || false} type="switch" name="start" role="switch" onChange={handleSwitch}/>
                        </FormGroup>
                        <Label>Sample:</Label>
                        {loading ?
                            <p className="loading">Loading &hellip;</p>
                            : <Input id="note-sample" name="sample" type="select" onChange={handleChange} value={selected.sample || "Synth"} >{sampleOptions}</Input>}


                        <Label>Length (seconds): </Label>
                        <Input id="length" name="length" type="number" step={0.1} min={0} onChange={handleChange} value={selected.length || 1} />

                    </div>

                    <div>
                        <FormGroup>
                            <Label>Notes:</Label>
                            <InputGroup>
                                <Input key={uuid() + "note-select"} id="note-select" name="pitch" type="select" onChange={handleNote} defaultValue={note.pitch || "C"} >
                                    {noteOptions}
                                </Input>
                                <Input key={uuid() + "octave-select"} placeholder="Octave" name="octave" type="number" min={0} max={9} onChange={handleNote} defaultValue={note.octave ||"4"}>
                                </Input>
                                <Button key={uuid() + "btn-add"} color="success" className="addNote" onClick={addNote}>&#x2b;</Button>
                            </InputGroup>
                        </FormGroup>
                    </div>

                    <NoteList notes={selected.notes} remove={removeNote} />
                </>
                : <div>None Selected</div>}
        </div>
    );
}

export default BlockDetail;