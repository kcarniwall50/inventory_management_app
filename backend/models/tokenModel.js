const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },

    token: {
      type: String,
      required: true,
    },

    craetedAt: {
      type: Date,
      default: Date.now(),
      expires: 3600, // one hour
    },
  },
  {
    timestamps: true,
  }
);

const tokenModel = mongoose.model("token", tokenSchema);
module.exports = tokenModel;
