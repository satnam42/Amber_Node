"use strict";

const fs = require("fs");
const api = require("../api");
const specs = require("../specs");
const permit = require("../permit")
const validator = require("../validators");

const configure = (app, logger) => {
    const log = logger.start("settings:routes:configure");
    app.get("/specs", function (req, res) {
        fs.readFile("./public/specs.html", function (err, data) {
            if (err) {
                return res.json({
                    isSuccess: false,
                    error: err.toString()
                });
            }
            res.contentType("text/html");
            res.send(data);
        });
    });

    app.get("/api/specs", function (req, res) {
        res.contentType("application/json");
        res.send(specs.get());
    });

    //user api's routes //
    app.post("/api/users/create",
        permit.context.builder,
        validator.users.create,
        api.users.create
    );

    app.post(
        "/api/users/login",
        permit.context.builder,
        validator.users.login,
        api.users.login
    );

    app.put(
        "/api/users/resetPassword/:id",
        permit.context.validateToken,
        validator.users.resetPassword,
        api.users.resetPassword
    );

    app.put(
        "/api/users/update/:id",
        permit.context.validateToken,
        api.users.update
    );

    app.get(
        "/api/users/profile/:id",
        permit.context.validateToken,
        api.users.profile
    );


    log.end();
};

exports.configure = configure;