import connectDB from '../../../src/backend/config/db.js';
import Product from '../../../src/backend/models/productModel.js';
import Click from '../../../src/backend/models/clickModel.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    await connectDB();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
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
}