const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// This is a protected route for Pro users
router.route('/').get(protect, getAnalytics);

module.exports = router;