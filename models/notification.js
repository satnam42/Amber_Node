"use strict";
const mongoose = require("mongoose");
const notification = mongoose.Schema({
    content: { type: String, required: true, trim: true, },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
mongoose.model("notification", notification);
module.exports = notification;