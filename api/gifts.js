"use strict";
const service = require("../services/gifts");
const response = require("../exchange/response");

const add = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:add`);
    try {
        const gift = await service.create(req.body, req.context);
        const message = "Gift added Successfully";
        log.end();
        return response.success(res, message, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const update = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:update`);
    try {
        const gift = await service.update(req.params.id, req.body, req.context);
        log.end();
        return response.data(res, mapper.toModel(gift));
        // return response.data(res, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
const send = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:send`);
    try {
        const gift = await service.send(req.body, req.context);
        log.end();
        return response.data(res, mapper.toModel(gift));
        // return response.data(res, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getGifts = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:currentUser`);
    try {
        const gift = await service.getGifts(req.query, req.context);
        const message = "gift  list fetched successfully";
        log.end();
        return response.page(res, gift, Number(req.query.pageNo), Number(req.query.pageSize), gift.count);
        // return response.success(res, message, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};



exports.add = add;
exports.update = update;
exports.getGifts = getGifts;
exports.send = send;
