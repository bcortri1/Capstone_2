import React, { useState, useEffect } from "react";
import MusicProcApi from "../api";
import SongCard from "./SongCard";
import "./Styles/SongList.css"


const SongList = ({ setSongs, songs, loading=true, currUser, setSave }) => {

    const removeSong = async (title) => {
        MusicProcApi.deleteSong(title, currUser);
        setSongs((songs)=>{
            return songs.filter((song)=> song.title !== title);
        })

    }

    if (loading) {
        return <p className="loading">Loading &hellip;</p>;
    }

    return (
        <div className="SongList">
            {songs.map((song) => {
                return <SongCard key={song.title +"-song-card"} title={song.title} data={song.data} remove={removeSong} setSave={setSave} />
            })}
        </div>
    );

}

export default SongList;