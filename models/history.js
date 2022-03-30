"use strict";
const mongoose = require("mongoose");
const history = mongoose.Schema({

    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },

    type: {
        type: String,
        default: "",
        enum: ["", "video", "gift"],
    },
    duration: {
        type: String,
        default: "",
    },

    coin: {
        type: String,
        default: "",
    },

    dateTime: {
        type: Date,
        default: Date.now
    },



}, { timestamps: true });

mongoose.model("history", history);
module.exports = history;
