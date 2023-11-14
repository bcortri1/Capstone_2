import React, { useState, useEffect } from "react";
import MusicProcApi from "../api";
import SampleCard from "./SampleCard";
import "./Styles/SampleList.css";

const SampleList = ({ setSamples, samples, loading=true, currUser }) => {

    const removeSample = async (name) => {
        MusicProcApi.deleteSample(name, currUser);
        setSamples((samples)=>{
            return samples.filter((sample)=> sample.name !== name);
        })

    }

    if (loading) {
        return <p className="loading">Loading &hellip;</p>;
    }

    return (
        <div className="SampleList">
            {samples.map((sample) => {
                return <SampleCard key={sample.name +"-sample-card"} name={sample.name} sound={sample.sound} remove={removeSample} />
            })}
        </div>
    );

}

export default SampleList;