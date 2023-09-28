const db  = require("../db/db.js");

//Database song functions
class Song {
    //CREATE A SONG
    static create(title, data, author) {
        const duplicateCheck = db.prepare(
            `SELECT title
             FROM songs
             WHERE author = $1`
        ).get(author);

        if (duplicateCheck) {
            throw new Error("Duplicate Found")
        }
        else {
            db.prepare(
                `INSERT INTO songs
                (title, data, author)
                VALUES($1, $2, $3)`
            ).get(title, data, author)
        }
    }
    //GET SPECIFIED SONG
    static get(title, author) {
        const song = db.prepare(
            `SELECT *
             FROM songs
             WHERE title = $1 AND author = $2`
        ).get(title,author);

        return song;
    }
    //GET ALL SONGS
    static getAll(author) {
        const songs = db.prepare(
            `SELECT *
             FROM songs
             WHERE author = $1`
        ).all(author);
        return songs;
    }
}

export default Song;