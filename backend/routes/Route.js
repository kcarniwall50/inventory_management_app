const express = require("express");
const router = express.Router();
const protector = require("../middleware/protector");

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  loginStatus,
  getUser,
  updateUser,
  changePassword,
} = require("../controllers/userController");

// Register user
router.post("/user/register", register);

// Login user
router.post("/user/login", login);

// Logout user
router.get("/user/logout", logout);

// Forgot Password
router.post("/user/forgotPassword", forgotPassword);

// Reset Password
router.put("/user/resetPassword/:resetToken", resetPassword);

// Get Login Status
router.get("/user/isLoggedIn", loginStatus);

// Get User
router.get("/user/getUser", protector, getUser);

// update user
router.patch("/user/updateUser", protector, updateUser);

// change password
router.patch("/user/changePassword", protector, changePassword);

module.exports = router;
