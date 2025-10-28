import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Link',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  clickedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add an index for faster queries on user and time
clickSchema.index({ userId: 1, clickedAt: -1 });

const Click = mongoose.model('Click', clickSchema);
export default Click;