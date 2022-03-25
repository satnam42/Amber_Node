"use strict";
const mongoose = require("mongoose");

const coin = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        // required: true
    },
    totalCoin: { type: Number, default: 0 },
    activeCoin: { type: Number, default: 0 },

    earnedCoins: [
        {
            _id: false,
            fromUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            type: {
                type: String,
                default: "gifted",
                enum: ["call", "gifted"],
            },
            durations: { type: String, },
            coin: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now() },
        }],

    spendCoins: [
        {
            _id: false,
            onUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            coin: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now() },
        }],

    purchasedCoins: [
        {
            _id: false,
            gift: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "gift",
                required: true,
            },
            coin: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now() },
        }],

}, { timestamps: true });
//todo need to build pre funcation to setup total cooin  and active coin
// coin.pre('save', () => console.log('Hello from pre save'));
// coin.post('save', function (error, doc, next) {
//     if (error.name === 'MongoServerError' && error.code === 11000) {
//         next(new Error('There was a duplicate key error'));
//     } else {
//         next();
//     }
// });
mongoose.model("coin", coin);

module.exports = coin;
