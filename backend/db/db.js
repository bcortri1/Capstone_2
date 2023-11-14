const Database = require("better-sqlite3");
const { getDatabase } = require("../config");
require("colors");

const dropTables = (db) => {
    db.prepare(`DROP TABLE IF EXISTS samples`).run();
    db.prepare(`DROP TABLE IF EXISTS songs`).run();
    db.prepare(`DROP TABLE IF EXISTS users`).run();
}

const createSchema = (db) => {
    db.prepare(`PRAGMA foreign_keys = ON`).run();
    //FUTURE IDEA ADD IS PRIVATE VARIABLE TO SONGS/SAMPLES
    //CONNECT SONGS TO SAMPLES REQUIRED

    db.prepare(`CREATE TABLE IF NOT EXISTS users(  
                    username STRING PRIMARY KEY,
                    password STRING NOT NULL,
                    admin INTEGER NOT NULL DEFAULT 0
                )`).run();

    db.prepare(`CREATE TABLE IF NOT EXISTS songs(  
                    title STRING NOT NULL,
                    data BLOB NOT NULL,
                    author STRING NOT NULL REFERENCES users(username) ON DELETE CASCADE,
                    PRIMARY KEY(title, author)
                )`).run();

    db.prepare(`CREATE TABLE IF NOT EXISTS samples( 
                    name STRING NOT NULL,
                    sound BLOB NOT NULL,
                    pitch STRING NOT NULL,
                    octave NUMBER NOT NULL,
                    user STRING NOT NULL REFERENCES users(username) ON DELETE CASCADE,
                    PRIMARY KEY(name, user)
                )`).run();
    console.log("Tables created".green)
}

const insertTestData = (db) => {
    {
        let sql = db.prepare(`INSERT INTO users (username, password, admin) VALUES(@username, @password, @admin)`);
        const insertUsers = db.transaction((users) => {
            for (let user of users) sql.run(user);
        })
        insertUsers([{ username: "TestUser1", password: "password1", admin: "0" },
        { username: "TestUser2", password: "password2", admin: "0" },
        { username: "TestUser3", password: "password3", admin: "1" },
        { username: "TestUser4", password: "$2b$04$jQSGR.aZgduLnYPqJVcdVOCOq4RQsvsT5keJwAQMh3PZ5nC4n8TAO", admin: "1" },
        { username: "TestUser5", password: "$2b$04$jQSGR.aZgduLnYPqJVcdVOCOq4RQsvsT5keJwAQMh3PZ5nC4n8TAO", admin: "0" },]);
        //TestUser4 password 1234
        //TestUser5 password 1234
    }
    {
        let sql = db.prepare(`INSERT INTO songs (title, data, author) VALUES(@title, @data, @author)`);
        const insertSongs = db.transaction((songs) => {
            for (let song of songs) sql.run(song);
        })
        insertSongs([{ title: "Title1", data: "[data1]", author: "TestUser1" },
        { title: "Title2", data: "[data2]", author: "TestUser2" },
        { title: "Title3", data: "[data3]", author: "TestUser3" },
        { title: "Title4", data: "[data4]", author: "TestUser4" },
        { title: "Title5", data: "[data5]", author: "TestUser4" },]);
    }
    {
        let sql = db.prepare(`INSERT INTO samples (name, sound, pitch, octave, user) VALUES(@name, @sound, @pitch, @octave, @user)`);
        const insertSamples = db.transaction((samples) => {
            for (let sample of samples) sql.run(sample);
        })
        insertSamples([{ name: "Sample1", sound: "[sound1]", pitch:"C", octave:"1", user: "TestUser1" },
        { name: "Sample2", sound: "[sound2]", pitch:"B", octave:"1", user: "TestUser1" },
        { name: "Sample3", sound: "[sound3]", pitch:"C", octave:"1", user: "TestUser2" },
        { name: "Sample4", sound: "[sound4]", pitch:"C", octave:"1", user: "TestUser4" },
        { name: "Sample5", sound: "[sound5]", pitch:"C", octave:"2", user: "TestUser4" },]);
    }
}


const databasePrep = (db) => {
    if (getDatabase() === "test.sqlite") {
        dropTables(db);
        console.log("Test tables cleared".green);
    }

    createSchema(db);

    if (getDatabase() === "test.sqlite") {
        insertTestData(db);
        console.log("Test data successfully inserted".green);
    }
}

//CREATION OF DATABASE OBJECT
const db = new Database(`./${getDatabase()}`, { verbose: console.log });
databasePrep(db);

module.exports = db