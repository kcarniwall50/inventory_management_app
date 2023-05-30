const dataModel = require("../models/Model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const tokenModel = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Checking if user exists
  const IsUserExist = await dataModel.findOne(
    { email: email },
    { password: 0 }
  );

  if (IsUserExist) {
    return res.status(401).json("Already Registered");
  }

  // Creating new user and saving on Database

  const newUser = await dataModel.create({
    name,
    email,
    password,
  });

  // creating token for new user
  const token = generateToken(newUser._id);

  res.cookie("InventoryToken", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (newUser) {
    const { _id, name, email, photo, phone, bio } = newUser;

    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400).json("Invalid user data");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // checking if user exists
  const UserExist = await dataModel.findOne({ email: email });
  if (!UserExist) {
    return res.status(400).json("Not Registered");
  }

  // checking if password is correct
  const IsPasswordCorrect = await bcrypt.compare(password, UserExist.password);
  let token = "";
  if (IsPasswordCorrect) {
    // generating token
    token = generateToken(UserExist._id);
    // sending HTTP-Only cookie

    res.cookie("InventoryToken", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
  }

  if (UserExist && IsPasswordCorrect) {
    const { _id, name, email, photo, phone, bio } = UserExist;

    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    return res.status(400).send("Email or Password not correct");
  }
};

const logout = async (req, res) => {
  res.cookie("InventoryToken", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
};

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // checking if user is registered
  const user = await dataModel.findOne({ email });
  if (!user) {
    return res.status(400).json("User is not registered");
  }

  // checking if token exists
  const token = await tokenModel.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // creating reset token
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  // hashed reset token
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // save in token model
  await new tokenModel({
    userId: user._id,
    token: hashedResetToken,
    createdAt: Date.now(),
  }).save();

  // constructing reset url
  const resetURL = `${process.env.Frontend_URL}/resetPassword/${resetToken}`;

  const subject = "Password Reset Request";
  const sent_from = process.env.Email_User;
  const send_to = user.email;
  const message = `
<h2>Hello, ${user.name}</h2>
<p>You have requested for reset password</p>
<p>   Below reset password link is valid only for 60 minutes </p>
<br/>
<a href=${resetURL} backtracking=off>${resetURL}</a>
<br/>
<p>regards...</p>
<p>Inventroy Team</p>
`;
  // send email
  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent " });
  } catch (error) {
    res.status(500).json({ message: "Email not sent, Please try again" });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // find in tokenModel
  const userToken = await tokenModel.findOne({
    token: hashedToken,
  });
  if (!userToken) {
    res.status(400).json("Invalid or expired token");
  }

  // Find user and saving new password in Model(user)
  const user = await dataModel.findOne({ _id: userToken?.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password reset successfully, Please login",
  });
});

const loginStatus = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (verified) {
    return res.json(true);
  } else {
    return res.json(false);
  }
};

const getUser = async (req, res) => {
  const user = await dataModel.findById(req.user._id);
  if (user) {
    const { _id, name, email, phone, bio, photo } = user;
    res.json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
};

const updateUser = async (req, res) => {
  const user = await dataModel.findById(req.user._id);
  if (user) {
    // const {name, phone, photo, bio}= user
    if (req.body.photo) {
      user.photo = req.body.photo;
    } else {
      user.photo = user.photo;
    }

    user.name = req.body.name;
    user.phone = req.body.phone;
    user.bio = req.body.bio;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      photo: updatedUser.photo,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404).json("User not found");
  }
};

const changePassword = async (req, res) => {
  const user = await dataModel.findById(req.user._id);
  if (!user) {
    return res.status(400).json("User not Found, please signup");
  }

  const { oldPassword, password } = req.body;

  //Validate
  if (!oldPassword || !password) {
    res.status(400).json("Please add old and new password");
  }

  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.send("Password change successful");
  } else {
    res.status(400).json("Old password did not match");
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  loginStatus,
  getUser,
  updateUser,
  changePassword,
};
