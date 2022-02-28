const ObjectId = require("mongodb").ObjectId

const buildGift = async (model, context) => {
    const { username, email, gender, firstName, lastName, phoneNo, password, country, status, dob, platform, socialLoginId } = model;
    const log = context.logger.start(`services:users:buildGift${model}`);
    const gift = await new db.gift({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
        country: country,
        platform: platform,
        socialLoginId: socialLoginId,
        dob: dob,
        phoneNo: phoneNo,
        status: status,
        password: password
    }).save();
    log.end();
    return gift;
};

const setGift = async (model, gift, context) => {
    const log = context.logger.start("services:users:setGift");
    if (model.username !== "string" && model.username !== undefined) {
        gift.username = model.username;
    }
    if (model.firstName !== "string" && model.firstName !== undefined) {
        gift.firstName = model.firstName;
    }
    if (model.lastName !== "string" && model.lastName !== undefined) {
        gift.lastName = model.lastName;

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


