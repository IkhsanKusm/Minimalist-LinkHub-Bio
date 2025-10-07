// src/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize our Express application
const app = express();

// This is a middleware that allows our app to accept JSON in the body of requests
app.use(express.json());

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Get the port from environment variables or use 5001 as a default
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});