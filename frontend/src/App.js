import './App.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SignUpForm from './Components/SignUpForm';
import LoginForm from './Components/LoginForm';
import ProfileForm from './Components/ProfileForm';
import NavBar from './Components/NavBar';
import MusicPage from './Components/MusicPage';
import MusicProcApi from './api';
import SamplePage from './Components/SamplePage';
import SongList from './Components/SongList';



function App() {
    const navigate = useNavigate();
    const initialState = {
        currUser: JSON.parse(localStorage.getItem('currUser')) || null,
        token: JSON.parse(localStorage.getItem('token')) || null,
        samples: [],
        samplesLoading: true,
        songs: [],
        songsLoading: true,
    }

    //AUTHORIZATION STATES
    const [currUser, setUser] = useState(initialState.currUser);
    const [token, setToken] = useState(initialState.token);
    
    //SAMPLE STATES
    const [samples, setSamples] = useState(initialState.samples);
    const [samplesLoading, setSamplesLoading] = useState(initialState.samplesLoading);
    const [songs, setSongs] = useState(initialState.songs);
    const [songsLoading, setSongsLoading] = useState(initialState.songsLoading);
    const [save, setSave] = useState()

    useEffect(() => {
        localStorage.setItem('currUser', JSON.stringify(currUser));
    }, [currUser]);

    useEffect(() => {
        localStorage.setItem('token', JSON.stringify(token));
        MusicProcApi.token = token;
    }, [token]);

    //Initially gets all users songs
    useEffect(() => {
        async function getSongs() {
            
            let songs = await MusicProcApi.getAllSongs(currUser);
            console.debug("Getting Songs", songs)
            setSongs(() => songs);
            setSongsLoading(() => false);
        }
        if (initialState.songs.length === 0) {
            getSongs();
        }
        else {
            setSongsLoading(() => false);
        }
    }, [initialState.songs.length])

    //Initially gets all users samples
    useEffect(() => {
        async function getSamples() {
            let samples = await MusicProcApi.getAllSamples(currUser);
            let buffers = 1;
            setSamples(() => samples);
            setSamplesLoading(() => false);
        }
        if (initialState.samples.length === 0) {
            getSamples();
        }
        else {
            setSamplesLoading(() => false);
        }
    }, [initialState.samples.length])

    //LOGIN
    const login = async (data) => {
        let { token, user } = await MusicProcApi.login(data)
        setToken(() => token);
        MusicProcApi.token = token;
        setUser(() => user.username);
        navigate("/");
    }

    //LOGOUT
    const logout = async () => {
        setUser(() => null);
        setToken(() => null);
    }

    //SIGNUP or REGISTER
    const signup = async (data) => {
        let { token, user } = await MusicProcApi.signup(data);
        setToken(() => token);
        MusicProcApi.token = token;
        setUser(() => user.username);
        navigate("/");
    }

    //EDIT USER PASSWORD
    const editUser = async (data) => {
        let { token, user } = await MusicProcApi.updateUser(data);
        setToken(() => token);
        MusicProcApi.token = token;
        setUser(() => user.username);
        navigate("/");
    }

    //const save

    return (
        <div className="App">

            <NavBar currUser={currUser} logout={logout} />


            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path='/signup' element={<SignUpForm signup={signup} />} />
                <Route path='/login' element={<LoginForm login={login} />} />

                {/* PROTECTED ROUTES */}
                {((currUser !== null) && (token !== null)) ?
                    <>
                        <Route path='/' element={<MusicPage samples={samples} loading={samplesLoading}/>} />
                        <Route path='/samples' element={<SamplePage currUser={currUser} loading={samplesLoading} samples={samples} setSamples={setSamples} />} />
                        <Route path='/songs' element={<SongList currUser={currUser} loading={songsLoading} songs={songs}/>} />
                        <Route path='/profile' element={<ProfileForm editUser={editUser} currUser={currUser} />} />
                    </>
                    : <Route path='/*' element={<Navigate to='/login' />} />}

                {/* ERROR ROUTE */}
                <Route path='/*' element={<Navigate to='/login' />} />
            </Routes>
        </div>
    );
}

export default App;
