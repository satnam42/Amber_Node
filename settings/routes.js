"use strict";

const fs = require("fs");
const api = require("../api");
const specs = require("../specs");
const permit = require("../permit")
const validator = require("../validators");
const express = require('express');
const upload = require("./upload");
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
    app.get("/api/users/getUsers",
        permit.context.validateToken,
        api.users.getUsers
    );

    app.post(
        "/api/users/login",
        permit.context.builder,
        validator.users.login,
        api.users.login
    );

    app.post(
        "/api/users/socialLogin",
        permit.context.builder,
        validator.users.socialLogin,
        api.users.socialLogin
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
    app.put(
        "/api/users/removePicOrVideo/:id",
        permit.context.validateToken,
        api.users.removePicOrVideo
    );

    app.get(
        "/api/users/profile/:id",
        permit.context.validateToken,
        api.users.profile
    );

    app.put(
        "/api/users/profileImageUpload/:id",
        upload.array("image"),
        permit.context.builder,
        api.users.uploadProfileImage
    );

    app.put(
        "/api/users/ImageUpload/:id",
        upload.array("image"),
        permit.context.builder,
        api.users.uploadImage
    );

    app.put(
        "/api/users/removeProfilePic/:id",
        permit.context.validateToken,
        api.users.removeProfilePic
    );

    app.put(
        "/api/users/uploadStory/:id",
        upload.array("video"),
        permit.context.validateToken,
        api.users.uploadStory
    );
    app.put(
        "/api/users/addBankDetail/:id",
        permit.context.validateToken,
        api.users.addBankDetail
    );
    // app.put(
    //     "/api/users/removeStory/:id",
    //     permit.context.builder,
    //     api.users.removeStory
    // );

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

    app.post("/api/users/removeFollower",
        permit.context.validateToken,
        api.users.removeFollower
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
        permit.context.validateToken,
        api.users.random
    );

    app.delete("/api/users/deleteAccount/:id",
        permit.context.validateToken,
        api.users.remove
    );

    app.get("/api/users/getUsers",
        permit.context.validateToken,
        api.users.getUsers
    );

    app.get("/api/users/countries",
        permit.context.builder,
        api.users.getCountries
    );

    app.post("/api/users/generateRtcToken",
        permit.context.validateToken,
        permit.context.nocache,
        api.users.getRtcToken
    );

    app.post("/api/users/logout",
        permit.context.validateToken,
        api.users.logout
    );
    app.post("/api/users/settings",
        permit.context.validateToken,
        api.users.settings
    );

    app.get("/api/users/usersByFilter",
        permit.context.validateToken,
        api.users.usersByFilter
    );

    app.post(
        "/api/users/forgotPassword",
        permit.context.builder,
        api.users.forgotPassword
    );
    app.post(
        "/api/users/otpVerify",
        permit.context.validateToken,
        api.users.otpVerify
    );

    app.post(
        "/api/users/changePassword",
        permit.context.validateToken,
        api.users.changePassword
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

    app.get("/api/blocks/list/:id",
        permit.context.validateToken,
        api.blocks.blockList
    );

    app.post("/api/history/make",
        permit.context.validateToken,
        validator.history.create,
        api.history.create
    );

    app.get("/api/history/getByUserId/:id",
        permit.context.validateToken,
        api.history.getByUserId
    );

    app.put(
        "/api/history/update/:id",
        permit.context.validateToken,
        api.history.update
    );

    app.get('/api/conversations/getOldConversations',
        permit.context.builder,
        api.conversations.getOldChat
    );

    app.get('/api/conversations/conversationList/:id',
        permit.context.builder,
        api.conversations.getConversationList
    );

    app.post("/api/notifications/sendCallNotification",
        permit.context.validateToken,
        validator.notifications.sendCallNotification,
        api.notifications.sendCallNotification
    );

    app.post("/api/notifications/random",
        permit.context.validateToken,
        api.notifications.random
    );

    app.put('/api/notifications/seen/:id',
        permit.context.validateToken,
        api.notifications.seen
    );

    app.get('/api/notifications/byUserId/:id',
        permit.context.validateToken,
        api.notifications.byUserId
    );

    app.post("/api/gifts/add",
        permit.context.builder,
        api.gifts.add
    );

    app.post("/api/gifts/send",
        permit.context.validateToken,
        api.gifts.send
    );

    app.post("/api/gifts/buy",
        permit.context.validateToken,
        api.gifts.buy
    );
    app.post("/api/gifts/credit",
        express.raw({ type: '*/*' }),
        permit.context.builder,
        api.gifts.credit
    );

    app.get("/api/gifts/list",
        permit.context.validateToken,
        api.gifts.getGifts
    );
    app.put('/api/gifts/update/:id',
        permit.context.validateToken,
        api.gifts.update
    );
    app.get('/api/gifts/myGifts/:id',
        permit.context.validateToken,
        api.gifts.myGifts
    );
    app.put('/api/gifts/uploadIcon/:id',
        upload.array("image"),
        permit.context.validateToken,
        api.gifts.uploadIcon
    );
    app.post("/api/coins/add",
        permit.context.builder,
        validator.coins.create,
        api.coins.add
    );
    app.post("/api/coins/buy",
        permit.context.validateToken,
        api.coins.buy
    );

    app.get("/api/coins/list",
        permit.context.validateToken,
        api.coins.getCoinList
    );
    app.get("/api/coins/dailyOffers",
        permit.context.validateToken,
        api.coins.getDailyOffers
    );
    app.get('/api/coins/myCoins/:id',
        permit.context.validateToken,
        api.coins.myCoins
    );
    app.put('/api/coins/setPopular/:id/:setPopular',
        permit.context.validateToken,
        api.coins.setPopular
    );
    app.put('/api/coins/setOffer/:id/:setOffer',
        permit.context.validateToken,
        api.coins.setOffer
    );
    app.post('/api/coins/deduct',
        permit.context.validateToken,
        api.coins.deduct
    );

    app.post("/api/coins/checkPaymentStatus",
        express.raw({ type: '*/*' }),
        permit.context.builder,
        api.coins.checkPaymentStatus
    );
    app.put('/api/coins/uploadIcon/:id',
        upload.array("image"),
        permit.context.validateToken,

        api.coins.uploadIcon
    );

    app.post("/api/redeem/create",
        permit.context.builder,
        api.redeem.create
    );

    app.put("/api/redeem/updateStatus/:id",
        permit.context.validateToken,
        api.redeem.updateStatus
    );
    app.post("/api/redeem/request",
        permit.context.validateToken,
        api.redeem.request
    );
    app.get("/api/redeem/allRequestList",
        permit.context.validateToken,
        api.redeem.allRequestList
    );
    app.get("/api/redeem/checkRequestStatus/:id",
        permit.context.validateToken,
        api.redeem.checkRequestStatus
    );
    app.get("/api/redeem/requestListByUserId/:id",
        permit.context.validateToken,
        api.redeem.requestListByUserId
    );

    app.post("/api/callRates/add",
        permit.context.validateToken,
        api.callRates.add
    );
    app.get("/api/callRates/list",
        permit.context.validateToken,
        api.callRates.getCallRates
    );

    app.put(
        "/api/callRates/set/:id",
        permit.context.validateToken,
        api.callRates.set
    );

    app.post("/api/feedbacks/add",
        permit.context.validateToken,
        api.feedbacks.create
    );

    app.get("/api/feedbacks/list",
        permit.context.validateToken,
        api.feedbacks.getFeedbacks
    );

    app.post("/api/reports/create",
        permit.context.validateToken,
        api.reports.create
    );
    app.get("/api/reports/getReports",
        permit.context.validateToken,
        api.reports.getReports
    );

    log.end();
};

exports.configure = configure;