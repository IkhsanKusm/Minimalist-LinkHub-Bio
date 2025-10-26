/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';

const protect = (handler) => asyncHandler(async (req, res) => {
  await connectDB();
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user to request (important for subsequent logic)
      // Ensure db connection is established before this findById
      req.user = await User.findById(decoded.id).select('-password'); 

      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return; // Stop execution
      }
      
      // If authorized, call the original handler function
      return handler(req, res);

    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return; // Stop execution
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return; // Stop execution
  }
});

export default protect; // Use ES module export