/* eslint-disable no-unused-vars */
import connectDB from '../../src/backend/config/db.js';
import User from '../../src/backend/models/userModel.js';
import generateToken from '../../src/backend/utils/generateToken.js';
import bcrypt from 'bcryptjs'; // Need bcrypt here if hashing isn't solely in the model's pre-save hook

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password (Ensure pre-save hook in userModel handles this)
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isProUser: user.isProUser,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message || 'Server Error during registration' });
  }
}