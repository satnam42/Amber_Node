const encrypt = require("../permit/crypto.js");
const auth = require("../permit/auth");

const buildUser = async (model, context) => {
    const { name, phoneNo, email, password, } = model;
    const log = context.logger.start(`services:users:buildUser${model}`);
    const user = await new db.user({
        name: name,
        email: email,
        phoneNo: phoneNo,
        password: password
    }).save();
    log.end();
    return user;
};

const setUser = async (model, user, context) => {
    const log = context.logger.start("services:users:setUser");
    if (model.name !== "string" && model.name !== undefined) {
        user.name = model.name;
    }
    if (model.gender !== "string" && model.gender !== undefined) {
        user.gender = model.gender;
    }
    if (model.interestedIn !== "string" && model.interestedIn !== undefined) {
        user.interestedIn = model.interestedIn;
    }
    if (model.address !== "string" && model.address !== undefined) {
        user.address = model.address;
    }
    if (model.city !== "string" && model.city !== undefined) {
        user.city = model.city;
    }
    if (model.dob !== "string" && model.dob !== undefined) {
        user.dob = model.dob;
    }
    if (model.interests.length !== "string" && model.interests.length !== undefined) {
        user.interests = model.interests;
    }
    if (model.education !== undefined && model.education.isVisible !== "string") {
        user.education = model.education;
    }
    if (model.career.isVisible !== "string" && model.career !== undefined) {
        user.career = model.career;
    }
    if (model.drinking.isVisible !== "string" && model.drinking !== undefined) {
        user.drinking = model.drinking;
    }
    if (model.smoking.isVisible !== "string" && model.smoking !== undefined) {
        user.smoking = model.smoking;
    }
    if (model.religion.isVisible !== "string" && model.religion !== undefined) {
        user.religion = model.religion;
    }
    if (model.political.isVisible !== "string" && model.political !== undefined) {
        user.political = model.political;
    }
    log.end();
    await user.save();
    return user;
};

const create = async (model, context) => {
    const log = context.logger.start("services:users:create");
    let user = await db.user.findOne({ email: model.email });
    if (user) {
        throw new Error("user already exists");
    } else {
        model.password = encrypt.getHash(model.password, context);
        user = buildUser(model, context);
        log.end();
        return user;
    }
};

const login = async (model, context) => {
    const log = context.logger.start("services:users:login");
    const user = await db.user.findOne({ email: model.phoneNo })
    if (!user) {
        log.end();
        throw new Error("user not found");
    }
    if (user.status === 'inactive') {
        throw new Error("user Is inactive please contect with admin");
    }
    const isMatched = encrypt.compareHash(model.password, user.password, context);

    if (!isMatched) {
        log.end();
        throw new Error("password mismatch");
    }

    const token = auth.getToken(user.id, false, context);
    user.token = token;
    user.updatedOn = new Date();
    await user.save();
    log.end();
    return user;
};

const resetPassword = async (id, model, context) => {
    const log = context.logger.start(`service/users/resetPassword`);
    if (!id) {
        throw new Error("user id is required");
    }
    let user = await db.user.findById(id)
    if (!user) {
        log.end();
        throw new Error("user is not found");
    }
    const isMatched = encrypt.compareHash(
        model.oldPassword,
        user.password,
        context
    );

    if (isMatched) {
        const newPassword = encrypt.getHash(model.newPassword, context);
        user.password = newPassword;
        user.updatedOn = new Date();
        await user.save();
        log.end();
        return "Password Updated Successfully";
    } else {
        log.end();
        throw new Error("Old Password Not Match");
    }

};

const update = async (id, model, context) => {
    const log = context.logger.start(`services:users:update`);
    let entity = await db.user.findById(id)
    if (!entity) {
        throw new Error("invalid user");
    }
    const user = await setUser(model, entity, context);
    log.end();
    return user
};

const profile = async (id, context) => {
    const log = context.logger.start(`services:users:profile`);
    if (!id) {
        throw new Error("user id is required");
    }
    let user = await db.user.findById(id)
    if (!user) {
        throw new Error("user not found");
    }
    log.end();
    return user;
};

exports.create = create;
exports.resetPassword = resetPassword;
exports.update = update;
exports.login = login;
exports.profile = profile;
