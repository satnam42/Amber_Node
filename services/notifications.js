const admin = require("firebase-admin");
// let  deviceTokens = '3244d7ba6d7f941e'
const pushNotification = async (deviceToken, title, message) => {

    // const log = logger.start(`services:pushNotification`);

    let payload = {
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
    const user = await db.user.findById(body.receiverId)
    if (!user) {
        throw new Error('called  user not found')
    }
    if (!user.deviceToken) {
        throw new Error('called  user  device Token not found')
    }

    let payload = {
        notification: {
            title: body.username,
            body: body.username
        },
        data: JSON.stringify({ channelName: body.channelName })

    };
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    let res = await admin.messaging().sendToDevice(user.deviceToken, payload, options)
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