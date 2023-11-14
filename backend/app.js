"use strict";

/**Express app for proc music */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { authenticateJWT } = require("./middleware/auth");
const { NotFoundError } = require("./expressError");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const songRoutes = require("./routes/songs");
const sampleRoutes = require("./routes/samples");


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/songs", songRoutes);
app.use("/samples", sampleRoutes);

/** Handle 404 errors */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;