import connectDB from '../../src/backend/config/db.js';
import Product from '../../src/backend/models/productModel.js';
import protect from '../../src/backend/middleware/authMiddleware.js';

const getProducts = async (req, res) => {
  const products = await Product.find({ user: req.user._id }).sort({ order: 'asc' });
  res.status(200).json(products);
};

const createProduct = async (req, res) => {
  const { title, description, price, imageUrl, productUrl } = req.body;
  if (!title || price == null || !imageUrl || !productUrl) { // Check price specifically
    return res.status(400).json({ message: 'Title, price, image URL, and product URL are required.' });
  }
  try {
    const product = await Product.create({
      title, description, price, imageUrl, productUrl,
      user: req.user._id,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(400).json({ message: error.message || 'Error creating product' });
  }
};

const handler = async (req, res) => {
  await connectDB();
  if (req.method === 'GET') {
    return getProducts(req, res);
  } else if (req.method === 'POST') {
    return createProduct(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default protect(handler);