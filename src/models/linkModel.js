const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
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
  clicks: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['standard', 'video', 'image', 'product'],
    default: 'standard',
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null,
    required: false, // Links can exist without a collection
  },
  // Drag-and-drop reordering. Adding an order index.
  order: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;