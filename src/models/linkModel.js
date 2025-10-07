const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  // This creates a reference to a User document.
  // It's how we know which user owns this link.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  // As per the revised design, this field will handle different link types.
  type: {
    type: String,
    enum: ['Standard', 'Video Embed', 'Image Embed'],
    default: 'Standard',
  },
  // You also mentioned drag-and-drop reordering. We'll add an order index for that.
  orderIndex: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;