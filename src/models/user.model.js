import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
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
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    avatar: {
      type: String, //Cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //Cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Access short-Lived hote hai
userSchema.methods.generateAcessToken = function () {
  return jwt.sign(
    {
      _id: this._id, //Payload
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET, //Secret-key
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, //Options
    }
  );
};

//Long lived Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, //Payload
    },
    process.env.REFRESH_TOKEN_SECRET, //Secret-key
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, //Options
    }
  );
};

export const User = mongoose.model("User", userSchema);
