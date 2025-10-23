import connectDB from '../../../src/backend/config/db.js';
import User from '../../../src/backend/models/userModel.js';
import Link from '../../../src/backend/models/linkModel.js';
import Product from '../../../src/backend/models/productModel.js';
import Collection from '../../../src/backend/models/collectionModel.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();
  const { username } = req.query; // Get username from the dynamic route parameter

  try {
    const user = await User.findOne({ username }).select('-password -email'); // Exclude sensitive info

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch links, products, and collections in parallel
    const [links, products, collections] = await Promise.all([
      Link.find({ user: user._id }).sort({ order: 1 }),
      Product.find({ user: user._id }).sort({ order: 1 }),
      Collection.find({ user: user._id }).sort({ order: 1 }), // Fetch collections
    ]);

    res.status(200).json({
      profile: {
        _id: user._id, // Send ID for potential public collection fetching
        username: user.username,
        bio: user.bio,
        profilePhotoUrl: user.profilePhotoUrl,
        theme: user.theme,
      },
      links: links,
      products: products,
      collections: collections,
    });

  } catch (error) {
    console.error("Public Profile Error:", error);
    res.status(500).json({ message: error.message || 'Server Error fetching public profile' });
  }
}