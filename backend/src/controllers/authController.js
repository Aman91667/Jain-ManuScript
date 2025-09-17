// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // ✅ We'll use this model for everything

const path = require('path');
const fs = require('fs');

/**
 * Normal user signup
 */
exports.signupNormal = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // ✅ Storing all data on the User model
        user = new User({ name, email: normalizedEmail, password, role: 'user', isApproved: true });
        await user.save();

        const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ user, token, message: 'Account created successfully' });
    } catch (err) {
        console.error('[signupNormal] error', err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

/**
 * Combined logic for researcher signup and application
 */
exports.signupResearcher = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, researchDescription } = req.body;
        const idProofUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !email || !password || !phoneNumber || !researchDescription || !idProofUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email: normalizedEmail,
            password,
            role: 'researcher', // ✅ The role is 'researcher' from the start
            isApproved: false,
            phoneNumber, // ✅ All data is on the User model
            researchDescription,
            idProofUrl
        });
        await user.save();

        const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ user, token, message: 'Application submitted successfully. Awaiting admin approval.' });
    } catch (err) {
        console.error('[signupResearcher] error', err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const safeUser = { ...user.toObject() };
        delete safeUser.password;
        res.json({ user: safeUser, token, message: 'Logged in successfully' });
    } catch (err) {
        console.error('[login] error', err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { _id, name, email, role, isApproved } = req.user;
        res.json({ _id, name, email, role, isApproved });
    } catch (err) {
        console.error("[getCurrentUser] error", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.applyForResearcherStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
        }
        const userId = req.user.id; 

        const { phoneNumber, researchDescription } = req.body;
        const idProofUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!phoneNumber || !researchDescription || !idProofUrl) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // ✅ Storing application data on the existing user's document
        user.phoneNumber = phoneNumber;
        user.researchDescription = researchDescription;
        user.idProofUrl = idProofUrl;
        user.role = 'researcher'; // ✅ Set role to researcher
        user.isApproved = false; // ✅ Set approval to false
        await user.save();

        res.status(200).json({ message: 'Application submitted successfully. Awaiting admin approval.' });
    } catch (err) {
        console.error('[applyForResearcherStatus] error', err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

// ✅ REWRITTEN: Get pending applications from the User model directly
exports.getPendingResearchers = async (req, res) => {
    try {
        const applications = await User.find({
            role: 'researcher',
            isApproved: false
        }).select('-password');
        res.status(200).json({ applications });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error.' });
    }
};

// ✅ REWRITTEN: Approve a researcher by updating the User model
exports.approveResearcher = async (req, res) => {
    try {
        const { researcherId } = req.params;
        const user = await User.findById(researcherId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        
        user.isApproved = true;
        await user.save();

        res.json({ msg: 'Researcher approved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error. Failed to approve request.' }); 
    }
};

// ✅ REWRITTEN: Reject a researcher by resetting User model fields
exports.rejectResearcher = async (req, res) => {
    try {
        const { researcherId } = req.params;
        const user = await User.findById(researcherId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        user.isApproved = false; // Set this to false in case you want to use it
        user.role = 'user'; // Revert role back to 'user'
        user.phoneNumber = undefined; // Clear the application fields
        user.researchDescription = undefined;
        user.idProofUrl = undefined;
        await user.save();

        res.json({ msg: 'Researcher application rejected successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error. Failed to reject request.' });
    }
};