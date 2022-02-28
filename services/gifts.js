const ObjectId = require("mongodb").ObjectId

const buildGift = async (model, context) => {
    const { name, coin, status } = model;
    const log = context.logger.start(`services:users:buildGift${model}`);
    const gift = await new db.gift({
        name: name,
        coin: coin,
        status: status,
    }).save();
    log.end();
    return gift;
};

const setGift = async (model, gift, context) => {
    const log = context.logger.start("services:users:setGift");
    if (model.coin !== "string" && model.coin !== undefined) {
        gift.coin = model.coin;
    }
    if (model.name !== "string" && model.name !== undefined) {
        gift.name = model.name;
    }
    log.end();
    await gift.save();
    return gift;
};

const create = async (model, context) => {
    const log = context.logger.start("services:users:create");
    let gift = await db.gift.findOne({ username: model.username });
    if (gift) {
        throw new Error(`${model.username} already taken choose another!`);
    } else {
        model.password = encrypt.getHash(model.password, context);
        gift = buildGift(model, context);
        log.end();
        return gift;
    }
};


const update = async (id, model, context) => {
    const log = context.logger.start(`services: users: update`);
    let entity = await db.gift.findById(id)
    if (!entity) {
        log.end();
        throw new Error("invalid gift");
    }
    const gift = await setGift(model, entity, context);
    log.end();
    return gift
};

const getGifts = async (query, context) => {
    const log = context.logger.start(`services:users:getGifts`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // const userId = context.gift.id || context.gift._id
    const users = await db.gift.find().skip(skipCount).limit(pageSize)
    users.count = await db.gift.find().count();
    log.end()
    return users
};


exports.create = create;
exports.update = update;
exports.getGifts = getGifts;


