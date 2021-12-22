"use strict";
const mongoose = require("mongoose");
const user = mongoose.Schema({
  username: { type: String, required: true, trim: true, lowercase: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: true, trim: true, unique: true },
  phoneNumber: { type: String, required: false, trim: true },
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
  token: { type: String, default: "" }, //access token
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
  avatar: { type: String, default: "" },
  // role: { type: mongoose.Schema.Types.ObjectId, ref: "role" },
  // roleType: {
  //   type: String,
  //   trim: true,
  //   required: false,
  //   enum: {
  //     values: ["admin", "user"],
  //     message: "You filled wrong role.",
  //   },
  // },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  bio: { type: String, default: "" },
  website: { type: String, default: "" },
  friends: [
    {
      friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
      },
      status: {
        type: String,
        default: "un-block",
        enum: {
          values: ["block", "un-block"],
          message: "Please enter block or un-block !",
        },
      },
    },
  ],
  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
    default: "",
  },
  deviceToken: { type: String, default: "" },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: "" },
});
user.index({ loc: "2dsphere" });
mongoose.model("user", user);
module.exports = user;
