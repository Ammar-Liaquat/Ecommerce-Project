const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required:true
    },
    otp: {
      type: String,
    },
    role: {
      type:String,
      required:true,
      enum:["admin","user"]
    },
    otpExpiry: Number,
    isVerify: {
      type: Boolean,
      default: false,
    },
    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
