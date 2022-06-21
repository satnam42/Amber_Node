"use strict";
const mongoose = require("mongoose");

const redeem = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    // amount: {
    //     type: String,
    //     default: "",
    // },
    // senderBatchId: {
    //     type: String,
    //     default: "",
    // },
    diamond: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "noSet",
        enum: ["manual", "paypal", "noSet"],
    },

    status: {
        type: String,
        default: "requested",
        enum: ["requested", "in-process", "rejected", "completed"],
    },
    receiptNo: {
        type: String,
        default: "",
    },
    // payoutId: {
    //     type: String,
    //     default: ''
    // }

}, { timestamps: true });

mongoose.model("redeem", redeem);
module.exports = redeem;
