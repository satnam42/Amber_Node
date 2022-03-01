"use strict";
const mongoose = require("mongoose");

const coin = mongoose.Schema({
    totalCoin: { type: Number, default: 0 },
    activeCoin: { type: Number, default: 0 },
    earnedCoins: [
        {
            _id: false,
            fromUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            coin: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now() },
        }],
    spendCoins: [
        {
            _id: false,
            onUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            coin: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now() },
        }],
    giftCoins: [
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

mongoose.model("coin", coin);
module.exports = coin;
