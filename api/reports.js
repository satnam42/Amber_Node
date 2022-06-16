"use strict";
const service = require("../services/reports");
const response = require("../exchange/response");

const create = async (req, res) => {
    const log = req.context.logger.start(`api:reports:create`);
    try {
        const report = await service.create(req.body, req.context);
        const message = "Report Register Successfully";
        log.end();
        return response.authorized(res, message, mapper.toModel(report), report.token);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


const getReports = async (req, res) => {
    const log = req.context.logger.start(`api:reports:currentReport`);
    try {
        const report = await service.getReports(req.query, req.context);
        const message = "report  list fetched successfully";
        log.end();
        return response.page(res, report, Number(req.query.pageNo), Number(req.query.pageSize), report.count);
        // return response.success(res, message, report);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
}

exports.create = create;
exports.getReports = getReports;

