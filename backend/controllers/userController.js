const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  
  const { name, email, password } = req.body;
  console.log(req.body)

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Details");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    // pic,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      // pic: newUser.pic,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});

module.exports = {registerUser};