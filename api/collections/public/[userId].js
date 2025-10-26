import connectDB from '../../../../src/backend/config/db.js';
import Collection from '../../../../src/backend/models/collectionModel.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    await connectDB();
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
    const { userId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid User ID' });

    try {
        const collections = await Collection.find({ user: userId }).sort({ order: 'asc' }).select('title _id');
        res.status(200).json(collections);
    } catch (error) {
        console.error("Get Public Collections Error:", error);
        res.status(500).json({ message: error.message || 'Error fetching collections' });
    }
}