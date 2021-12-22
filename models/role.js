"use strict";
const mongoose = require("mongoose");
const role = mongoose.Schema({
    // permissions: {
    //     view: { type: Boolean, default: false },
    //     add: { type: Boolean, default: false },
    //     edit: { type: Boolean, default: false },
    //     delete: { type: Boolean, default: false },
    //     all: { type: Boolean, default: false }
    // },
    // permissions: [
    //     {
    //         permissionId: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'permission',
    //             required: true
    //         },
    //     },
    // ],
    name: { type: String, lowercase: true, trim: true },
    description: { type: String, lowercase: true, trim: true },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"]
    },
    roleType: {
        type: String, lowercase: true, trim: true,
        default: "client",
        enum: ["admin", "client", "superAdmin", "accountant"]
    },
    // roleType: { type: String, default: "Client", lowercase: true, trim: true, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
mongoose.model("role", role);
module.exports = role;