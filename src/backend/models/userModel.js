import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  theme: {
    type: String,
    default: 'default',
  },
  isProUser: {
    type: Boolean,
    default: false, // All new users start as free users
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Method to the userSchema to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }

  // Generate a "salt" to add random bits to the hash
  const salt = await bcrypt.genSalt(10);
  // Re-assign the user's password to the new hashed password
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;