//Routes for /samples

const express = require("express");
const jsonschema = require("jsonschema");
const Sample = require("../models/sample");
const { BadRequestError } = require("../expressError");
const sampleNewSchema = require("../schemas/sampleNew.json");

const router = express.router({ mergeParams: true });

//ADD A SAMPLE
router.post("/", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, sampleNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //CREATE SAMPLE HERE
    }
    catch (err) {
        return next(err);
    }

});

//GET ALL SAMPLES
router.get("/", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, sampleNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //GET ALL SAMPLES HERE
    }
    catch (err) {
        return next(err);
    }
});


//GET SPECIFIC SAMPLE
router.get("/:id", userMatch, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, sampleNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //GET SAMPLE HERE
    }
    catch (err) {
        return next(err);
    }
});

//DELETE A SAMPLE
router.delete("/", userMatch, async function (req, res, next) {
    try {
        //DELETE USER HERE
    }
    catch (err) {
        return next(err);
    }

});