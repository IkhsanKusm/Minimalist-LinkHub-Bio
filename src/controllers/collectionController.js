const asyncHandler = require('express-async-handler');
const Collection = require('../models/collectionModel');
const Link = require('../models/linkModel');

// @desc    Get all collections for a user
const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ user: req.user._id }).sort({ order: 'asc' });
  res.json(collections);
});

// @desc    Create a new collection
const createCollection = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Title is required.');
  }
  const collection = new Collection({
    title,
    user: req.user._id,
  });

  const createdCollection = await collection.save();
  res.status(201).json(createdCollection);

  //const collection = await Collection.create({ title, user: req.user._id });
  //res.status(201).json(collection);
});

// @desc    Get logged in user's collections
// @route   GET /api/collections
// @access  Private
const getMyCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ user: req.user._id });
  res.json(collections);
});

// @desc    Delete a collection
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }

  if (collection.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Important: When a collection is deleted, collection must "un-assign" all links within it.
  await Link.updateMany({ collectionId: collection._id }, { $unset: { collectionId: "" } });
  await Collection.deleteOne({ _id: req.params.id });

  res.json({ message: 'Collection removed' });

  if (collection) {
    // Ensure the user owns the collection
    if (collection.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    // Uncategorize all links within this collection before deleting it
    await Link.updateMany(
      { collectionId: collection._id },
      { $set: { collectionId: null } }
    );

    await collection.deleteOne(); // Use deleteOne() on the document
    res.json({ message: 'Collection removed' });
  } else {
    res.status(404);
    throw new Error('Collection not found');
  }
});

module.exports = { getMyCollections, createCollection, deleteCollection };