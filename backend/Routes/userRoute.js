const express = require("express");
const { registerUser } = require("../controllers/userController");

const userRoute = express.Router();

userRoute.post("/signup", registerUser);






module.exports = userRoute