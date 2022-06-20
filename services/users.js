const encrypt = require("../permit/crypto.js");
const auth = require("../permit/auth");
const path = require("path");
const fs = require("fs");
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const { appID, appCertificate } = require('config').get('agora')
const ObjectId = require("mongodb").ObjectId
const utility = require("../utility/index")
const ffmpeg = require('fluent-ffmpeg');
const nodemailer = require('nodemailer')
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfprobePath(ffprobePath);
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const buildUser = async (model, context) => {
    const { username, email, gender, password, country, status, dob, platform, socialLoginId, deviceToken } = model;
    const log = context.logger.start(`services:users:buildUser${model}`);
    const user = await new db.user({
        username: username,
        email: email,
        gender: gender,
        country: country,
        platform: platform,
        socialLoginId: socialLoginId,
        dob: dob,
        status: status,
        deviceToken: deviceToken,
        password: password
    }).save();
    log.end();
    return user;
};

const setUser = async (model, user, context) => {
    const log = context.logger.start("services:users:setUser");

    if (model.dob !== "string" && model.dob !== undefined) {
        user.dob = model.dob;
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
    if (model.deviceToken !== '_') {
        await utility.verifyFCMToken(model.deviceToken)
    }
    let user = await db.user.findOne({ $or: [{ username: model.username }, { email: model.email }] });
    if (user) {
        let username = user.username === model.username ? user.username : user.email
        throw new Error(`${username} already taken choose another!`);
    } else {
        model.password = encrypt.getHash(model.password, context);
        user = await buildUser(model, context);
        // if (user.platform != "") {
        user.token = auth.getToken(user.id, false, context);
        // }
        log.end();
        return user
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
        throw new Error("user Is inactive please content with admin");
    }
    const isMatched = encrypt.compareHash(model.password, user.password, context);
    if (!isMatched) {
        log.end();
        throw new Error("password mismatch");
    }
    user.deviceToken = model.deviceToken;
    user.updatedOn = new Date();
    await user.save();
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
    let user = await db.user.aggregate([
        {
            $match: { _id: ObjectId(id) }

        },

        {
            $project: {
                _id: 0,
                "_id": "$_id",
                "firstName": "$firstName",
                "lastName": "$lastName",
                "avatar": "$avatar",
                "following": "$following",
                "followers": "$followers",
                // to handle following and follower count
                // "follow": "$following",
                // "follower": "$followers",
                "gender": "$gender",
                "bio": "$bio",
                "videos": "$videos",
                "images": "$images",
                // which i have follow
                "followersF": {
                    $filter: {
                        input: "$following",
                        as: "following",
                        cond: { $eq: ["$$following.userId", ObjectId(context.user.id)] }
                    }
                },
                // my follower
                "followingF": {
                    $filter: {
                        input: "$followers",
                        as: "followers",
                        cond: { $eq: ["$$followers.userId", ObjectId(context.user.id)] }
                    }
                }

            }
        },
        {
            $unwind: {
                path: '$followingF',
                preserveNullAndEmptyArrays: true
            },
        },
        {
            $unwind: {
                path: '$followersF',
                preserveNullAndEmptyArrays: true
            },
        },
        // {
        //     $unwind: {
        //         path: '$following',
        //         preserveNullAndEmptyArrays: true
        //     },
        // },
        // {
        //     $unwind: {
        //         path: '$followers',
        //         preserveNullAndEmptyArrays: true
        //     },
        // },

        {
            $addFields: {
                "isFollowing":
                {
                    $cond: {
                        if: {
                            $eq: ["$followingF.userId", ObjectId(context.user.id)]
                        }, then: true, else: false
                    }
                }
            }
        },
        {
            $addFields: {
                "isFollower":
                {
                    $cond: {
                        if: {
                            $eq: ["$followersF.userId", ObjectId(context.user.id)]
                        }, then: true, else: false
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                "_id": "$_id",
                "firstName": "$firstName",
                "lastName": "$lastName",
                "avatar": "$avatar",
                "following": "$following",
                "followers": "$followers",
                "gender": "$gender",
                "bio": "$bio",
                "videos": "$videos",
                "images": "$images",
                "isFollowing": "$isFollowing",
                "isFollower": "$isFollower",
            }
        },


    ])
    if (user.length > 0) {
        user = user[0]
        const blockedUsers = await db.block.find({ $or: [{ byUser: context.user.id }, { toUser: context.user.id }] })

        // for (let index = 0; index < users.length; index++) {
        // const user = users[index]
        for (let i = 0; i < blockedUsers.length; i++) {
            const blockedUser = blockedUsers[i];
            console.log(blockedUser.toUser.toString() == user._id.toString())
            if (blockedUser.toUser.toString() == user._id.toString()) {
                user.isBlocked = true
            } else {
                console.log(blockedUser.byUser.toString() == user._id.toString())
                if (blockedUser.byUser.toString() == user._id.toString()) {
                    user.isBlocked = true
                }
            }
            // }

        }
    } else {
        throw new Error("user not found");
    }

    log.end();
    return user
};

const search = async (name, context) => {
    const log = context.logger.start(`services:users:search`);
    if (!name) {
        throw new Error("name is required");
    }
    const users = await db.user.find({ name: { "$regex": '.*' + name + '.*', "$options": 'i' } }).limit(5);
    return users
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
    // if (user.avatar != "") {
    //     const path = file.destination + '/' + user.avatar
    //     try {
    //         fs.unlinkSync(path);
    //         console.log(`image successfully removed from ${path}`);
    //     } catch (error) {
    //         console.error('there was an error to remove image:', error.message);
    //     }
    // }
    user.images.push({ name: fileName })
    user.avatar = fileName
    await user.save()
    log.end();
    return 'image uploaded successfully'

}
const uploadPic = async (id, files, context) => {
    const log = context.logger.start(`services:users:uploadPic`);
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
    user.images.push({ name: fileName })
    await user.save()
    log.end();
    return 'image uploaded successfully'

}

const uploadStory = async (id, files, context) => {
    const log = context.logger.start(`services:users:uploadStory`);
    let fileNameWithExt = files[0].filename.replace(/ /g, '')
    let file = files[0]
    let strIndex = fileNameWithExt.indexOf(".")

    let fileNameWithoutExt = fileNameWithExt.slice(0, strIndex)
    let thumbName = ''
    if (!id) {
        throw new Error("user id is required");
    }

    let thumbRes = await makeThumb(file.path, fileNameWithoutExt, file.destination)
    if (thumbRes.status == 'success') {
        thumbName = thumbRes.data
    }

    let user = await db.user.findById(id)

    if (!user) {
        log.end();
        throw new Error("user not found");
    }

    console.log('thumbRes', thumbRes)
    if (file == undefined || file.size == undefined || file.size <= 0) throw new Error("video  is required");
    // if (user.avatar != "") {
    //     const path = file.destination + '/' + user.avatar
    //     try {
    //         fs.unlinkSync(path);
    //         console.log(`image successfully removed from ${path}`);
    //     } catch (error) {
    //         console.error('there was an error to remove image:', error.message);
    //     }
    // }
    // user.avatar = fileName
    user.videos.push({
        name: fileNameWithExt,
        thumbnail: thumbName ? thumbName : ""
    })
    user.story = fileNameWithExt
    await user.save()
    log.end();
    return 'video uploaded successfully'

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
        following: { $not: { $elemMatch: { userId: model.toFollowUserId } } }
    }
    // const update = {
    //     $addToSet: { "following.userId": model.toFollowUserId }
    // }
    const update = {
        $push: { following: { userId: model.toFollowUserId } }
    }
    const updated = await db.user.findOneAndUpdate(filter, update)

    // add your id to the followers array of the user you want to follow
    const secondFilter = {
        _id: model.toFollowUserId,
        followers: { $not: { $elemMatch: { userId: model.userId } } }
    }
    const secondUpdate = {
        $push: { followers: { userId: model.userId } }
    }
    const secondUpdated = await db.user.findOneAndUpdate(secondFilter, secondUpdate)
    // if (!updated && !secondUpdated) {
    //     throw new Error('something went wrong')
    // }
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
        following: { $elemMatch: { userId: model.toUnfollowUserId } }

    }

    const update = {

        $pull: { following: { userId: model.toUnfollowUserId } }

    }

    const updated = await db.user.updateOne(query, update)

    // remove your id from the followers array of the user you want to unfollow
    const secondQuery = {
        _id: model.toUnfollowUserId,
        followers: { $elemMatch: { userId: model.userId } }
    }

    const secondUpdate = {
        $pull: { followers: { userId: model.userId } }
    }

    const secondUpdated = await db.user.updateOne(secondQuery, secondUpdate)

    // if (!updated && !secondUpdated) {
    //     throw new Error('something went wrong')
    // }

    log.end()
    return "unfollow successfully"
};

const removeFollower = async (model, context) => {
    const log = context.logger.start("services:users:unFollow");
    if (model.followerUserId == model.userId) {
        log.end();
        throw new Error("user and follower not be same")
    }

    const query = {

        _id: model.userId,
        followers: { $elemMatch: { userId: model.followerUserId } }

    }

    const update = {

        $pull: { followers: { userId: model.followerUserId } }

    }

    const updated = await db.user.updateOne(query, update)


    log.end()
    return "user removed successfully"
};
const following = async (id, context) => {

    const log = context.logger.start(`services:users:following`);
    if (!id) {
        throw new Error('user id is required')

    }
    const user = await db.user.findById(id).populate('following.userId')
    log.end();
    return user.following

};
const followers = async (id, context) => {

    const log = context.logger.start(`services:users:followers`);
    if (!id) {
        throw new Error('user id is required')
    }
    const user = await db.user.findById(id).populate('followers.userId')


    log.end();
    return user.followers

};
const socialLogin = async (model, context) => {
    const log = context.logger.start(`services:users:socialLogin`);
    let user = {}
    user = await db.user.findOne({ socialLoginId: model.socialLoginId });
    if (!user) {
        user = await buildUser(model, context);
        log.end()
    };
    user.token = auth.getToken(user.id, false, context);
    return user
}
const random = async (query, context) => {
    const log = context.logger.start(`services:users:random`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // if (!query.country) {
    //     throw new Error('country is required')
    // }
    // const userId = context.user.id || context.user._id

    const users = await db.user.aggregate([
        { $match: { gender: context.user.gender == 'male' ? 'female' : 'male', "_id": { $ne: context.user._id } } },
        { $sample: { size: 10 } },
        { $skip: skipCount },
        { $limit: pageSize }

    ])
    const randomImages = []

    if (users?.length > 0) {
        for (const user of users) {
            // if (user.avatar != '' || user.avatar != "" || user.avatar != "string" || user.avatar != undefined)
            if (user.avatar && user.avatar.indexOf(".")) {
                randomImages.push(user.avatar)
            }
        }
        users[0].randomImages = randomImages
    }


    return users
    log.end()
};
const getUsers = async (query, context) => {
    const log = context.logger.start(`services:users:getUsers`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // const userId = context.user.id || context.user._id
    const users = await db.user.find().skip(skipCount).limit(pageSize)
    users.count = await db.user.find().count();
    log.end()


};

const removeProfilePic = async (id, context) => {
    const log = context.logger.start(`services:users:removeProfilePic`);
    if (!id) {
        throw new Error("user id is required");
    }
    const destination = path.join(__dirname, '../', 'assets/images')
    // /home/satnam/code/amber_nodejs/assets/images
    let user = await db.user.findById(id)
    if (!user) {
        log.end();
        throw new Error("user not found");
    }
    const picLocation = destination + '/' + user.avatar
    fs.unlinkSync(picLocation);
    const images = user.images.filter(obj => obj.name !== user.avatar)
    user.avatar = null
    user.images = images
    await user.save()
    log.end();
    return 'image successfully removed'
}

const generateRtcToken = async (modal, context) => {
    const log = context.logger.start(`services:users:generateRtcToken`);
    if (!modal.channelId) {
        throw new Error("channelId id is required");
    }
    // if (!modal.userId) {
    //     throw new Error("user id is required");
    // }
    let callRate = await db.callRate.findOne({ status: 'active' });
    var digits = '0123456789';
    let randomNo = '';
    // for (let i = 0; i < 10; i++) {
    //     randomNo += digits[Math.floor(Math.random() * 10)];
    // }
    // const randoms = Math.random().toString(32).substring(2, 9);
    const uid = Math.floor(Math.random() * 100000);
    // const userId = randomNo * Date.now()
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const role = modal.isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const channel = modal.channelId;
    const token = RtcTokenBuilder.buildTokenWithUid(appID.trim(), appCertificate.trim(), channel, uid, role, privilegeExpiredTs);
    log.end()

    return {
        token: token,
        userId: uid,
        rate: callRate.rate
    }
}

const getCountries = async (query, context) => {
    const log = context.logger.start(`services:users:getCountries`);
    // let pageNo = Number(query.pageNo) || 1;
    // let pageSize = Number(query.pageSize) || 10;
    // let skipCount = pageSize * (pageNo - 1);
    // const userId = context.user.id || context.user._id
    const list = await utility.countries()
    log.end()
    return list
};


const logout = async (context) => {
    const log = context.logger.start(`services:users:logout`);
    const user = await db.user.findById(context.user.id)
    user.deviceToken = ""
    await user.save()
    log.end()
    return "logout successfully"
};

const usersByFilter = async (query, context) => {
    const log = context.logger.start(`services:users:userByFilter`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);

    let filter = []
    // ===============================================for you=================================================

    if (query.gender !== "" && query.gender !== undefined) {
        if (query.country == undefined || query.country == '' || query.country == 'string') throw new Error('country is required')
        filter = [{
            $match: { gender: context.user.gender == 'male' ? 'female' : 'male', country: query.country },
        },
        { $skip: skipCount },
        { $limit: pageSize }
        ]
    }

    // ================================================= nearBy==================================================

    else if (query.lat & query.long) {
        filter = [{
            $match: { gender: context.user.gender == 'male' ? 'female' : 'male', country: query.country },
            "location": {
                $near: {
                    $geometry:
                        { type: "Point", coordinates: [query.lat, query.long] }, $maxDistance: 10000 // 10 kilometer
                }
            }

        },
        { $skip: skipCount },
        { $limit: pageSize }

        ]
    }

    // ========================================== popular ========================================================

    else if (query.popular) {
        if (query.country == undefined || query.country == '' || query.country == 'string') throw new Error('country is required')
        filter = [
            { $match: { gender: context.user.gender == 'male' ? 'female' : 'male', country: query.country } },
            {
                $project: {
                    name: "$firstName",
                    username: "$username",
                    avatar: "$avatar",
                    followers: { $cond: { if: { $isArray: "$followers" }, then: { $size: "$followers" }, else: 0 } }
                }
            },
            { $sort: { followers: -1 } },
            { $skip: skipCount },
            { $limit: pageSize }
        ]
    }
    else if (query.list) {
        filter = [
            { $match: { gender: context.user.gender == 'male' ? 'female' : 'male' } },
            { $skip: skipCount },
            { $limit: pageSize }
        ]
    }
    else {
        throw new Error('At least one filter is required')
    }
    const users = await db.user.aggregate(filter)
    const blockedUsers = await db.block.find({ $or: [{ byUser: context.user.id }, { toUser: context.user.id }] })

    for (let index = 0; index < users.length; index++) {
        const user = users[index]
        for (let i = 0; i < blockedUsers.length; i++) {
            const blockedUser = blockedUsers[i];
            console.log(blockedUser.toUser.toString() == user._id.toString())
            if (blockedUser.toUser.toString() == user._id.toString()) {
                users[index].isBlocked = true
            } else {
                console.log(blockedUser.byUser.toString() == user._id.toString())
                if (blockedUser.byUser.toString() == user._id.toString()) {
                    users[index].isBlocked = true
                }

            }
        }

    }
    log.end()
    return users

};

const remove = async (id, context) => {
    const log = context.logger.start(`services:users:remove ${id}`);
    if (context.user.id !== id) {
        throw new Error("you don't have right to delete this account ")
    }
    const user = await db.user.deleteOne({ _id: id })
    if (user.deletedCount !== 1) {
        throw new Error('something went wrong please try again')
    }
    await db.history.deleteOne({ fromUser: id })
    await db.coinBalance.deleteOne({ user: id })
    log.end()
    return "account deleted successfully"
};


const removePicOrVideo = async (id, data, context) => {
    const log = context.logger.start(`services:users:removePicOrVideo `);
    if (context.user.id == data.userId) {
        throw new Error("you don't have right to delete operation ")
    }
    const user = await db.user.findById(id)
    if (data.type == 'image') {
        // const picDestination = path.join(__dirname, '../', 'assets/images')
        // const picLocation = picDestination + '/' + data.fileName
        // fs.unlinkSync(picLocation);
        const images = user.images.filter(obj => obj.name !== data.fileName)
        user.images = images
        await user.save()

    }
    else {
        // const videoDestination = path.join(__dirname, '../', 'assets/video')
        // const videoLocation = videoDestination + '/' + data.fileName
        // fs.unlinkSync(videoLocation);
        const videos = user.videos.filter(obj => obj.name !== data.fileName)
        user.videos = videos
        await user.save()
    }
    log.end()
    return user
};

const addBankDetail = async (id, model, context) => {
    const log = context.logger.start(`services: users: addBankDetail`);
    if (model.accountNo == "" && model.swiftCode == "") {
        throw new Error("account no and ifsc code is required")
    }
    let user = await db.user.findById(id)
    if (!user) {

        log.end();
        throw new Error("invalid user");
    }
    user.swiftCode = model.swiftCode;
    user.accountNo = model.accountNo;
    await user.save()
    log.end();
    return user
};

const makeThumb = (path, name, destination) => {
    return new Promise((resolve, reject) => {
        ffmpeg(path)
            .on('end', (data) => {
                console.log('screenshots were saved');
            })
            .on('error', (err) => {
                console.log('an error happened: ' + err.message);
                return resolve({
                    status: 'err',
                    data: err.message
                })
            })
            .takeScreenshots({ count: 1, filename: `thumb${name}.png`, timemarks: ['00:00:01.000'], size: '250x350' }, destination)
            .on('end', () => {
                console.log('FFmpeg done!')
                return resolve({
                    status: 'success',
                    data: `thumb${name}.png`
                })
            })
            .on('error', (err) => {
                console.log('an error happened: ' + err.message);
                return resolve({
                    status: 'err',
                    data: err.message
                })
            })


    })

}

// forgetPassword
const forgotPassword = async (model, context) => {
    const log = context.logger.start('services:users:forgotPassword')
    const user = await db.user.findOne({ email: { $eq: model.email } });
    if (!user) {
        throw new Error("The email address " + model.email + " is not associated with any account. Please check your email address and try again.");
    }
    const data = await buildOtp(user, context)
    if (!data) {
        throw new Error('something went wrong')
    }
    log.end()

    return data
}
const buildOtp = async (user, context) => {
    const log = context.logger.start('services:users:buildOtp')
    // four digit otp genration logic
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    let message = `hi ${user.firstName || user.username} Your 4 digit One Time Password: <br>${OTP}<br></br>
              otp valid only 4 minutes`
    let = subject = "One Time Password"
    const isEmailSent = await sendMail(user.email, message, subject)
    if (!isEmailSent) {
        throw new Error('something went wrong')
    }
    const otpToken = auth.getOtpToken(OTP, user.id, true, context)
    log.end()
    let data = {
        token: otpToken
    }
    log.end()
    return data
}

const otpVerify = async (model, token, context) => {
    const log = context.logger.start('services:users:otpVerify')
    const otpDetail = await auth.extractToken(token, context)
    if (otpDetail.otp.name === "TokenExpiredError") {
        throw new Error("otp expired");
    }
    if (otpDetail.otp.name === "JsonWebTokenError") {
        throw new Error("otp is invalid");
    }
    if (otpDetail.otp !== undefined && otpDetail.otp != model.otp) {
        throw new Error("please enter valid otp");;
    }
    log.end()
    return "otp verify successfully"
}

const sendMail = async (email, message, subject) => {
    var smtpTrans = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: `amber.app.xd@gmail.com`,
            pass: `amber#app@321`
        }
    });
    // email send to registered email
    var mailOptions = {
        from: 'Amber',
        to: email,
        subject: subject,
        html: message
    };
    let mailSent = await smtpTrans.sendMail(mailOptions)
    if (mailSent) {
        console.log("Message sent: %s", mailSent.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mailSent));
        return true
    } else {
        throw new Error("Unable to send email try after sometime");
    }
}


