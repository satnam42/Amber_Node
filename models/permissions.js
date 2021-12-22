"use strict";
const mongoose = require("mongoose");
const permission = mongoose.Schema({
    name: { type: String, lowercase: true, trim: true },
    description: { type: String, lowercase: true, trim: true },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"]
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
}
);

mongoose.model("permission", permission);
module.exports = permission;