

"use strict";
const mongoose = require("mongoose");
const report = mongoose.Schema({
    text: { type: String, required: false, unique: true, trim: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,

    },
    reportBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,

    }
}, { timestamps: true });

mongoose.model("report", report);
module.exports = report;
