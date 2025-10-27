import connectDB from '../../src/backend/config/db.js';
import Product from '../../src/backend/models/productModel.js';
import Click from '../../src/backend/models/clickModel.js';
import protect from '../../src/backend/middleware/authMiddleware.js';
import mongoose from 'mongoose';

const updateProduct = async (req, res) => {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  const { title, description, price, imageUrl, productUrl } = req.body;
  product.title = title || product.title;
  product.description = description ?? product.description; // Allow clearing description
  product.price = price ?? product.price;
  product.imageUrl = imageUrl || product.imageUrl;
  product.productUrl = productUrl || product.productUrl;

  try {
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
     console.error("Update Product Error:", error);
     res.status(400).json({ message: error.message || 'Error updating product' });
  }
};

const deleteProduct = async (req, res) => {
   const { id } = req.query;
   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

   const product = await Product.findById(id);
   if (!product) return res.status(404).json({ message: 'Product not found' });
   if (product.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

   try {
       await Product.deleteOne({ _id: id });
       res.status(200).json({ message: 'Product removed' });
   } catch (error) {
       console.error("Delete Product Error:", error);
       res.status(500).json({ message: error.message || 'Error deleting product' });
   }
};

// POST Logic for Tracking
const trackProduct = async (req, res) => {
    const { id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

    try {
        const product = await Product.findById(id);
        if (product) {
            product.clicks = (product.clicks || 0) + 1;
            await product.save();
            // Optionally create unified click event
            await Click.create({ linkId: product._id, userId: product.user });
            res.status(200).json({ message: 'Product click tracked' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Track Product Error:", error);
        res.status(500).json({ message: error.message || 'Error tracking product click' });
    }
};

// Main Handler
const productIdHandler = async (req, res) => {
    await connectDB();
    if (req.method === 'PUT') {
        // Protect PUT request
        return protect(updateProduct)(req, res);
    } else if (req.method === 'DELETE') {
        // Protect DELETE request
        return protect(deleteProduct)(req, res);
    } else if (req.method === 'POST') {
         // Tracking is PUBLIC, do not protect
        return trackProduct(req, res);
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE', 'POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default productIdHandler;