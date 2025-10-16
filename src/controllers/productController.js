const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

/**
 * @desc    Get all products for the logged-in user
 * @route   GET /api/products
 * @access  Private
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id }).sort({ order: 'asc' });
  res.json(products);
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, imageUrl, productUrl } = req.body;

  if (!title || !price || !imageUrl || !productUrl) {
    res.status(400);
    throw new Error('Title, price, image URL, and product URL are required.');
  }

  const product = await Product.create({
    title,
    description,
    price,
    imageUrl,
    productUrl,
    user: req.user._id,
  });

  res.status(201).json(product);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  product.title = req.body.title || product.title;
  product.description = req.body.description || product.description;
  product.price = req.body.price || product.price;
  product.imageUrl = req.body.imageUrl || product.imageUrl;
  product.productUrl = req.body.productUrl || product.productUrl;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await Product.deleteOne({ _id: req.params.id });
  res.json({ message: 'Product removed' });
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};