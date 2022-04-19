const create = async (model, context) => {
    const log = context.logger.start(`services:history:create`);
    const history = await new db.history({
        toUser: model.toUser,
        fromUser: model.fromUser,
        type: model.type,
        callType: model.callType,
        coin: model.coin,
        time: model.dateTime,
        duration: model.duration,
    }).save();
    log.end();
    return history
};

const getHistoryByUserId = async (id, context) => {
    const log = context.logger.start(`services:history:getHistoryByUserId`);
    if (!id) {
        throw new Error('user id is required')
    }
    const history = await db.history.findOne({ user: id }).populate(["fromUser", "toUser"])
    log.end();
    return history
};

exports.create = create;
exports.getHistoryByUserId = getHistoryByUserId;