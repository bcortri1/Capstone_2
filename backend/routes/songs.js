//Routes for /songs

const express = require("express");
const jsonschema = require("jsonschema");
const Song = require("../models/song");
const { BadRequestError } = require("../expressError");
const songNewSchema = require("../schemas/songNew.json");
const songUpdateSchema = require("../schemas/songUpdate.json");
const {ensureAuth, userMatch} = require("../middleware/auth");

const router = express.Router({mergeParams: true});

//ADD A SONG
//{title, data, username} => { ...song }
router.post("/:username", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //CREATE SONG HERE
        return res.json(await Song.create(req.body));
    }
    catch (err) {
        return next(err);
    }

});

//GET ALL SONGS FOR USER
//{username} => { ...songs }
router.get("/:username", ensureAuth, async function (req, res, next) {
    try{    
        //GET ALL SONGS HERE
        return res.json(await Song.getAll(req.params.username));
    }
    catch (err) {
        return next(err);
    }
});

//GET SPECIFIC SONG
//{title, data, username} => { ...song }
router.post("/:username", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //GET SONG HERE
        return res.json(await Song.get(req.body));
    }
    catch (err) {
        return next(err);
    }
});

//UPDATE A SONG
//{title, data, username} => { ...song }
router.patch("/:username", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //UPDATE SONG HERE
        return res.json(await Song.update(req.body));
    }
    catch (err) {
        return next(err);
    }

});

//DELETE A SONG
//{title, username} => { message: "song deleted" }
router.delete("/:username", ensureAuth, async function (req, res, next) {
    try {
        //DELETE SONG HERE
        return res.json(await Song.delete(req.body));
    }
    catch (err) {
        return next(err);
    }

});

module.exports = router;