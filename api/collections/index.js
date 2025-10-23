import connectDB from '../../src/backend/config/db.js';
import Collection from '../../src/backend/models/collectionModel.js';
import protect from '../../src/backend/middleware/authMiddleware.js';

const getCollections = async (req, res) => {
  const collections = await Collection.find({ user: req.user._id }).sort({ order: 'asc' });
  res.status(200).json(collections);
};

const createCollection = async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title is required.' });
  }
  try {
    const collection = await Collection.create({ title: title.trim(), user: req.user._id });
    res.status(201).json(collection);
  } catch (error) {
    console.error("Create Collection Error:", error);
    res.status(400).json({ message: error.message || 'Error creating collection' });
  }
};

const handler = async (req, res) => {
  await connectDB();
  if (req.method === 'GET') {
    return getCollections(req, res);
  } else if (req.method === 'POST') {
    return createCollection(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default protect(handler);