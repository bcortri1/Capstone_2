//Routes for /songs

const express = require("express");
const jsonschema = require("jsonschema");
const Song = require("../models/song");
const { BadRequestError } = require("../expressError");
const songNewSchema = require("../schemas/songNew.json");
const songUpdateSchema = require("../schemas/songUpdate.json");

const router = express.router({mergeParams: true});

//ADD A SONG
router.post("/", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //CREATE SONG HERE
    }
    catch (err) {
        return next(err);
    }

});

//GET ALL SONGS
router.get("/", ensureAuth, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //GET ALL SONGS HERE
    }
    catch (err) {
        return next(err);
    }
});

//GET SPECIFIC SONG
router.get("/:id", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //GET SONG HERE
    }
    catch (err) {
        return next(err);
    }
});

//UPDATE A SONG
router.patch("/:id", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //UPDATE SONG HERE
    }
    catch (err) {
        return next(err);
    }

});

//DELETE A SONG
router.delete("/", ensureAuth, async function (req, res, next) {
    try {
        //DELETE SONG HERE
    }
    catch (err) {
        return next(err);
    }

});
