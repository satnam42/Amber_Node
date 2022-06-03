"use strict";
const mongoose = require("mongoose");
const feedback = mongoose.Schema({
    msg: {
        type: String,
        default: "",
    },
    name: {
        type: String,
        default: "",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
},
    { timestamps: true }
);

mongoose.model("feedback", feedback);
module.exports = feedback;
