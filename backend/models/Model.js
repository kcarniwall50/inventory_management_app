const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter   Email Id"],
      unique: true,
      trim: true, // remove space
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ],
    },

    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [6, "Password must be atleast 6 characters long"],
      maxLength: [100, "Password must not be more than 100 characters long"],
    },

    photo: {
      type: String,
      required: [true, "Please add photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },

    phone: {
      type: String,
      default: "+91",
    },

    bio: {
      type: String,
      default: "+91",
    },
  },
  {
    timestamps: true,
  }
);

//  Encrpting password before saving in Database
schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const dataModel = mongoose.model("user", schema);
module.exports = dataModel;
