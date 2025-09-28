const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const manuscriptRoutes = require('./manuscriptRoutes');
const userRoutes = require('./userRoutes');
const helpRoutes = require('./helpRoutes');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/manuscripts', manuscriptRoutes);
router.use('/users', userRoutes);
router.use('/help', helpRoutes);

module.exports = router;
