const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  trackProductClick,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// All product management routes are protected
router.route('/').get(protect, getProducts).post(protect, createProduct);
router.route('/:id').put(protect, updateProduct).delete(protect, deleteProduct);

// Public route for tracking clicks
router.post('/track/:id', trackProductClick);

module.exports = router;