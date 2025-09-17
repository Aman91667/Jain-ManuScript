// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as needed

exports.adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });

        if (!user || user.role !== 'admin') {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized as an administrator.' });
    }
};