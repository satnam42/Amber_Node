const encrypt = require("../permit/crypto.js");
const auth = require("../permit/auth");

const buildUser = async (model, context) => {
    const { username, email, gender, firstName, lastName, phoneNo, password, country, status, dob } = model;
    const log = context.logger.start(`services:users:buildUser${model}`);
    const user = await new db.user({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
        country: country,
        dob: dob,
        phoneNo: phoneNo,
        status: status,
        password: password
    }).save();
    log.end();
    return user;
};

const setUser = async (model, user, context) => {
    const log = context.logger.start("services:users:setUser");
    if (model.username !== "string" && model.username !== undefined) {
        user.username = model.username;
    }
    if (model.firstName !== "string" && model.firstName !== undefined) {
        user.firstName = model.firstName;
    }
    if (model.lastName !== "string" && model.lastName !== undefined) {
        user.lastName = model.lastName;
    }
    if (model.dob !== "string" && model.dob !== undefined) {
        user.dob = model.dob;
    }
    if (model.phoneNo !== "string" && model.phoneNo !== undefined) {
        user.phoneNo = model.phoneNo;
    }
    if (model.email !== "string" && model.email !== undefined) {
        user.email = model.email;
    }
    if (model.country !== "string" && model.country !== undefined) {
        user.country = model.country;
    }
    if (model.gender !== "string" && model.gender !== undefined) {
        user.gender = model.gender;
    }
    if (model.bio !== "string" && model.bio !== undefined) {
        user.bio = model.bio;
    }
    if (model.website !== "string" && model.website !== undefined) {
        user.website = model.website;
    }

    log.end();
    await user.save();
    return user;
};

const create = async (model, context) => {

    const log = context.logger.start("services:users:create");
    let user = await db.user.findOne({ username: model.username });
    if (user) {
        throw new Error(`${model.username} already taken choose another!`);
    } else {
        model.password = encrypt.getHash(model.password, context);
        user = buildUser(model, context);
        log.end();
        return user;
    }
};

const login = async (model, context) => {
    const log = context.logger.start("services:users:login");
    const user = await db.user.findOne({ $or: [{ username: model.username }, { email: model.username }] })
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
    const log = context.logger.start(`service / users / resetPassword`);
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
    const log = context.logger.start(`services: users: update`);
    let entity = await db.user.findById(id)
    if (!entity) {
        throw new Error("invalid user");
    }
    const user = await setUser(model, entity, context);
    log.end();
    return user
};

const profile = async (id, context) => {
    const log = context.logger.start(`services: users: profile`);
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

const uploadProfilePic = async (id, files, context) => {
    const log = context.logger.start(`services:users:uploadProfilePic`);
    let fileName = files[0].filename.replace(/ /g, '')
    let file = files[0]
    if (!id) {
        throw new Error("user id is required");
    }
    let user = await db.user.findById(id)
    if (!user) {
        throw new Error("user not found");
    }
    if (file == undefined || file.size == undefined || file.size <= 0) throw new Error("image is required");
    if (user.avatar != "") {
        const path = file.destination + '/' + user.avatar
        try {
            fs.unlinkSync(path);
            console.log(`image successfully removed from ${path}`);
        } catch (error) {
            console.error('there was an error to remove image:', error.message);
        }
    }
    user.avatar = fileName
    user.save()
    log.end();
    return 'image uploaded successfully'

}

exports.create = create;
exports.resetPassword = resetPassword;
exports.update = update;
exports.login = login;
exports.profile = profile;
exports.uploadProfilePic = uploadProfilePic;
