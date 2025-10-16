const asyncHandler = require('express-async-handler');
const Click = require('../models/clickModel');
const Link = require('../models/linkModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

/**
 * @desc    Get analytics data for a user
 * @route   GET /api/analytics
 * @access  Private
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const period = req.query.period || '30d';
  const userId = req.user._id;

  let startDate;
  const now = new Date();

  if (period === '7d') {
    startDate = new Date(now.setDate(now.getDate() - 7));
  } else if (period === '90d') {
    startDate = new Date(now.setDate(now.getDate() - 90));
  } else {
    startDate = new Date(now.setDate(now.getDate() - 30));
  }

  // 1. Aggregate clicks by date for the chart
  const clicksByDate = await Click.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), clickedAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 2. Aggregate top performing links
  const topLinks = await Click.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), clickedAt: { $gte: startDate } } },
    { $group: { _id: '$linkId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'links',
        localField: '_id',
        foreignField: '_id',
        as: 'linkDetails',
      },
    },
    { $unwind: '$linkDetails' },
    { $project: { title: '$linkDetails.title', url: '$linkDetails.url', count: 1 } }
  ]);

  // 3. Aggregate top performing products
  const topProducts = await Product.find({ user: userId })
    .sort({ clicks: -1 }) // Sort by the 'clicks' field on the product model
    .limit(5)
    .select('title productUrl clicks');

  // 4. Get total clicks for the period
  const totalClicks = await Click.countDocuments({ userId, clickedAt: { $gte: startDate } });
  const totalLinks = await Link.countDocuments({ user: userId });

  res.json({
    totalClicks,
    totalLinks,
    clicksByDate,
    topLinks,
    topProducts,
  });
});

module.exports = { getAnalytics };