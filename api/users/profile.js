import connectDB from '../../src/backend/config/db.js';
import User from '../../src/backend/models/userModel.js';
import protect from '../../src/backend/middleware/authMiddleware.js';

// Define the core logic for GET
const getUserProfile = async (req, res) => {
  // protect middleware already attached req.user
  const user = await User.findById(req.user._id).select('-password'); // Re-fetch to be safe or use req.user
  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePhotoUrl: user.profilePhotoUrl,
      theme: user.theme,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Define the core logic for PUT
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.bio = req.body.bio ?? user.bio; // Use nullish coalescing
    user.profilePhotoUrl = req.body.profilePhotoUrl ?? user.profilePhotoUrl;
    user.username = req.body.username || user.username; // Keep || if empty string shouldn't overwrite
    user.theme = req.body.theme || user.theme;

    try {
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email, // Be careful not to allow email changes easily
        bio: updatedUser.bio,
        profilePhotoUrl: updatedUser.profilePhotoUrl,
        theme: updatedUser.theme,
      });
    } catch (error) {
       console.error("Profile Update Error:", error);
       // Handle potential validation errors (e.g., username already taken if changed)
       res.status(400).json({ message: error.message || 'Error updating profile' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Main handler that routes based on method, wrapped by protect
const profileHandler = async (req, res) => {
  await connectDB();

  if (req.method === 'GET') {
    return getUserProfile(req, res);
  } else if (req.method === 'PUT') {
    return updateUserProfile(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

// Export the protected handler
export default protect(profileHandler);