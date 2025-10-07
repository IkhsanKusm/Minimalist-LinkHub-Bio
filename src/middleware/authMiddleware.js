const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for the token in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
        // Extract the token from the header (it's in the format "Bearer TOKEN")
        token = req.headers.authorization.split(' ')[1];

        // Verify the token using our secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the ID that was in the token
        // Attach the user object to the request, but exclude the password
        req.user = await User.findById(decoded.id).select('-password');

        // Continue to the next middleware or the route handler
        next();
        } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };