"use strict";
const service = require("../services/redeem");
const response = require("../exchange/response");

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
        return response.payPalfailure(res, err.response.message || err.message, err.httpStatusCode || 400);
    }
};


exports.create = create;

