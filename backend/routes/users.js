//Routes for /users

const express = require("express");
const jsonschema = require("jsonschema");
const User = require("../models/user");
const { BadRequestError } = require("../expressError");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { ensureAuth } = require("../middleware/auth");
const { createToken } = require("../helpers/tokens");

const router = express.Router({mergeParams: true});

//ADD A USER
//{username} => { token }
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //CREATE/REGISTER USER HERE
        const user = await User.create(req.body);
        //CREATES TOKEN NEXT
        const token = createToken(user);

        return res.status(201).json({ token });
    }
    catch (err) {
        return next(err);
    }

});

//GET SPECIFIC USER *maybe add songs and samples arrays
//{username} => { username, admin }
router.get("/:username", ensureAuth, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //GET USER HERE
        const user = await User.get(req.body);
        return res.json({ user });
    }
    catch (err) {
        return next(err);
    }
});

//UPDATE A USER
//{username, password} => { token, user}
router.patch("/:username", ensureAuth, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //UPDATE USER HERE
        const user = await User.update(req.body);
        const token = createToken(user);
        return res.json({ token, user });
    }
    catch (err) {
        return next(err);
    }

});

//DELETE A USER
//{username} => { message: "user deleted" }
router.delete("/:username", ensureAuth, async function (req, res, next) {
    try {
        //DELETE USER HERE
        return res.json(await User.delete(req.body));
    }
    catch (err) {
        return next(err);
    }

});

module.exports = router;