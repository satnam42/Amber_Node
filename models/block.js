"use strict";
const mongoose = require("mongoose");
const block = mongoose.Schema({
    byUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    to: {
        type: String,
        default: "",
        enum: ["", "follower", "following"],
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
}, { timestapms });

mongoose.model("block", block);
module.exports = block;
