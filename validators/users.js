"use strict";
const response = require("../exchange/response");

const create = (req, res, next) => {
    const log = req.context.logger.start("validators:users:create");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.email) {
        log.end();
        return response.failure(res, "email is required");
    }
    if (!req.body.phoneNo) {
        log.end();
        return response.failure(res, "phoneNo is required");
    }
    if (!req.body.password) {
        log.end();
        return response.failure(res, "password is required");
    }
    if (!req.body.username) {
        log.end();
        return response.failure(res, "username is required");
    }
    log.end();
    return next();
};

const login = (req, res, next) => {
    const log = req.context.logger.start("validators:users:login");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.username) {
        log.end();
        return response.failure(res, "username is required");
    }
    if (!req.body.password) {
        log.end();
        return response.failure(res, "password is required");
    }
    log.end();
    return next();
};

const resetPassword = (req, res, next) => {
    const log = req.context.logger.start("validators:users:resetPassword");

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.oldPassword) {
        log.end();
        return response.failure(res, "old Password is required");
    }
    if (!req.body.newPassword) {
        log.end();
        return response.failure(res, "new Password is required");
    }
    log.end();
    return next();
};


const follow = (req, res, next) => {
    const log = req.context.logger.start("validators:users:follow");

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.userId) {
        log.end();
        return response.failure(res, "userId is required");
    }
    if (!req.body.toFollowUserId) {
        log.end();
        return response.failure(res, "Follow id is required");
    }

    log.end();
    return next();
};

const unfollow = (req, res, next) => {
    const log = req.context.logger.start("validators:users:unfollow");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.userId) {
        log.end();
        return response.failure(res, "userId is required");
    }
    if (!req.body.toUnfollowUserId) {
        log.end();
        return response.failure(res, "UnFollow id is required");
    }
    log.end();
    return next();

};

exports.create = create;
exports.resetPassword = resetPassword;
exports.login = login;
exports.follow = follow;
exports.unfollow = unfollow;