"use strict";
const service = require("../services/users");
const admin = require("firebase-admin");
// let  deviceTokens = '3244d7ba6d7f941e'
const pushNotification = async (deviceToken, title, message) => {

    // const log = logger.start(`services:pushNotification`);

    let payload = {
        data: {  //you can send only notification or only data(or include both)
            type: "messaging",
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

    // data: {  //you can send only notification or only data(or include both)
    //     my_key: 'my value',
    //     my_another_key: 'my another value'
    // }

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
    let rtcRes = await service.generateRtcToken(modal, context)
    const user = await db.user.findById(body.receiverId)
    const callTo = await db.user.aggregate([
        {

            $match: {
                $and: [
                    { gender: { $in: [context.user.gender == 'male' ? 'female' : 'male'] } },
                    { _id: { $ne: [context.user.id] } },
                ]
                // $and: [   gender{ $eq: ["gender", context.user.gender == 'male' ? 'female' : 'male'] },
                // { $ne: ["_id", context.user.id] }]
            }

        },
        // { $match: { gender:  } }, 
        { $sample: { size: 1 } }
    ])
    console.log(callTo)
    if (!user) {
        throw new Error('called  user not found')
    }
    if (!user.deviceToken) {
        throw new Error('called  user  device Token not found')
    }

    // let payload = {
    //     data: {  //you can send only notification or only data(or include both)
    //         "channelName": body.channelName.toString(),
    //     },
    //     notification: {
    //         title: "call",
    //         body: body.username
    //     },

    // };
    // const options = {
    //     priority: "high",
    //     timeToLive: 60 * 60 * 24
    // };
    const registrationToken = user.deviceToken;

    // const message = {
    //     data: {
    //         score: '850',
    //         time: '2:45'
    //     },
    //     token: registrationToken
    // };

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
    // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)        
    //     notification: {
    //         title: "call",
    //         body: body.username
    //     },
    //     data: {  //you can send only notification or only data(or include both)            
    //         "channelName": body.channelName.toString()
    //     },
    //     to: user.deviceToken,

    // }
    const res = await admin.messaging().send(message)
    log.info(res)
    log.end()
    // .then(response => {
    //     console.log('message Successfully sent :', response);

    // }).catch(error => {
    //     console.log('Error sending message:', error);
    // });

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
    // .then(response => {
    //     console.log('message Successfully sent :', response);

    // }).catch(error => {
    //     console.log('Error sending message:', error);
    // });

}

exports.pushNotification = pushNotification
exports.sendCallNotification = sendCallNotification
exports.random = random