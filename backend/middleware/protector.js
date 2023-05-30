const express = require("express");
const jwt = require("jsonwebtoken");
const dataModel = require("../models/Model");

const asyncHandler = require("express-async-handler");

const protector = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.InventoryToken;

    if (!token) {
      return res.status(400).json("Invalid Session, Please login");
    }
    // token verify
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await dataModel.findById(verified.id);

    if (!user) {
      return res.status(401).json("user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json("Not authorized, please login");
    console.log(error.message);
  }
});

module.exports = protector;
