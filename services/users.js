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
    user.token = auth.getToken(user.id, false, context);
    log.end();
    return user;
};

const resetPassword = async (id, model, context) => {
    const log = context.logger.start(`service:users:resetPassword`);
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
        log.end();
        throw new Error("invalid user");
    }
    const user = await setUser(model, entity, context);
    log.end();
    return user
};

const profile = async (id, context) => {
    const log = context.logger.start(`services: users: profile`);
    if (!id) {
        log.end();
        throw new Error("user id is required");
    }
    let user = await db.user.findById(id)
    if (!user) {
        log.end();
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
        log.end();
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
    await user.save()
    log.end();
    return 'image uploaded successfully'

}
const follow = async (model, context) => {
    const log = context.logger.start("services:users:follow");
    // ===========following logic ===============
    // add the id of the user you want to follow in following array
    if (model.toFollowUserId == model.userId) {
        log.end();
        throw new Error("userId and toFollowUserId not be same")
    }
    const filter = {
        _id: model.userId,
        following: { $not: { $elemMatch: { $eq: model.toFollowUserId } } }
    }

    const update = {
        $addToSet: { following: model.toFollowUserId }
    }

    const updated = await db.user.findOneAndUpdate(filter, update)

    // add your id to the followers array of the user you want to follow
    const secondFilter = {
        _id: model.toFollowUserId,
        followers: { $not: { $elemMatch: { $eq: model.userId } } }
    }
    const secondUpdate = {
        $addToSet: { followers: model.userId }
    }
    const secondUpdated = await db.user.findOneAndUpdate(secondFilter, secondUpdate)

    if (!updated && !secondUpdated) {
        throw new Error('something went wrong')
    }
    log.end()
    return "follow successfully"
};

const unfollow = async (model, context) => {
    const log = context.logger.start("services:users:unFollow");
    // ===========unfollower logic end ===============
    // remove the id of the user you want to unfollow from following array
    if (model.toUnfollowUserId == model.userId) {
        log.end();
        throw new Error("userId and toUnfollowUserId not be same")
    }

    const query = {
        _id: model.userId,
        following: { $elemMatch: { $eq: model.toUnfollowUserId } }
    }

    const update = {
        $pull: { following: model.toUnfollowUserId }
    }

    const updated = await db.user.updateOne(query, update)

    // remove your id from the followers array of the user you want to unfollow
    const secondQuery = {
        _id: model.toUnfollowUserId,
        followers: { $elemMatch: { $eq: model.userId } }
    }

    const secondUpdate = {
        $pull: { followers: model.userId }
    }

    const secondUpdated = await db.user.updateOne(secondQuery, secondUpdate)

    if (!updated && !secondUpdated) {
        throw new Error('something went wrong')
    }
    log.end()
    return "unfollow successfully"
};

const following = async (id, context) => {
    const log = context.logger.start(`services:users:following`);
    if (!id) {
        throw new Error('user id is requried')

    }
    const user = await db.user.findById(id).populate('following')
    log.end();
    return user.following
};

const followers = async (id, context) => {
    const log = context.logger.start(`services:users:followers`);
    if (!id) {
        throw new Error('user id is requried')
    }
    const user = await db.user.findById(id).populate('followers')
    log.end();
    return user.followers
};

const block = async (modal, context) => {
    const log = context.logger.start(`services:users:block`);
    const block = await new db.block({
        toUser: modal.toUser,
        byUser: modal.byUser,
        to: modal.to,
    }).save();
    log.end();
    return block
};

const unblock = async (modal, context) => {
    const log = context.logger.start(`services:users:unblock`);
    const user = await db.user.findById(id).populate('followers')
    log.end();
    return user.followers
};

exports.create = create;
exports.resetPassword = resetPassword;
exports.update = update;
exports.login = login;
exports.profile = profile;
exports.uploadProfilePic = uploadProfilePic;

// ============follow==============

exports.follow = follow;
exports.unfollow = unfollow;
exports.following = following;
exports.followers = followers;

// ============follow==============

exports.block = block;
exports.unblock = unblock;