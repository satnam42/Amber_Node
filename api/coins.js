"use strict";
const service = require("../services/coin");
const response = require("../exchange/response");
const mapper = require("../mappers/coin");

const add = async (req, res) => {
    const log = req.context.logger.start(`api:coins:add`);
    try {
        const coin = await service.create(req.body, req.context);
        const message = "Coin added Successfully";
        log.end();
        return response.success(res, message, coin);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const uploadIcon = async (req, res) => {
    const log = req.context.logger.start(`api:coins:uploadIcon`);
    try {
        const image = await service.uploadIcon(req.params.id, req.files, req.context);
        log.end();
        return response.data(res, image);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getCoinList = async (req, res) => {
    const log = req.context.logger.start(`api:coins:currentUser`);
    try {
        const coins = await service.getCoinList(req.query, req.context);
        const message = "coin  list fetched successfully";
        log.end();
        return response.page(res, mapper.toSearchModel(coins), Number(req.query.pageNo), Number(req.query.pageSize), coins.count);
        // return response.success(res, message, coin);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const buy = async (req, res) => {
    const log = req.context.logger.start(`api:coins:buy`);
    try {
        const buy = await service.buy(req.body, req.context);
        log.end();
        return response.data(res, buy);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const checkPaymentStatus = async (req, res) => {
    const log = req.context.logger.start(`api:coins:checkPaymentStatus`);
    try {
        const buy = await service.checkPaymentStatus(req.body, req.context);
        log.end();
        return response.data(res, buy);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const myCoins = async (req, res) => {
    const log = req.context.logger.start(`api:coins:checkPaymentStatus`);
    try {
        const coins = await service.myCoins(req.params.id, req.context);
        log.end();
        return response.data(res, coins);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const deduct = async (req, res) => {
    const log = req.context.logger.start(`api:coins:deduct`);
    try {
        const deduct = await service.deduct(req.body, req.context);
        log.end();
        return response.data(res, deduct);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const setPopular = async (req, res) => {
    const log = req.context.logger.start(`api:coins:setPopular`);
    try {
        const coin = await service.setPopular(req.params.id, req.params.setPopular, req.context);
        log.end();
        return response.data(res, coin);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const setOffer = async (req, res) => {
    const log = req.context.logger.start(`api:coins:setOffer`);
    try {
        const coin = await service.setOffer(req.params.id, req.params.setOffer, req.context);
        log.end();
        return response.data(res, coin);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getDailyOffers = async (req, res) => {
    const log = req.context.logger.start(`api:coins:currentUser`);
    try {
        const coins = await service.getDailyOffers(req.context);
        log.end();
        return response.data(res, mapper.toSearchModel(coins));
        // return response.success(res, message, coin);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

exports.add = add;
exports.getCoinList = getCoinList;
exports.buy = buy;
exports.checkPaymentStatus = checkPaymentStatus;
exports.myCoins = myCoins;
exports.deduct = deduct;
exports.uploadIcon = uploadIcon;
exports.getDailyOffers = getDailyOffers;
exports.setOffer = setOffer;
exports.setPopular = setPopular;
