import connectDB from '../../../src/backend/config/db.js';
import Link from '../../../src/backend/models/linkModel.js';
import Click from '../../../src/backend/models/clickModel.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    await connectDB();
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    const { id } = req.query;

     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Link ID' });
    }

    try {
        const link = await Link.findById(id);
        if (link) {
            link.clicks = (link.clicks || 0) + 1;
            await link.save();
            await Click.create({ linkId: link._id, userId: link.user });
            res.status(200).json({ message: 'Click tracked' });
        } else {
            res.status(404).json({ message: 'Link not found' });
        }
    } catch (error) {
        console.error("Track Link Error:", error);
        res.status(500).json({ message: error.message || 'Error tracking click' });
    }
}