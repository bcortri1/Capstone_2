import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

// API Class
class MusicProcApi {
    // the token for interaction with the API will be stored here.
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${MusicProcApi.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes


    //AUTH API
    static async signup({ username, password}) {
        let res = await this.request(`auth/register`,{
            username,
            password,
        }, "post");
        return res;
    }

    static async login({ username, password }) {
        console.debug("FRONTEND API: ", {username, password})
        let res = await this.request(`auth/token`,{
            username,
            password
        }, "post");
        return res;
    }

    //SONGS API
    static async getSong(title, username) {
        let res = await this.request(`songs/${username}/${title}`);
        return res;
    }

    static async getAllSongs(username) {
        let res = await this.request(`songs/${username}`);
        return res;
    }

    static async addSong(title, data, username) {
        let res = await this.request(`songs/${username}`,{
            title,
            data,
            author: username
        }, "post");
        return res;
    }

    static async updateSong(title, data, username) {
        let res = await this.request(`songs/${username}`,{
            title,
            data,
            author: username
        }, "patch");
        return res;
    }

    static async deleteSong(title, username) {
        let res = await this.request(`songs/${username}`,{
            title,
            username
        }, "delete");
        return res;
    }

    //SAMPLES API
    static async getSample(name, username) {
        let res = await this.request(`samples/${username}`,{
            name,
            username
        }, "post");
        return res;
    }

    static async getAllSamples(username) {
        let res = await this.request(`samples/${username}`);
        return res;
    }

    static async addSample({name, sound, octave, pitch, username}) {
        let res = await this.request(`samples/${username}`,{
            name,
            sound,
            octave:Number(octave),
            pitch,
            username
        }, "post");
        return res;
    }

    //UNUSED
    // static async updateSample(name, sound, username) {
    //     let res = await this.request(`samples/${username}`,{
    //         name,
    //         sound,
    //         username
    //     }, "patch");
    //     return res.user;
    // }

    static async deleteSample(name, username) {
        let res = await this.request(`samples/${username}`,{
            name,
            username
    }, "delete");
        return res;
    }

    //USERS API
    static async getUser(username) {
        let res = await this.request(`users/${username}`,{
            username
        }, "post");
        return res;
    }

    static async updateUser({username, password}) {
        if (password === ""){
            password = undefined;
        }
        let res = await this.request(`users/${username}`,{
            username,
            password,
        }, "patch");
        return res;
    }

    static async deleteUser(username) {
        let res = await this.request(`users/${username}`,{
        }, "delete");
        return res;
    }
}

export default MusicProcApi;