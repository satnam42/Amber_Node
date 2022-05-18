const ObjectId = require("mongodb").ObjectId
const { defaultsDeep } = require("lodash");
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdTnU32YHXZlDkwE46vUnKOAC9J2Dw-HtLaCh_TqI3-Laaf0zsLvQSMrLN1pJCLpKzja33Ko7ytwEyTD',
    'client_secret': 'ELn2xxtQpQkBglXX14jU1przoWo2g7ypmxb2ihT2AVm4ylY1vQR481aqlvzyfcAVX5X19fclDrQA9PXQ'
});

var sender_batch_id = Math.random().toString(36).substring(9);


const create = async (model, context) => {
    const log = context.logger.start("services:redeem:create");
    // const user = await user.findById(model.userId)
    // let coinBalance = await db.coinBalance.findOne({ user: user.id })
    var create_payout_json = {
        "sender_batch_header": {
            "sender_batch_id": sender_batch_id,
            "email_subject": "You have a payment"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": model.amount,
                    "currency": "USD"
                },
                "receiver": model.email,
                "note": "Thank you.",
                "sender_item_id": "item_1"
            },

        ]
    };
    const result = await handleRedeem(create_payout_json)
    if (result) {
        // todo handle  response 
    }
    log.end()
    return result
};

const handleRedeem = (model) => {

    return new Promise((resolve, reject) => {
        paypal.payout.create(model, function (error, payout) {
            if (error) {
                reject(error)
                // console.log(error.response);
                // throw error;
            } else {
                resolve(payout);
                console.log("Create Payout Response");
                // console.log();
                // return payout
            }
        })

    })

}

const updateStatus = async (id, model, context) => {
    if (!context.user.isAdmin) {
        throw new Error("you are not authorized to perform this action")
    }
    if (!model.status) {
        throw new Error("status is required")
    }
    const log = context.logger.start(`services:redeem:updateStatus${id}`);
    let request = await db.redeem.findById(id)
    if (!request) {
        throw new Error('request not found')
    }
    request.status = model.status
    await request.save()
    log.end()
    return request
}


const request = async (model, context) => {
    const log = context.logger.start(`services:redeem:request${model}`);
    const coinBalance = await db.coinBalance.findOne({ user: model.userId })
    if (context.user.gender == 'male') {
        throw new Error("something went wrong")
    }
    if (context.user.accountNo && context.user.swiftCode && context.user.accountNo !== "" && context.user.swiftCode !== "") {
        if (coinBalance && coinBalance.activeCoin < 600) {
            throw new Error("you don't have enough diamond to redeem")
        }
        const redeem = await new db.redeem({
            user: model.userId,
            diamond: coinBalance.activeCoin,
        }).save()
        if (redeem) {
            coinBalance.activeCoin = 0
            await coinBalance.save()
        }
        else {
            throw new Error("something went wrong")
        }
        log.end()
        return 'request created successfully'
    } else {
        throw new Error("please update your bank detail first")
    }

}

const checkRequestStatus = async (id, context) => {
    const log = context.logger.start(`services:redeem:checkRequestStatus${id}`);
    if (!id) {
        throw new Error('request id is required')
    }
    let request = await db.redeem.findById(id)
    if (!request) {
        throw new Error('request not found')
    }
    log.end()
    return request
}

const allRequestList = async (context) => {
    const log = context.logger.start(`services:redeem:allRequestList`);
    let requests = await db.redeem.find()
    // if (!request) {
    //     throw new Error('request not found')
    // }
    log.end()
    return requests
}
const requestListByUserId = async (id, context) => {
    const log = context.logger.start(`services:redeem:allRequestList`);
    if (!id) {
        throw new Error('user id is required')
    }
    let requests = await db.redeem.find({ user: id })
    // if (!request) {
    //     throw new Error('request not found')
    // }
    log.end()
    return requests
}


exports.create = create;
exports.updateStatus = updateStatus;
exports.request = request;
exports.checkRequestStatus = checkRequestStatus;
exports.allRequestList = allRequestList;
exports.requestListByUserId = requestListByUserId;