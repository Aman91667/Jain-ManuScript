const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const manuscriptRoutes = require('./manuscriptRoutes');
const userRoutes = require('./userRoutes');
const helpRoutes = require('./helpRoutes');

// Mount all specific routers under this main API router
router.use('/auth', authRoutes);
router.use('/manuscripts', manuscriptRoutes);
router.use('/users', userRoutes);
router.use('/help', helpRoutes);

module.exports = router;