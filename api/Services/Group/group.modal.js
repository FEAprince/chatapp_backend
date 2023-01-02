const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GroupSchema = new Schema(
  {
    groupName: {
      type: String,
      trim: true
    },
    groupAdmin: {
      type: mongoose.Types.ObjectId,
      required: true,
      trim: true,
      ref: "user",
    },
    groupUser: [
      {
        _id: false,
        userId: {
          type: mongoose.Types.ObjectId,
          required: true,
          trim: true,
          ref: "user",
        },
      }
    ],
    groupImg: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);
const Group = mongoose.model("group", GroupSchema);
module.exports = Group;
