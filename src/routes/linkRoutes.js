const express = require('express');
const router = express.Router();
const { getLinks, createLink, updateLink, deleteLink, trackLinkClick,} = require('../controllers/linkController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes
router.route('/')
    .get(protect, getLinks)
    .post(protect, createLink);

router.route('/:id')
    .put(protect, updateLink)
    .delete(protect, deleteLink);

// This is a public route, so it does NOT use the 'protect' middleware
router.post('/track/:id', trackLinkClick);

module.exports = router;