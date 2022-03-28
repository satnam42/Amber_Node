"use strict";
const mongoose = require("mongoose");

const coin = mongoose.Schema({
    coins: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    category: { type: Number, default: 0 },

}, { timestamps: true });

mongoose.model("coin", coin);

module.exports = coin;
s