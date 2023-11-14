const db = require("../db/db.js");

//Database sample functions
class Sample {

    //CREATE A SAMPLE
    static create({name, sound, pitch, octave, username}) {
        const duplicateCheck = db.prepare(`
            SELECT name
            FROM samples
            WHERE user = ? AND name = ?`
        ).get(username, name);

        if (duplicateCheck) {
            throw new Error("Duplicate Found");
        }
        else {
            const sample = db.prepare(`
                INSERT INTO samples (name, sound, pitch, octave, user)
                VALUES(?, ?, ?, ?, ?)
                RETURNING name, sound, pitch, octave, user`
            ).get(name, sound, pitch, octave, username);
            return sample;
        }
    }

    //GET SPECIFIED SAMPLE
    static get({name, username}) {
        const sample = db.prepare(`
            SELECT *
            FROM samples
            WHERE name = ? AND user = ?`
        ).get(name, username);
        return sample;
    }

    //GET ALL SAMPLES FROM A USER
    static getAll(username) {
        const samples = db.prepare(`
            SELECT *
            FROM samples
            WHERE user = ?`
        ).all(username);
        return samples;
    }

    //UNUSED
    // //UPDATE SPECIFIC SAMPLE
    // static update({name, sound, username}) {
    //     const sample = db.prepare(`
    //         UPDATE samples
    //         SET name = ?, sound = ?, 
    //         WHERE user = ?`
    //     ).get(name, sound, username);
    //     return sample;
    // }

    //DELETE SPECIFIC SAMPLE
    static delete({name, username}) {
        db.prepare(`
                DELETE FROM samples
                WHERE name = ? AND user = ?`
        ).run(name, username);
        return { message: "sample deleted" };
    }
}

module.exports = Sample;