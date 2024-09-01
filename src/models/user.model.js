import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    merchantDetails: {
      merchant_code: { type: String },
      pan: { type: String },
      secret: { type: String },
      username: { type: String },
      password: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.pre("save", async function (next) {
  const user = this;

  // Encrypt password if it is modified
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  // Check if any merchant detail has been modified and encrypt them
  // if (user.isModified('merchantDetails.merchant_code') ||
  //     user.isModified('merchantDetails.pan') ||
  //     user.isModified('merchantDetails.secret') ||
  //     user.isModified('merchantDetails.username') ||
  //     user.isModified('merchantDetails.password')) {
  //     if (user.isModified("merchantDetails")){

  //     // Encrypt each of the fields using bcrypt
  //     if (user.isModified('merchantDetails.merchant_code')) {
  //         user.merchantDetails.merchant_code = await bcrypt.hash(user.merchantDetails.merchant_code, 10);
  //     }

  //     if (user.isModified('merchantDetails.pan')) {
  //         user.merchantDetails.pan = await bcrypt.hash(user.merchantDetails.pan, 10);
  //     }

  //     if (user.isModified('merchantDetails.secret')) {
  //         user.merchantDetails.secret = await bcrypt.hash(user.merchantDetails.secret, 10);
  //     }

  //     if (user.isModified('merchantDetails.username')) {
  //         user.merchantDetails.username = await bcrypt.hash(user.merchantDetails.username, 10);
  //     }

  //     if (user.isModified('merchantDetails.password')) {
  //         user.merchantDetails.password = await bcrypt.hash(user.merchantDetails.password, 10);
  //     }
  // }

  next();
});

export const User = mongoose.model("User", userSchema);
