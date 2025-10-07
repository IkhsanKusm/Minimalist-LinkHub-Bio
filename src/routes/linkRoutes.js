const express = require('express');
const router = express.Router();
const { getLinks, createLink, updateLink, deleteLink} = require('../controllers/linkController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all these routes
router.route('/')
    .get(protect, getLinks)
    .post(protect, createLink);

router.route('/:id')
    .put(protect, updateLink)
    .delete(protect, deleteLink);

module.exports = router;