// src/middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as needed

const adminMiddleware = async (req, res, next) => {
    // 1. The general auth middleware should have already been run.
    //    It should have verified the token and attached the user to the request.
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    // 2. Check if the authenticated user has the 'admin' role.
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }

    // 3. If the user is an admin, proceed to the next middleware or route handler.
    next();
};

module.exports = adminMiddleware;