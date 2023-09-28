//Routes for /users

const express = require("express");
const jsonschema = require("jsonschema");
const User = require("../models/user");
const { BadRequestError } = require("../expressError");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const ensureAuth = require("../middleware/auth");

const router = express.router({mergeParams: true});

//ADD A USER
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //CREATE USER HERE
    }
    catch (err) {
        return next(err);
    }

});

//GET SPECIFIC USER
router.get("/:username", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //GET USER HERE
    }
    catch (err) {
        return next(err);
    }
});

//UPDATE A USER
router.patch("/", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //UPDATE USER HERE
    }
    catch (err) {
        return next(err);
    }

});

//DELETE A USER
router.delete("/", ensureAuth, async function (req, res, next) {
    try {
        //DELETE USER HERE
    }
    catch (err) {
        return next(err);
    }

});