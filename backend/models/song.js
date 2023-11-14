const db = require("../db/db.js");

//Database song functions
class Song {

    //CREATE A SONG
    static create({title, data, username}) {
        const duplicateCheck = db.prepare(`
            SELECT title
            FROM songs
            WHERE author = ?`
        ).get(username);

        if (duplicateCheck) {
            throw new Error("Duplicate Found")
        }
        else {
            const song = db.prepare(`
                INSERT INTO songs (title, data, author)
                VALUES(?, ?, ?)
                RETURNING title, data, author`
            ).get(title, data, username);
            return song;
        }
    }

    //GET SPECIFIED SONG
    static get({title, username}) {
        const song = db.prepare(`
            SELECT *
            FROM songs
            WHERE title = ? AND author = ?`
        ).get(title, username);
        return song;
    }

    //GET ALL SONGS
    static getAll(username) {
        const songs = db.prepare(`
            SELECT *
            FROM songs
            WHERE author = ?`
        ).all(username);
        return songs;
    }

    //UPDATE SPECIFIC SONG
    static update({title, data, username}) {
        const song = db.prepare(`
            UPDATE songs
            SET title = ?, data = ?, 
            WHERE author = ?`
        ).get(title, data, username);
        return song;
    }

    //DELETE SPECIFIC SONG
    static delete({title, username}) {
        db.prepare(`
            DELETE FROM songs
            WHERE title = ? AND author = ?`
        ).run(title, username);
        return { message: "song deleted" };
    }
}

module.exports = Song;