"use strict";
const mongoose = require("mongoose");
const usernotification = mongoose.Schema({
    // content: { type: String, required: true, trim: true, },
    notification: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notification',
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true 
    },
    status: {
        type: String,
        default: "sent",
        enum: ["sent", "read","cleared"]
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
mongoose.model("usernotification", usernotification);
module.exports = usernotification;