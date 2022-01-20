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

    app.put(
        "/api/users/profileImageUpload/:id",
        permit.context.builder,
        api.users.uploadProfileImage
    );

    app.post("/api/users/follow",
        permit.context.validateToken,
        validator.users.follow,
        api.users.follow
    );

    app.post("/api/users/unfollow",
        permit.context.validateToken,
        validator.users.unfollow,
        api.users.unfollow
    );

    app.get("/api/users/following/:id",
        permit.context.validateToken,
        api.users.following
    );

    app.get("/api/users/followers/:id",
        permit.context.validateToken,
        api.users.followers
    );

    app.get("/api/users/random",
        permit.context.builder,
        api.users.random
    );

    app.post("/api/blocks/block",
        permit.context.validateToken,
        validator.blocks.block,
        api.blocks.block
    );

    app.post("/api/blocks/unblock",
        permit.context.validateToken,
        validator.blocks.block,
        api.blocks.unblock
    );

    app.get("/api/blocks/list:id",
        permit.context.validateToken,
        validator.blocks.block,
        api.blocks.blockList
    );

    app.post("/api/history/create",
        permit.context.validateToken,
        validator.history.create,
        api.history.create
    );

    app.get("/api/history/getByUserId/:id",
        permit.context.validateToken,
        api.history.getByUserId
    );

    app.post("/api/club/join",
        permit.context.validateToken,
        validator.club.joinOrLeave,
        api.club.join
    );
    app.post("/api/club/leave",
        permit.context.validateToken,
        validator.club.joinOrLeave,
        api.club.leave
    );

    app.get("/api/club/membersByClubName/:name",
        permit.context.validateToken,
        api.club.getMembersByClubName
    );
    log.end();
};

exports.configure = configure;