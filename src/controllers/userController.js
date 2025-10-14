const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Link = require('../models/linkModel');
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
  // Note: Password hashing will be done in the user model
  const user = await User.create({
    username,
    email,
    password, // Plain password
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

/**
  * @desc    Get user profile
  * @route   GET /api/users/profile
  * @access  Private
  */
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is available from 'protect' middleware
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    bio: req.user.bio,
    profilePhotoUrl: req.user.profilePhotoUrl,
  };
  res.json(user);
});

/**
  * @desc    Update user profile
  * @route   PUT /api/users/profile
  * @access  Private
  */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.bio = req.body.bio || user.bio;
    user.profilePhotoUrl = req.body.profilePhotoUrl || user.profilePhotoUrl;
    user.username = req.body.username || user.username;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePhotoUrl: updatedUser.profilePhotoUrl,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get a user's public profile and links
 * @route   GET /api/users/public-profile/:username
 * @access  Public
 */
const getPublicProfile = asyncHandler(async (req, res) => {
  // Find the user by username
  const user = await User.findOne({ username: req.params.username }).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Find all links associated with that user
  const links = await Link.find({ user: user._id }).sort({ order: 1 }); // We'll use 'order' later

  res.json({
    profile: {
      _id: user._id,
      username: user.username,
      bio: user.bio,
      profilePhotoUrl: user.profilePhotoUrl,
      // We can add theme data here later
    },
    links: links,
  });
});

module.exports = { registerUser, authUser, getUserProfile, updateUserProfile, getPublicProfile };