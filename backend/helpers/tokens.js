const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function createToken(user) {
    console.assert(user.admin !== undefined, "user has been passed without explicit admin property");
    const payload = {
        username: user.username,
        admin: user.admin || 0,
    };
    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };