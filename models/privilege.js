"use strict";
const mongoose = require("mongoose");
const privilege = mongoose.Schema(
    {
        nav: [{
            name: { type: String, required: true, trim: true, },
            path: { type: String, required: false, trim: true, },
        }, { _id: false }],
        permissions: {
            read: { type: Boolean, default: false },
            write: { type: Boolean, default: false },
            publish: { type: Boolean, default: false }
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
    },
    { timestamps: true }
);

mongoose.model("privilege", privilege);
module.exports = privilege;