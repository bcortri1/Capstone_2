//Routes for /samples

const express = require("express");
const jsonschema = require("jsonschema");
const Sample = require("../models/sample");
const { BadRequestError } = require("../expressError");
const sampleNewSchema = require("../schemas/sampleNew.json");
const { userMatch, ensureAuth } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

//ADD A SAMPLE
//{name, sound, username} => { ...sample }
router.post("/:username", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, sampleNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //CREATE SAMPLE HERE
        return res.json(await Sample.create(req.body));
    }
    catch (err) {
        return next(err);
    }

});

//GET ALL SAMPLES FOR USER
//{username} => { ...samples }
router.get("/:username", ensureAuth, async function (req, res, next) {
    try {
        //GET ALL SAMPLES HERE
        return res.json(await Sample.getAll(req.params.username));
    }
    catch (err) {
        return next(err);
    }
});


//GET SPECIFIC SAMPLE
//{name, username} => { ...sample }
router.post("/:username", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, sampleNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //GET SAMPLE HERE
        return res.json(await Sample.get(req.body));
    }
    catch (err) {
        return next(err);
    }
});

//DELETE A SAMPLE
//{name, username} => { message: "sample deleted" }
router.delete("/:username", userMatch, async function (req, res, next) {
    try {
        //DELETE USER HERE
        return res.json(await Sample.delete(req.body));
    }
    catch (err) {
        return next(err);
    }

});

module.exports = router;