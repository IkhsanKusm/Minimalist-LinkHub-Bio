const asyncHandler = require('express-async-handler');
const Link = require('../models/linkModel');

/**
 * @desc    Get all links for the logged-in user
 * @route   GET /api/links
 * @access  Private
 */
const getLinks = asyncHandler(async (req, res) => {
    // The 'protect' middleware gives us req.user
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

    const link = await Link.create({
        title,
        url,
        type, // This can be 'Standard', 'Video Embed', etc
        user: req.user._id, // Associate the link with the logged-in user
    });

    const createdLink = await link.save();
    res.status(201).json(createdLink);
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

module.exports = {
    getLinks,
    createLink,
    updateLink,
    deleteLink,
};