const express = require('express');
const router = express.Router();
const { getMyCollections, createCollection, deleteCollection } = require('../controllers/collectionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMyCollections).post(protect, createCollection);
router.route('/:id').delete(protect, deleteCollection);

module.exports = router;