const encrypt = require("../permit/crypto.js");
const auth = require("../permit/auth");
const path = require("path");
const fs = require("fs");
const ObjectId = require("mongodb").ObjectId
const utility = require("../utility/index")

const buildFeedback = async (model, context) => {
    const { msg,
        name,
        userId } = model;
    const log = context.logger.start(`services:feedbacks:buildFeedback${model}`);
    const feedback = await new db.feedback({
        msg: msg,
        name: name,
        user: userId,
    }).save();
    log.end();
    return feedback;
};

const create = async (model, context) => {
    const log = context.logger.start("services:feedbacks:create");
    let feedback = await db.feedback.findOne({ user: model.userId, });
    if (feedback) {
        feedback.msg = model.msg
        await feedback.save()
        log.end();
    } else {
        feedback = buildFeedback(model, context);
        log.end();
    }
    return feedback
};

const getFeedbacks = async (query, context) => {
    const log = context.logger.start(`services:feedbacks:getFeedbacks`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    const feedbacks = await db.feedback.find().skip(skipCount).limit(pageSize)
    feedbacks.count = await db.feedback.find().count();
    log.end()
    return feedbacks
};


exports.create = create;
exports.getFeedbacks = getFeedbacks;

