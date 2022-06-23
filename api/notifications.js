"use strict";
const service = require("../services/notifications");
const response = require("../exchange/response");


const sendCallNotification = async (req, res) => {
    const log = req.context.logger.start("api:notifications:sendCallNotification");
    try {
        const notification = await service.sendCallNotification(req.body, req.context);
        log.end();
        return response.data(res, notification);
        // return response.authorized(res, message, user, user.token);
    }
    catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

const random = async (req, res) => {
    const log = req.context.logger.start("api:notifications:random");
    try {
        const notification = await service.random(req.body, req.context);
        log.end();
        return response.data(res, notification);
        // return response.authorized(res, message, user, user.token);
    }
    catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};
const save = async (req, res) => {
    const log = req.context.logger.start("api:notifications:save");
    try {
        const notification = await service.save(req.body, req.context);
        log.end();
        return response.data(res, notification);
        // return response.authorized(res, message, user, user.token);
    }
    catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

const byUserId = async (req, res) => {
    const log = req.context.logger.start(`api:notifications:byUserId${req.params.id}`);
    try {
        const notifications = await service.notificationsByUserId(req.params.id, req.context);
        log.end();
        return response.data(res, notifications);
        // return response.data(res, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
const seen = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:seen${req.params.id}`);
    try {
        const notifications = await service.seen(req.params.id, req.context);
        log.end();
        return response.data(res, notifications);
        // return response.data(res, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

exports.sendCallNotification = sendCallNotification;
exports.random = random;
exports.save = save;
exports.byUserId = byUserId
exports.seen = seen

