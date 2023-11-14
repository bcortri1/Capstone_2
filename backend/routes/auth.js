const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
//const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

//LOGIN
//{username, password} => { token, user }
router.post("/token", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.authenticate({...req.body});
        const token = createToken(user);
        return res.json({ token, user });
    } catch (err) {
        return next(err);
    }
});


//REGISTER
//{username, password} => { token, user }
router.post("/register", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const user = await User.create({ ...req.body, admin: 0 });
        const token = createToken(user);
        return res.status(201).json({ token, user });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;