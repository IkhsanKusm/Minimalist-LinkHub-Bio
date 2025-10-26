import connectDB from '../../src/backend/config/db.js';
import Click from '../../src/backend/models/clickModel.js';
import Link from '../../src/backend/models/linkModel.js';
import Product from '../../src/backend/models/productModel.js';
import protect from '../../src/backend/middleware/authMiddleware.js';
import mongoose from 'mongoose';

const getAnalytics = async (req, res) => {
    const period = req.query.period || '30d';
    const userId = req.user._id;

    let startDate;
    const now = new Date();
    // Calculate startDate based on period ('7d', '30d', '90d')
    if (period === '7d') startDate = new Date(new Date().setDate(now.getDate() - 7));
    else if (period === '90d') startDate = new Date(new Date().setDate(now.getDate() - 90));
    else startDate = new Date(new Date().setDate(now.getDate() - 30));

    try {
        // Aggregate clicks by date
        const clicksByDate = await Click.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), clickedAt: { $gte: startDate } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        // Aggregate top links (using Click collection)
        const topLinks = await Click.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), clickedAt: { $gte: startDate } } },
            { $group: { _id: '$linkId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'links', localField: '_id', foreignField: '_id', as: 'linkDetails' } },
             // Add a check in case the link was deleted after clicks were recorded
            { $match: { linkDetails: { $ne: [] } } },
            { $unwind: '$linkDetails' },
            { $project: { title: '$linkDetails.title', url: '$linkDetails.url', count: 1, _id: 0 } }
        ]);

        // Get top products (using Product collection's clicks field)
        const topProducts = await Product.find({ user: userId })
            .sort({ clicks: -1 })
            .limit(5)
            .select('title productUrl clicks');

        // Get totals
        const totalClicks = await Click.countDocuments({ userId, clickedAt: { $gte: startDate } });
        const totalLinks = await Link.countDocuments({ user: userId }); // Total links ever created

        res.status(200).json({
            totalClicks,
            totalLinks,
            clicksByDate,
            topLinks,
            topProducts,
        });
    } catch (error) {
        console.error("Get Analytics Error:", error);
        res.status(500).json({ message: error.message || 'Error fetching analytics' });
    }
};

const handler = async (req, res) => {
    await connectDB();
    if (req.method === 'GET') {
        return getAnalytics(req, res);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default protect(handler);