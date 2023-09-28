const db  = require("../db/db.js");

//Database user functions
class User{
    //CREATE A USER
    static create(username, password, admin = 0) {
        const duplicateCheck = db.prepare(
            `SELECT *
             FROM users
             WHERE username = $1`
        ).get(username);

        if (duplicateCheck) {
            throw new Error("Duplicate Found")
        }
        else {
            //NEED TO ADD BCRYPT HASHING*****
            db.prepare(
                `INSERT INTO users
                (title, data, author)
                VALUES($1, $2, $3)`
            ).get(title, data, author)
        }
    }
    //GET SPECIFIC USER
    static get(username) {
        const user = db.prepare(
            `SELECT *
             FROM users
             WHERE username = $1`
        ).get(username);
        
        return user;
    }
    //GET ALL USERS
    static getAll(username) {
        const users = db.prepare(
            `SELECT *
             FROM users`
        ).all(username);
        return users;
    }
}

module.exports = User;