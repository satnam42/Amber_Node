"use strict";
const mongoose = require("mongoose");
const history = mongoose.Schema({

    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    callType: {
        type: String,
        default: "incoming",
        enum: ["missed", "outgoing", "incoming"],
    },
    duration: {
        type: String,
        default: "",
    },

    time: {
        type: String,
        default: ""
    },
}, { timestamps: true });

mongoose.model("history", history);
module.exports = history;
