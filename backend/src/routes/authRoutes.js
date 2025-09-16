// authRoutes.js - Handles all authentication-related endpoints.

const express = require('express');
const {
  login,
  signupNormal,
  signupResearcher,
  getCurrentUser, // ✅ Corrected: Make sure this is correctly imported
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/signup/user', signupNormal);
router.post('/signup/researcher', signupResearcher);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;