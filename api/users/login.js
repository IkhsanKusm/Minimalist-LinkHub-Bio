import connectDB from '../../src/backend/config/db.js';
import User from '../../src/backend/models/userModel.js';
import generateToken from '../../src/backend/utils/generateToken.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    // Use the matchPassword method from the userModel
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isProUser: user.isProUser,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message || 'Server Error during login' });
  }
}