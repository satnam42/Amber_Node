

"use strict";
const mongoose = require("mongoose");
const user = mongoose.Schema({
  username: { type: String, required: false, trim: true, lowercase: true, unique: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false, trim: true },
  phoneNo: { type: String, required: false, trim: true },
  dob: { type: Date, required: false, trim: true },

  gender: {
    type: String,
    required: true,
    enum: {
      values: ["male", "female"],
      messages: "Please enter value Male or female",
    },
  },

  password: { type: String, required: false },

  country: { type: String, required: false },

  socialLinkId: { type: String, required: false, default: "" },

  platform: { type: String, required: false, default: "" },

  otp: { type: Number, required: false, trim: true, default: "" },

  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
  avatar: { type: String, default: "" },

  bio: { type: String, default: "" },

  website: { type: String, default: "" },

  following: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
      },
      status: {
        type: String,
        default: "un-block",
        enum: {
          values: ["un-block", "block"],
          message: "Please enter block or un-block !",
        },
      },
      blockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "block",
        required: false,
      },
    },
  ],

  followers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    status: {
      type: String,
      default: "un-block",
      enum: {
        values: ["un-block", "blocked"],
        message: "Please enter block or un-block !",
      },
    },
    blockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "block",
      required: false,
    },

  },],

  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
    default: "",
  },
  deviceToken: { type: String, default: "" }
}, { timestamps: true });

user.index({ location: "2dsphere" });
mongoose.model("user", user);
module.exports = user;
