const ObjectId = require("mongodb").ObjectId

const buildCallRate = async (model, context) => {
    const { rate } = model;
    const log = context.logger.start(`services:callRates:buildGift${model}`);
    const callRate = await new db.callRate({
        rate: rate,
        status: 'active',
    }).save();

    log.end();
    return callRate;
};

const create = async (model, context) => {
    const log = context.logger.start("services:callRates:create");
    let callRate = await db.callRate.findOne({ status: 'active' });
    if (callRate) {
        callRate.status = "inactive"
    }
    await callRate.save()
    callRate = buildCallRate(model, context);
    log.end();
    return callRate;
};

const getCallRates = async (query, context) => {
    const log = context.logger.start(`services:callRates:getCallRates`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // const userId = context.callRate.id || context.callRate._id
    const callRates = await db.callRate.find().skip(skipCount).limit(pageSize)
    callRates.count = await db.callRate.find().count();
    log.end()
    return callRates
};

exports.create = create;
exports.getCallRates = getCallRates;