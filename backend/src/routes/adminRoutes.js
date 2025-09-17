// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed
const { adminAuth } = require('../middlewares/auth.js'); // Adjust path as needed

// @route   GET /api/auth/admin/researcher-applications
// @desc    Get all pending researcher applications
// @access  Private (Admin)
router.get('/admin/researcher-applications', adminAuth, async (req, res) => {
    try {
        const applications = await User.find({
            role: 'researcher',
            isApproved: false
        }).select('-password'); // Exclude password from the response

        res.status(200).json({ applications });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// @route   PATCH /api/auth/admin/approve/:id
// @desc    Approve a researcher application
// @access  Private (Admin)
router.patch('/admin/approve/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.isApproved = true;
        await user.save();

        // Optional: Send an email notification to the user
        // You can add your email sending logic here

        res.status(200).json({ message: 'Researcher approved successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// @route   PATCH /api/auth/admin/reject/:id
// @desc    Reject a researcher application
// @access  Private (Admin)
router.patch('/admin/reject/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Reset the user's role and application status
        user.role = 'user';
        user.isApproved = false;
        user.phoneNumber = undefined;
        user.researchDescription = undefined;
        user.idProofUrl = undefined;
        await user.save();

        // Optional: Send an email notification to the user
        // You can add your email sending logic here

        res.status(200).json({ message: 'Researcher application rejected.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;