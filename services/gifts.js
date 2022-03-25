const ObjectId = require("mongodb").ObjectId
const stripe = require('stripe')('sk_test_51KfdqKSIbgCXqMm2fnVDKcAd1LV0rVXZ9QiRvd0bm5JQYIeQXbF26NgYQA7RqiuSF3hUotbvt4FNPlsuI6OQgrPz00bCL9VA9k');
const endpointSecret = 'whsec_qZYloeQTjG5bOmE1iE31H76UD6Ll7vQY';
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
        // const message = await new db.coin({
        //     totalCoin: 1000
        // user: user.id,
        // giftedCoins: [{
        //     gift: giftId,
        //     fromUser: data.msgFrom,
        //     coin: data.giftedCoin
        // }],
        // }).save()
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
    console.log('model ==>>>>', id, model);
    const gift = await setGift(model, entity, context);
    console.log('updated data', gift);
    log.end();
    return gift
};

const send = async (model, context) => {

    const log = context.logger.start(`services: gifts: send`);

    let gift = await db.gift.findById(model.giftId)

    if (!gift) {
        throw new Error('provider gift not found')
    }

    // checking user have coin to gift to  user
    let coin = await db.coin.findOne({ user: model.senderId })

    if (coin && coin.activeCoin >= gift.coin) {
        let coin = db.coin.findOne({ user: model.receiverId })
        // if  user have coin update it 
        if (coin) {
            coin.totalCoin += gift.coin
            coin.activeCoin += gift.coin
            coin.giftedCoins.push({
                gift: gift.id,
                fromUser: model.senderId,
                coin: gift.coin
            })

        }
        else {
            // if  user have  no coin then create it 
            const coin = await new db.coin({
                user: model.receiverId,
                totalCoin: gift.coin,
                activeCoin: gift.coin,
                giftedCoins: [
                    {
                        gift: gift.id,
                        fromUser: model.senderId,
                        coin: gift.coin
                    }],
            }).save()
        }
        await coin.save()
    } else {
        throw new Error("you don't have enough coin to send this gift")
    }
    coin.activeCoin -= gift.coin
    coin.spendCoins.push({
        onUser: model.receiverId,
        coin: gift.coin
    })
    await coin.save()
}

// const gift = await setGift(model, entity, context);

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

const myGifts = async (id, model, context) => {
    const log = context.logger.start(`services: gifts: myGifts`);
    if (!id) {
        throw new Error('user id is Required')
    }
    let myGifts = await db.coin.findOne({ user: id }).populate("giftedCoins.gift").populate("giftedCoins.fromUser")
    log.end();
    return myGifts
};

const buy = async (model, context) => {
    const log = context.logger.start(`services: gifts: buy`);
    if (!model.userId) {
        throw new Error('user id is Required')
    }
    if (!model.giftId) {
        throw new Error('giftId id is Required')
    }
    if (!model.paymentMethod) {
        throw new Error('paymentMethod  is Required')
    }

    const user = await db.user.findById(model.userId)
    if (!user) {
        throw new Error('user not found')
    }

    const gift = await db.gift.findById(model.giftId)
    if (!gift) {
        throw new Error('this id not associate any gift')
    }

    const customer = await stripe.customers.create({
        name: user.firstName || "",
        // temp adding  address to handle indian rule
        address: {
            line1: '510 Townsend St',
            postal_code: '98140',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
        }
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2020-08-27' }
    );
    const paymentIntent = await stripe.paymentIntents.create({

        amount: gift.coin,
        description: 'social services',
        // temp adding  address to handle indian rule
        shipping: {
            name: 'Jenny Rosen',
            address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'US',
            },
        },
        currency: 'inr',
        customer: customer.id,
        payment_method_types: [model.paymentMethod],
    });

    const payment = await new db.payment({
        user: user.id,
        gift: gift.id,
        pi: paymentIntent.id,
        status: paymentIntent.status,
        customerId: customer.id,
        amount: gift.coin
    }).save()

    log.end();
    return {
        paymentIntent: paymentIntent.client_secret,
        status: paymentIntent.status,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'sk_test_51KfdqKSIbgCXqMm2fnVDKcAd1LV0rVXZ9QiRvd0bm5JQYIeQXbF26NgYQA7RqiuSF3hUotbvt4FNPlsuI6OQgrPz00bCL9VA9k'
    }
};

const handlePaymentMethod = async (model, context) => {
    const log = context.logger.start(`services: gifts: handlePaymentMethod ${{ model }}`);
    let payment = await db.payment.findOne({ pi: model.id })

    if (model.status == 'succeeded') {
        let coin = await db.coin.findOne({ user: payment.userId })
        let gift = await db.gift.findOne({ user: payment.giftId })
        // if  user have coin update it 
        if (coin != undefined && coin != null) {
            coin.totalCoin += gift.coin
            coin.activeCoin += gift.coin
            if (coin.purchasedCoins && coin.purchasedCoins.length > 0) {
                coin.purchasedCoins.push({
                    gift: gift.id,
                    coin: gift.coin,
                })
            }
            else {
                coin.purchasedCoins = [{
                    gift: gift.id,
                    coin: gift.coin,
                }]
            }
            await coin.save()

        }
        else {
            // if  user have  no coin then create it 
            coin = await new db.coin({
                user: model.userId,
                totalCoin: gift.coin,
                activeCoin: gift.coin,
                purchasedCoins: [
                    {
                        gift: gift.id,
                        coin: gift.coin,
                    }],
            }).save()
        }
        payment.status = model.status
        payment.receiptNumber = model.receipt_number
        payment.receiptUrl = model.receipt_url
        await payment.save()
    } else {
        log.info('model.status', model.status)
        payment.status = model.status || ''
        await payment.save()
    }
    return
}


const credit = async (model, context) => {
    const log = context.logger.start(`services: gifts: credit ${model}`);
    const { type, data: { object } } = model;
    // const sig = request.headers['stripe-signature'];
    // let event;
    // event = stripe.webhooks.constructEvent(request.body, endpointSecret);

    // Handle the event
    switch (type) {
        case 'payment_intent.succeeded':
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.amount_capturable_updated':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.canceled':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.created':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.payment_failed':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.processing':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.requires_action':
            handlePaymentMethod(object, context);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${type}.`);
    }
    log.end();
    return object

};

exports.create = create;
exports.update = update;
exports.getGifts = getGifts;
exports.send = send;
exports.uploadIcon = uploadIcon;
exports.myGifts = myGifts;
exports.buy = buy;
exports.credit = credit;


