// src/controllers/userController.js

const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  // 1. Get user data from the request body
  const { username, email, password } = req.body;

  // 2. Check if the user already exists by email
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User already exists');
  }

  // 3. Create the new user in the database
  // Note: Password hashing will be done in the user model (next step)
  const user = await User.create({
    username,
    email,
    password, // We're passing the plain password for now
  });

  // 4. If user was created successfully, send back user data and a token
  if (user) {
    res.status(201).json({ // 201 Created
      _id: user._id,
      username: user.username,
      email: user.email,
      isProUser: user.isProUser,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and if password matches
  // We'll create the matchPassword method in the next step
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isProUser: user.isProUser,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

module.exports = { registerUser, authUser };