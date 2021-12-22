"use strict";
const mongoose = require("mongoose");
const image = mongoose.Schema({
    // baseurl_local: { type: String, default: "http://localhost:8009/Startup_API/assets/images/" },
    // baseurl_live: { type: String, default: "http://93.188.167.68/projects/Startup_API/assets/images/" },
    // "url": "http://93.188.167.68/projects/Startup_API/assets/images",
    image: { type: String },
    gallery: [{
        image: { type: String },
        type: { type: String, default: "" }
    }],
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'imageFor'
    },
    imageFor: {
        type: String,
        required: true,
        enum: ['user', 'blog'] //model reference 
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});
mongoose.model("image", image);
module.exports = image;