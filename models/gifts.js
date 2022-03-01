"use strict";
const mongoose = require("mongoose");

const gift = mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    coin: {
        type: Date,
        default: Number, default: 0
    },
    description: { type: String, default: "" }
}, { timestamps: true });

mongoose.model("gift", gift);
module.exports = gift;
