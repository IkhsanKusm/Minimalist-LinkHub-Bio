const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Stores the email in lowercase
  },
  password: {
    type: String,
    required: true,
  },
  profilePhotoUrl: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  isProUser: {
    type: Boolean,
    default: false, // All new users start as free users
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;