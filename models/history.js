"use strict";
const mongoose = require("mongoose");
const history = mongoose.Schema({
    byUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    type: {
        type: String,
        default: "",
        enum: ["", "video", "voice"],
    },
    duration: {
        type: String,
        default: "",
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
}, { timestamps: true });

mongoose.model("history", history);
module.exports = history;
