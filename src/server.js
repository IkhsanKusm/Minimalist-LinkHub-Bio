/* eslint-disable no-undef */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const linkRoutes = require('./routes/linkRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const productRoutes = require('./routes/productRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express application
const app = express();

// This is a middleware that allows app to accept JSON in the body of requests
app.use(cors());
app.use(express.json());

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Tell the app to use the userRoutes for any URL that starts with /api/users
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);

// Use the error handling middleware
app.use(notFound);
app.use(errorHandler);

// Get the port from environment variables or use 5001 as a default
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});