const changePassword = async (model, token, context) => {
    const log = context.logger.start('services:users:changePassword')
    const otpDetail = await auth.extractToken(token, context)
    if (otpDetail.otp.name === "TokenExpiredError") {
        throw new Error("session expired please try again");
    }
    if (otpDetail.otp.name === "TokenExpiredError") {
        throw new Error("session expired please try again");
    }
    if (otpDetail.otp == undefined || otpDetail.otp.name === "JsonWebTokenError") {
        throw new Error("token is invalid");
    }

    let user = context.user
    user = await db.user.findById(user.id);
    if (!user) {
        throw new Error("user not found");
    }
    const newPassword = encrypt.getHash(model.newPassword, context);
    user.password = newPassword;
    user.updatedOn = new Date();
    await user.save();
    log.end()
    return "password updated successfully"
}


exports.create = create;
exports.resetPassword = resetPassword;
exports.update = update;
exports.login = login;
exports.profile = profile;
exports.uploadProfilePic = uploadProfilePic;
exports.uploadPic = uploadPic;
exports.search = search;
exports.random = random;
exports.getUsers = getUsers;
exports.getCountries = getCountries;
exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;
exports.otpVerify = otpVerify;
exports.removeFollower = removeFollower;

// ============follow==============

exports.follow = follow;
exports.unfollow = unfollow;
exports.following = following;
exports.followers = followers;

// ============follow==============

exports.socialLogin = socialLogin
exports.removeProfilePic = removeProfilePic
exports.generateRtcToken = generateRtcToken
exports.uploadStory = uploadStory
exports.logout = logout
exports.usersByFilter = usersByFilter
exports.remove = remove
exports.removePicOrVideo = removePicOrVideo
exports.addBankDetail = addBankDetail

