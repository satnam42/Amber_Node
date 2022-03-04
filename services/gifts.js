const ObjectId = require("mongodb").ObjectId

const buildGift = async (model, context) => {
    const { title, coin, description } = model;
    const log = context.logger.start(`services:gifts:buildGift${model}`);
    const gift = await new db.gift({
        title: title,
        coin: coin,
        description: description,
    }).save();
    log.end();
    return gift;
};

const setGift = async (model, gift, context) => {
    const log = context.logger.start("services:gifts:setGift");
    if (model.coin !== "string" && model.coin !== undefined) {
        gift.coin = model.coin;
    }
    if (model.title !== "string" && model.title !== undefined) {
        gift.title = model.title;
    }
    if (model.description !== "string" && model.description !== undefined) {
        gift.description = model.description;
    }
    log.end();
    await gift.save();
    return gift;
};

const create = async (model, context) => {
    const log = context.logger.start("services:gifts:create");
    let gift = await db.gift.findOne({ title: model.title });
    if (gift) {
        throw new Error(`${model.title} already exits choose another!`);
    } else {
        gift = buildGift(model, context);
        log.end();
        return gift;
    }
};

const update = async (id, model, context) => {
    const log = context.logger.start(`services: gifts: update`);
    let entity = await db.gift.findById(id)
    if (!entity) {
        log.end();
        throw new Error("invalid gift");
    }
    const gift = await setGift(model, entity, context);
    log.end();
    return gift
};

const send = async (model, context) => {
    const log = context.logger.start(`services: gifts: send`);
    let gift = await db.gift.findById(model.giftId)
    if (!gift) {
        log.end();
        throw new Error("invalid gift id");
    }
    // const gift = await setGift(model, entity, context);
    log.end();
    return gift
};

const getGifts = async (query, context) => {
    const log = context.logger.start(`services:gifts:getGifts`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // const userId = context.gift.id || context.gift._id
    const gifts = await db.gift.find().skip(skipCount).limit(pageSize)
    gifts.count = await db.gift.find().count();
    log.end()
    return gifts
};

const uploadIcon = async (id, files, context) => {
    const log = context.logger.start(`services:gifts:uploadIcon`);
    let fileName = files[0].filename.replace(/ /g, '')
    let file = files[0]
    if (!id) {
        throw new Error("gift id is required");
    }
    let gift = await db.gift.findById(id)
    if (!gift) {
        log.end();
        throw new Error("gift not found");
    }
    if (file == undefined || file.size == undefined || file.size <= 0) throw new Error("image is required");
    if (gift.icon != "") {
        const path = file.destination + '/' + gift.icon
        try {
            fs.unlinkSync(path);
            console.log(`image successfully removed from ${path}`);
        } catch (error) {
            console.error('there was an error to remove image:', error.message);
        }
    }
    // user.images.push({ name: fileName })
    gift.icon = fileName
    await gift.save()
    log.end();
    return 'icon uploaded successfully'

}


exports.create = create;
exports.update = update;
exports.getGifts = getGifts;
exports.send = send;
exports.uploadIcon = uploadIcon;


