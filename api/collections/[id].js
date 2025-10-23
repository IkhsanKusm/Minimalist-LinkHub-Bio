import connectDB from '../../../src/backend/config/db.js';
import Collection from '../../../src/backend/models/collectionModel.js';
import Link from '../../../src/backend/models/linkModel.js';
import protect from '../../../src/backend/middleware/authMiddleware.js';
import mongoose from 'mongoose';

const deleteCollection = async (req, res) => {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

  const collection = await Collection.findById(id);
  if (!collection) return res.status(404).json({ message: 'Collection not found' });
  if (collection.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  try {
    // Un-assign links before deleting collection
    await Link.updateMany({ collectionId: id }, { $set: { collectionId: null } });
    await Collection.deleteOne({ _id: id });
    res.status(200).json({ message: 'Collection removed' });
  } catch (error) {
    console.error("Delete Collection Error:", error);
    res.status(500).json({ message: error.message || 'Error deleting collection' });
  }
};

const handler = async (req, res) => {
  await connectDB();
  if (req.method === 'DELETE') {
    return deleteCollection(req, res);
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default protect(handler);