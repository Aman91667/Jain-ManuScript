const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const AccessRequest = require('../models/AccessRequest'); 
const { protect } = require('../middlewares/authMiddleware'); // ✅ Use protect middleware

// --- Submit a manuscript access request ---
router.post('/', protect, async (req, res) => {
    try {
        const { manuscriptId } = req.body;
        const userId = req.user.id; 

        // Validate manuscript ID
        if (!mongoose.Types.ObjectId.isValid(manuscriptId)) {
            return res.status(400).json({ message: 'Invalid manuscript ID format.' });
        }

        // Check if a request already exists
        const existingRequest = await AccessRequest.findOne({ userId, manuscriptId });
        if (existingRequest) {
            return res.status(409).json({ message: 'Access request already submitted for this manuscript.' });
        }

        // Create new access request
        const newRequest = new AccessRequest({
            userId,
            manuscriptId,
            status: 'pending'
        });

        await newRequest.save();

        res.status(201).json({ 
            message: 'Access request submitted successfully.', 
            request: newRequest 
        });
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }
        console.error('[accessRoutes POST /] Error:', error);
        res.status(500).json({ message: 'Server error. Failed to submit request.' });
    }
});

module.exports = router;
