// backend/routes/accessRoutes.js

const express = require('express');
const router = express.Router();
// Import mongoose to access its built-in utility methods
const mongoose = require('mongoose'); 

// Assuming you have an AccessRequest model and an authMiddleware
const AccessRequest = require('../models/AccessRequest'); 
const authMiddleware = require('../middlewares/authMiddleware');

// Route to handle manuscript access requests
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { manuscriptId } = req.body;
        const userId = req.user.id; 

        // 1. Proactive Input Validation: 
        // Before attempting a Mongoose query, validate that the manuscriptId 
        // from the request body is a correctly formatted ObjectId string.
        // The CastError occurs because Mongoose is given an invalid string value
        // that cannot be converted to the expected ObjectId type.[1]
        if (!mongoose.Types.ObjectId.isValid(manuscriptId)) {
            // If the ID is invalid, send a 400 Bad Request response and
            // stop the execution immediately to prevent the error from happening.[1]
            return res.status(400).json({ message: 'Invalid manuscript ID format.' });
        }

        // 2. Database Operation:
        // Only proceed with the findOne query if the ID is valid.
        // Mongoose will now receive a correctly formatted string for casting.
        const existingRequest = await AccessRequest.findOne({ userId, manuscriptId });
        if (existingRequest) {
            return res.status(409).json({ message: 'Access request already submitted for this manuscript.' });
        }

        // 3. Document Creation and Saving:
        // Create a new access request document with the validated IDs.
        const newRequest = new AccessRequest({
            userId,
            manuscriptId,
            status: 'pending' // Initial status
        });

        await newRequest.save();

        res.status(201).json({ 
            message: 'Access request submitted successfully.', 
            request: newRequest 
        });
    } catch (error) {
        // As a general fallback, handle potential CastErrors or other
        // unexpected errors gracefully.[1]
        if (error instanceof mongoose.CastError) {
             return res.status(400).json({ message: 'Invalid ID format.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error. Failed to submit request.' });
    }
});

module.exports = router;