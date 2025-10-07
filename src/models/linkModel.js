const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  // This creates a reference to a User document.
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
  // Drag-and-drop reordering. Adding an order index.
  orderIndex: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;