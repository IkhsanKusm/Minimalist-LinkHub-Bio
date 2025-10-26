import connectDB from '../../src/backend/config/db.js';
import Link from '../../src/backend/models/linkModel.js';
import protect from '../../src/backend/middleware/authMiddleware.js';
import mongoose from 'mongoose';

// PUT Logic
const updateLink = async (req, res) => {
    const { id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Link ID' });
    }

    const link = await Link.findById(id);
    if (!link) {
        return res.status(404).json({ message: 'Link not found' });
    }
    if (link.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const { title, url, type, collectionId } = req.body;
    link.title = title || link.title;
    link.url = url || link.url;
    link.type = type || link.type;
    if (collectionId !== undefined) {
      link.collectionId = collectionId === '' ? null : collectionId;
    }

    try {
        const updatedLink = await link.save();
        res.status(200).json(updatedLink);
    } catch (error) {
        console.error("Update Link Error:", error);
        res.status(400).json({ message: error.message || 'Error updating link' });
    }
};

// DELETE Logic
const deleteLink = async (req, res) => {
    const { id } = req.query;
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Link ID' });
    }

    const link = await Link.findById(id);
    if (!link) {
        return res.status(404).json({ message: 'Link not found' });
    }
    if (link.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    try {
        await Link.deleteOne({ _id: id });
        res.status(200).json({ message: 'Link removed' });
    } catch (error) {
        console.error("Delete Link Error:", error);
        res.status(500).json({ message: error.message || 'Error deleting link' });
    }
};

// Main Handler
const linkIdHandler = async (req, res) => {
    await connectDB();
    if (req.method === 'PUT') {
        return updateLink(req, res);
    } else if (req.method === 'DELETE') {
        return deleteLink(req, res);
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default protect(linkIdHandler);