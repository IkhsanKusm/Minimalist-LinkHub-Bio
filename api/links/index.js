import connectDB from '../../src/backend/config/db.js';
import Link from '../../src/backend/models/linkModel.js';
import protect from '../../src/backend/middleware/authMiddleware.js';

// GET logic
const getLinks = async (req, res) => {
    const links = await Link.find({ user: req.user._id }).sort({ order: 'asc', createdAt: 'asc' });
    res.status(200).json(links);
};

// POST logic
const createLink = async (req, res) => {
    const { title, url, type, collectionId } = req.body;
    if (!title || !url) {
        return res.status(400).json({ message: 'Please add a title and URL' });
    }
    try {
        const link = await Link.create({
            title,
            url,
            type: type || 'standard',
            collectionId: collectionId || null, // Handle collectionId
            user: req.user._id,
        });
        res.status(201).json(link);
    } catch (error) {
        console.error("Create Link Error:", error);
        res.status(400).json({ message: error.message || 'Error creating link' });
    }
};

// Main handler
const linksHandler = async (req, res) => {
    await connectDB();
    if (req.method === 'GET') {
        return getLinks(req, res);
    } else if (req.method === 'POST') {
        return createLink(req, res);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default protect(linksHandler);