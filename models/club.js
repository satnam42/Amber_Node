"use strict";
const mongoose = require("mongoose");
const club = mongoose.Schema({
    name: {
        type: String,
        default: "",
        enum: ["", "follower", "following"],
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: false,
        }
    ]
},
    { timestamps: true }
);

mongoose.model("club", club);
module.exports = club;
