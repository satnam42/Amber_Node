const ObjectId = require("mongodb").ObjectId
const stripe = require('stripe')('sk_test_51KfdqKSIbgCXqMm2fnVDKcAd1LV0rVXZ9QiRvd0bm5JQYIeQXbF26NgYQA7RqiuSF3hUotbvt4FNPlsuI6OQgrPz00bCL9VA9k');
const endpointSecret = 'whsec_Q2i0yFexQBvHn5QSLsldY4ZFMRBY2MYK';

const buildCoin = async (model, context) => {
    const { coins, price, status, isFree, category } = model;
    const log = context.logger.start(`services:coins:buildCoin${model}`);
    const coin = await new db.coin({
        coins: coins,
        price: price,
        status: status,
        isFree: isFree,
        category: category,
    }).save();

    log.end();
    return coin;
};

const create = async (model, context) => {
    const log = context.logger.start("services:coins:create");
    let coin = await db.coin.findOne({ coins: model.title, price: model.price });
    if (coin) {
        throw new Error(`${model.title} already exits choose different value!`);
    } else {
        coin = buildCoin(model, context);
        log.end();
        return coin;
    }
};


const getCoinList = async (query, context) => {
    const log = context.logger.start(`services:coins:getCoinList`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // const userId = context.coin.id || context.coin._id
    const coins = await db.coin.find().skip(skipCount).limit(pageSize)
    coins.count = await db.coin.find().count();
    log.end()
    return coins
};


const buy = async (model, context) => {
    const log = context.logger.start(`services: coins: buy`);
    if (!model.userId) {
        throw new Error('user id is Required')
    }
    if (!model.coinId) {
        throw new Error('coinId id is Required')
    }
    if (!model.paymentMethod) {
        throw new Error('paymentMethod  is Required')
    }

    const user = await db.user.findById(model.userId)
    if (!user) {
        throw new Error('user not found')
    }

    const coin = await db.coin.findById(model.coinId)
    if (!coin) {
        throw new Error('this id not associate any coin')
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
        amount: coin.coins,
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
        coin: coin.id,
        pi: paymentIntent.id,
        status: paymentIntent.status,
        customerId: customer.id,
        amount: coin.price
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
    const log = context.logger.start(`services: coins: handlePaymentMethod ${{ model }}`);
    let payment = await db.payment.findOne({ pi: model.id })
    if (model.status == 'succeeded') {
        let coinHistory = await db.coinHistory.findOne({ user: payment.userId })
        let coin = await db.coin.findOne({ user: payment.coinId })
        // if  user have coin update it 
        if (coinHistory != undefined && coinHistory != null) {
            let totalCoin = coinHistory.totalCoin
            let activeCoin = coinHistory.activeCoin
            totalCoin += coin.coins
            activeCoin += coin.coins
            coinHistory.totalCoin = totalCoin
            coinHistory.activeCoin = activeCoin
            if (coinHistory.purchasedCoins && coinHistory.purchasedCoins.length > 0) {
                coinHistory.purchasedCoins.push({
                    coinId: coin.id,
                    coins: coin.coins,
                })
            }
            else {
                coinHistory.purchasedCoins = [{
                    coinId: coin.id,
                    coins: coin.coins,
                }]
            }
            await coinHistory.save()

        }
        else {
            // if  user have  no coin then create it 
            coinHistory = await new db.coinHistory({
                user: model.userId,
                totalCoin: coin.coins,
                activeCoin: coin.coins,
                purchasedCoins: [
                    {
                        coinId: coin.id,
                        coins: coin.coins,
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


const checkPaymentStatus = async (model, context) => {
    const log = context.logger.start(`services: coins: credit ${model}`);
    const { type, data: { object } } = model;
    // const sig = request.headers['stripe-signature'];
    // let event;
    // event = stripe.webhooks.constructEvent(request.body, endpointSecret);
    // Handle the event
    switch (type) {
        case 'payment_intent.succeeded':
            // console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
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
const myCoins = async (id, context) => {
    const log = context.logger.start(`services: coins: myCoins`);
    if (!id) {
        throw new Error('user id is Required')
    }
    let coins = await db.coinHistory.findOne({ user: id })
    // .populate("giftedCoins.gift").populate("giftedCoins.fromUser")
    log.end();
    return coins
};

exports.create = create;
exports.getCoinList = getCoinList;
exports.buy = buy;
exports.checkPaymentStatus = checkPaymentStatus;
exports.myCoins = myCoins;


