const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    userImg: {
      type: String,
      trim: true,
      default: " ",
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
      default: "",
      trim: true,
    },
    userStatus: {
      type: String,
      default: "away",
      trim: true,
      enum: ["active", "away", "donotdisturb"]
    },
    isActive: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("user", UserSchema);
module.exports = User;
