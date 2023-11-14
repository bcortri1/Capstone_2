const db = require("../db/db.js");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { UnauthorizedError, BadRequestError } = require("../expressError.js");

//Database user functions
class User {

    //AUTHENTICATE
    static async authenticate({ username, password }) {
        //console.debug("INCOMING REQUEST", {username, password})

        const user = db.prepare(`
            SELECT username, password, admin
            FROM users
            WHERE username = ?`
        ).get(username);
        //console.debug("DATABASE RESULT", { user });

        let isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
            delete user.password;
            return user;
        }
        throw new UnauthorizedError("Invalid username/password");
    }

    //CREATE A USER
    static async create({ username, password, admin }) {
        const duplicateCheck = db.prepare(`
            SELECT username
            FROM users
            WHERE username = ?`
        ).get(username);

        if (duplicateCheck) {
            throw new BadRequestError(`Duplicate username found: ${username}`);
        }
        else {
            let hashed = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
            const result = db.prepare(`
                INSERT INTO users (username, password, admin)
                VALUES(?, ?, ?)
                RETURNING username, admin`
            ).get(username, hashed, admin)
            return result
        }
    }

    //CREATE AN ADMIN
    static async createAdmin({ username, password, admin = 1 }) {
        const duplicateCheck = db.prepare(`
            SELECT *
            FROM users
            WHERE username = ?`
        ).get(username);

        if (duplicateCheck) {
            throw new BadRequestError(`Duplicate username found: ${username}`);
        }
        else {
            let hashed = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
            db.prepare(`
                INSERT INTO users (username, password, admin)
                VALUES(?, ?, ?)`
            ).get(username, hashed, admin)
        }
    }

    //GET SPECIFIC USER
    static get({ username }) {
        const user = db.prepare(`
            SELECT *
            FROM users
            WHERE username = ?
            RETURNING username, admin`
        ).get(username);
        return user;
    }

    //GET ALL USERS
    static getAll({ username }) {
        const users = db.prepare(`
            SELECT *
            FROM users`
        ).all(username);
        return users;
    }

    //UPDATE A USER PASSWORD
    static async update({ username, password }) {

        let hashed = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const user = db.prepare(`
                UPDATE users
                SET password = ?
                WHERE username = ?
                RETURNING username, admin`
        ).get(hashed, username)
        return user;
    }

    //DELETE SPECIFIC USER
    static delete({ username }) {
        const user = db.prepare(`
            DELETE FROM users
            WHERE username = ?`
        ).run(username);
        return { message: "user deleted" };
    }
}

module.exports = User;