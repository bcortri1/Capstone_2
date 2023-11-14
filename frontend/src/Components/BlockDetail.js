import React, { useState } from "react";
import { FormGroup, Form, Label, Input, Button, InputGroup } from "reactstrap";
import noteOptions from "../helpers/NoteOptions";

import NoteList from "./NoteList";

import "./Styles/BlockDetail.css";
import { v4 as uuid } from 'uuid';

//Form Containing Details On Selected Note
const BlockDetail = ({ selected, samples, loading = true }) => {

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

    const handleNote = (evt) => {
        const { name, value } = evt.target;
        setNote((data) => {
            return { ...data, [name]: value }
        })
    }

    const addNote = (evt) => {
        evt.preventDefault();
        selected.setValues((values) => { 
            return { ...values, notes: [...values.notes, note] } 
        })
    }

    const removeNote = (index) => {
        selected.setValues((values) => {
            values.notes.splice(index, 1);
            return { ...values, notes: values.notes } })
    }

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        selected.setValues((data) => ({
            ...data,
            [name]: value
        }))
    };
//Switch uses different variable for true/false value
    const handleSwitch = (evt) => {
        const { name, checked } = evt.target;
        selected.setValues((data) => ({
            ...data,
            [name]: checked
        }))
    }

    return (
        <div className="BlockDetail">
            {selected.values !== null && selected.values.created ?
                <>
                    <Form>
                        <FormGroup switch>
                            <Label>Starting Block</Label>
                            <Input checked={selected.values.start} type="switch" name="start" role="switch" onChange={handleSwitch}/>
                        </FormGroup>
                        <Label>Sample:</Label>
                        {loading ?
                            <p className="loading">Loading &hellip;</p>
                            : <Input id="note-sample" name="sample" type="select" onChange={handleChange} value={selected.values.sample} >{sampleOptions}</Input>}


                        <Label>Length (seconds): </Label>
                        <Input id="length" name="length" type="number" step={0.1} min={0} onChange={handleChange} value={selected.values.length} />

                    </Form>

                    <Form>
                        <FormGroup>
                            <Label>Notes:</Label>
                            <InputGroup>
                                <Input key={uuid() + "note-select"} id="note-select" name="pitch" type="select" onChange={handleNote} defaultValue={note.pitch} >
                                    {noteOptions}
                                </Input>
                                <Input key={uuid() + "octave-select"} placeholder="Octave" name="octave" type="number" min={0} max={9} onChange={handleNote} defaultValue={note.octave}>
                                </Input>
                                <Button key={uuid() + "btn-add"} color="success" className="addNote" onClick={addNote}>&#x2b;</Button>
                            </InputGroup>
                        </FormGroup>
                    </Form>

                    <NoteList notes={selected.values.notes} remove={removeNote} />
                    {/* <div><Label>Prev Block: {selected.values.prevBlock.toString()}</Label></div>
                    <div><Label>Next Blocks: {selected.values.nextBlocks.toString()}</Label></div> */}
                </>
                : <div>None Selected</div>}
        </div>
    );
}

export default BlockDetail;