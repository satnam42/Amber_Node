"use strict";
const mongoose = require("mongoose");

const payment = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    gift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gift",
    },
    pi: { type: String, default: "", },
    amount: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "",
    },
    receiptUrl: {
        type: String,
        default: "",
    },
    receiptNumber: {
        type: String,
        default: "",
    },
    customerId: {
        type: String,
        default: "",
    },


}, { timestamps: true });

mongoose.model("payment", payment);
module.exports = payment;
