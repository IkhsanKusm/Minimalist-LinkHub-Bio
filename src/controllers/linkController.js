const asyncHandler = require('express-async-handler');
const Link = require('../models/linkModel');

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
    const link = await Link.findById(req.params.id);

    if (!link) {
        res.status(404);
        throw new Error('Link not found');
    }

    // **SECURITY CHECK**: Make sure the link belongs to the logged-in user
    if (link.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to update this link');
    }

    link.title = req.body.title || link.title;
    link.url = req.body.url || link.url;
    link.type = req.body.type || link.type;

    const updatedLink = await link.save();
    res.json(updatedLink);
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
    link.clicks += 1;
    await link.save();
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
    trackLinkClick,
};