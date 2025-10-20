const asyncHandler = require('express-async-handler');
const Link = require('../models/linkModel');
const Click = require('../models/clickModel');

/**
 * @desc    Get all links for the logged-in user
 * @route   GET /api/links
 * @access  Private
 */
const getLinks = asyncHandler(async (req, res) => {
    // The 'protect' middleware gives req.user
    const links = await Link.find({ user: req.user._id });
    res.json(links);
});

/**
 * @desc    Create a new link
 * @route   POST /api/links
 * @access  Private
 */
const createLink = asyncHandler(async (req, res) => {
    const { title, url, type } = req.body;

    if (!title || !url) {
        res.status(400);
        throw new Error('Please add a title and URL');
    }

    if (!req.user || !req.user._id) {
        res.status(401);
        throw new Error('Not authorized, user ID not found in request');
    }

    const link = await Link.create({
        title,
        url,
        type: type || 'standard',
        user: req.user._id, // Associate the link with the logged-in user
    });
    res.status(201).json(link);
});

/**
 * @desc    Update a link
 * @route   PUT /api/links/:id
 * @access  Private
 */
const updateLink = asyncHandler(async (req, res) => {
    const { title, url, type, collectionId } = req.body;
    const link = await Link.findById(req.params.id);

    if (!link) {
        res.status(404);
        throw new Error('Link not found');
    }

    if (link) {
    if (link.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    link.title = title || link.title;
    link.url = url || link.url;
    link.type = type || link.type;

    // --- HANDLE COLLECTION ASSIGNMENT ---
    // If collectionId is provided (even as an empty string for 'Uncategorized')
    if (collectionId !== undefined) {
      // An empty string or null means collection are un-categorizing the link
      link.collectionId = collectionId === '' ? null : collectionId;
    }

    const updatedLink = await link.save();
    res.json(updatedLink);
  } else {
    res.status(404);
    throw new Error('Link not found');
  }
});

/**
 * @desc    Delete a link
 * @route   DELETE /api/links/:id
 * @access  Private
 */
const deleteLink = asyncHandler(async (req, res) => {
    const link = await Link.findById(req.params.id);

    if (!link) {
        res.status(404);
        throw new Error('Link not found');
    }

    // **SECURITY CHECK**: Make sure the link belongs to the logged-in user
    if (link.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to delete this link');
    }

    await link.deleteOne({ _id: req.params.id });
    res.json({ message: 'Link removed' });
});

/**
 * @desc    Track a click on a link
 * @route   POST /api/links/track/:id
 * @access  Public
 */
const trackLinkClick = asyncHandler(async (req, res) => {
  const link = await Link.findById(req.params.id);

  if (link) {
    // 1. Increment the total clicks on the link itself
    link.clicks += 1;
    await link.save();

    // 2. Create a new document in the clicks collection
    await Click.create({
      linkId: link._id,
      userId: link.user,
    });

    res.status(200).json({ message: 'Click tracked' });
  } else {
    res.status(404);
    throw new Error('Link not found');
  }
});

module.exports = {
    getLinks,
    createLink,
    updateLink,
    deleteLink,
    trackLinkClick
};