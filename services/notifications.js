"use strict";
const service = require("../services/users");
const admin = require("firebase-admin");
const utility = require("../utility/index")

const pushNotification = async (deviceToken, title, type, message) => {
    let payload = {
        data: {  //you can send only notification or only data(or include both)
            type: type,
            "channelName": "",
            "name": "",
            "imageUrl": "",
        },
        notification: {
            title: title,
            body: message,
            sound: "default"
        }
    };

    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    admin.messaging().sendToDevice(deviceToken, payload, options).then(response => {
        console.log('message Successfully sent :', response);
    }).catch(error => {
        console.log('Error sending message:', error);
    });

}

const sendCallNotification = async (body, context) => {
    const log = context.logger.start(`services:callNotification`);
    let modal = {}
    modal.channelId = body.channelName
    modal.isPublisher = false
    if (body.receiverId == context.user.id) {
        throw new Error('you cannot call to  yourself')
    }

    let rtcRes = await service.generateRtcToken(modal, context)

    const user = await db.user.findById(body.receiverId)
    if (!user) {
        throw new Error('called  user not found')
    }
    if (!user.deviceToken) {
        throw new Error('called  user  device Token not found')
    }
    utility.verifyFCMToken(user.deviceToken)
    const registrationToken = user.deviceToken;
    const message = {
        data: {  //you can send only notification or only data(or include both)
            type: "callReceive",
            callType: 'simple',
            "channelName": body.channelName.toString(),
            "name": body.username,
            "imageUrl": body.imageUrl,
            token: rtcRes.token,
            userId: rtcRes.userId.toString()

        },
        notification: {
            title: "call",
            body: body.username
        },
        token: registrationToken
    };
    const res = await admin.messaging().send(message)
    log.info(res)
    log.end()


}

const random = async (modal, context) => {
    const log = context.logger.start(`services:notifications:random`);
    // let caller = {}
    // caller.channelId = context.user.id
    // caller.isPublisher = true
    // caller.username = context.user.username
    // const callerRtc = await service.generateRtcToken(caller, context)
    // caller.userId = callerRtc.userId.toString()
    // caller.token = callerRtc.token
    if (!modal.channelId || modal.channelId == "") {
        throw new Error('channelId is required')
    }
    const randomUser = await db.user.aggregate([
        {
            $match: {
                $and: [
                    { gender: { $in: [context.user.gender == 'male' ? 'female' : 'male'] } },
                    { _id: { $ne: [context.user.id] } },
                ]
            }
        },
        { $sample: { size: 1 } }
    ])
    if (randomUser.length == 0) {
        throw new Error('something went wrong')
    }
    let receiver = {}
    receiver.deviceToken = randomUser[0].deviceToken
    if (!receiver.deviceToken) {
        throw new Error('called  user  device Token not found')
    }
    const registrationToken = receiver.deviceToken;
    utility.verifyFCMToken(receiver.deviceToken)
    receiver.channelId = modal.channelId
    receiver.isPublisher = false
    const receiverRtc = await service.generateRtcToken(receiver, context)
    const message = {
        data: {  //you can send only notification or only data(or include both)
            type: "callReceive",
            callType: 'random',
            "channelName": receiver.channelId.toString(),
            "name": context.user.username,
            // "imageUrl": caller.imageUrl,
            token: receiverRtc.token,
            userId: receiverRtc.userId.toString()

        },
        notification: {
            title: "call",
            body: context.user.username
        },
        token: registrationToken
    };
    const res = await admin.messaging().send(message)
    log.info(res)
    log.end()
}

exports.pushNotification = pushNotification
exports.sendCallNotification = sendCallNotification
exports.random = random