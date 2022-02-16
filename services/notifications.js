const admin = require("firebase-admin");
// let  deviceTokens = '3244d7ba6d7f941e'
const pushNotification = async (deviceToken, title, body, model) => {

    // const log = logger.start(`services:pushNotification`);

    let payload = {
        notification: {
            title: title || 'hi',
            body: body || 'demo',
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

exports.pushNotification = pushNotification