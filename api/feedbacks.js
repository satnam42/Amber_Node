"use strict";
const service = require("../services/feedbacks");
const response = require("../exchange/response");

const create = async (req, res) => {
    const log = req.context.logger.start(`api:feedbacks:create`);
    try {
        const feedback = await service.create(req.body, req.context);
        const message = "feedbacks added Successfully";
        log.end();
        return response.success(res, message, feedback);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getFeedbacks = async (req, res) => {
    const log = req.context.logger.start(`api:feedbacks:getFeedbacks`);
    try {
        const feedback = await service.getFeedbacks(req.query, req.context);
        const message = "feedbacks  list fetched successfully";
        log.end();
        return response.page(res, feedback, Number(req.query.pageNo), Number(req.query.pageSize), feedback.count);
        // return response.success(res, message, feedback);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};



exports.create = create;
exports.getFeedbacks = getFeedbacks;


