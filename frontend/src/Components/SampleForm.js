import React, { useState } from "react";
import { Form, Input, Button, Card, CardBody, CardTitle } from "reactstrap";
import "./Styles/SampleForm.css";
import MusicProcApi from "../api";
import noteOptions from "../helpers/NoteOptions";


const SampleForm = ({ currUser, setSamples }) => {
    const initialState = {
        name: "",
        pitch: "C",
        octave: 1,
        sound:"",
        username: currUser
    };
    const [formData, setFormData] = useState(initialState);
    const [file, setFile] = useState("");
    const reader = new FileReader();

    const handleFile = (evt) => {
        setFile((file)=>evt.target.files[0]);
    }


    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((data) => ({
            ...data,
            [name]: value
        }))
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const dataURI = reader.result
            console.debug("SOUND:", dataURI);
            await MusicProcApi.addSample({...formData, sound: dataURI});
            setSamples((samples) => [...samples,{...formData, sound: dataURI}])
        }
    };

    return (
        <div className="SampleForm">
            <Card color="dark" inverse>
                <CardTitle>Add Sample</CardTitle>
                <CardBody>
                    <Form id="sample-form" onSubmit={handleSubmit} encType="multipart/form-data">
                        <Input
                            className="bg-secondary text-white"
                            id="sample-name"
                            name="name"
                            type="text"
                            placeholder="Sample Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            className="bg-secondary text-white"
                            id="sample-pitch"
                            name="pitch"
                            type="select"
                            placeholder="Note/Pitch"
                            onChange={handleChange}
                            required
                        >
                            {noteOptions}
                        </Input>
                        <Input
                            className="bg-secondary text-white"
                            id="sample-octave"
                            name="octave"
                            type="number"
                            min={0}
                            max={10}
                            placeholder="Octave Number"
                            value={formData.octave}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            className="bg-secondary text-white"
                            id="sample-sound"
                            name="sound"
                            type="file"
                            placeholder="Sample"
                            defaultValue={formData.sound}
                            accept=".mp3, .wav"
                            onChange={handleFile}
                            required
                        />
                        <Button color="success" id="sample-btn">Add</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );

}

export default SampleForm;