"use strict";
const service = require("../services/users");
const response = require("../exchange/response");
const mapper = require("../mappers/user");

//register api

const create = async (req, res) => {

    const log = req.context.logger.start(`api:users:create`);
    try {
        const user = await service.create(req.body, req.context);
        const message = "User Register Successfully";
        log.end();
        return response.success(res, message, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//login api

const login = async (req, res) => {
    const log = req.context.logger.start("api:users:login");
    try {
        const user = await service.login(req.body, req.context);
        log.end();
        let message = "login successfully"
        return response.authorized(res, message, mapper.toModel(user), user.token);
        // return response.authorized(res, message, user, user.token);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

// profile user
const profile = async (req, res) => {
    const log = req.context.logger.start(`api:users:currentUser`);
    try {
        const user = await service.profile(req.params.id, req.context);
        const message = "user Profile";
        log.end();
        return response.success(res, message, mapper.toModel(user));
        // return response.success(res, message, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

// reset password

const resetPassword = async (req, res) => {
    const log = req.context.logger.start("api:users:resetPassword");
    try {
        const message = await service.resetPassword(req.params.id, req.body, req.context);
        log.end();
        return response.success(res, message);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//update user

const update = async (req, res) => {
    const log = req.context.logger.start(`api:users:update`);
    try {
        const user = await service.update(req.params.id, req.body, req.context);
        log.end();
        return response.data(res, mapper.toModel(user));
        // return response.data(res, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const uploadProfileImage = async (req, res) => {
    const log = req.context.logger.start(`api:posts:uploadProfileImage`);
    try {
        const product = await service.uploadProfilePic(req.params.id, req.files, req.context);
        log.end();
        return response.data(res, product);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//follow api
const follow = async (req, res) => {
    const log = req.context.logger.start(`api:users:follow`);
    try {
        const resMsg = await service.follow(req.body, req.context);
        log.end();
        return response.success(res, resMsg, '');
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//unFollow api
const unfollow = async (req, res) => {
    const log = req.context.logger.start(`api:users:unfollow`);
    try {
        const resMsg = await service.unfollow(req.body, req.context);
        log.end();
        return response.success(res, resMsg, '');
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//following api
const following = async (req, res) => {
    const log = req.context.logger.start(`api:users:following`);
    try {
        const users = await service.following(req.params.id, req.context);
        const msg = 'list fetched successfully'
        log.end();
        return response.success(res, msg, users);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//followers api
const followers = async (req, res) => {
    const log = req.context.logger.start(`api:users:followers`);
    try {
        const users = await service.followers(req.params.id, req.context);
        const msg = 'list fetched successfully'
        log.end();
        return response.success(res, msg, users);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const socialLogin = async (req, res) => {
    const log = req.context.logger.start(`api:users:socialLogin`);
    try {
        const user = await service.socialLogin(req.params.id, req.context);
        log.end();
        return response.authorized(res, message, user, user.token);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
const random = async (req, res) => {

    const log = req.context.logger.start(`api:users:random:${req.query}`);
    try {
        const users = await service.random(req.query, req.context);
        log.end();
        return response.data(res, users);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};
exports.create = create;
exports.login = login;
exports.resetPassword = resetPassword;
exports.update = update;
exports.profile = profile;
exports.uploadProfileImage = uploadProfileImage;
exports.follow = follow;
exports.unfollow = unfollow;
exports.following = following;
exports.followers = followers;
exports.socialLogin = socialLogin;
exports.random = random;
