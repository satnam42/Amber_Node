"use strict";
const response = require("../exchange/response");


const create = (req, res, next) => {
    const log = req.context.logger.start("validators:users:follow");

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }

    if (!req.body.toUser) {
        log.end();
        return response.failure(res, "toUser id is required");
    }

    if (!req.body.byUser) {
        log.end();
        return response.failure(res, "byUser id is required");
    }

    if (!req.body.type) {
        log.end();
        return response.failure(res, "type is required ");
    }
    if (!req.body.duration) {
        log.end();
        return response.failure(res, "duration is required ");
    }
    if (!req.body.dateTime) {
        log.end();
        return response.failure(res, "dateTime is required ");
    }

    log.end();
    return next();
};

exports.create = create;
