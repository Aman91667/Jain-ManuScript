const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');
const { 
  signupValidation,  researcherSignupValidation } = require('../middlewares/validationMiddleware');// Auth routes
router.post('/login', authLimiter, authController.login);
router.post('/signup/user', authLimiter, signupValidation, authController.signupNormal);
router.post('/signup/researcher', authLimiter, researcherSignupValidation, upload.single('idProofFile'), authController.signupResearcher);
router.get('/me', protect, authController.getCurrentUser);
router.post('/apply-for-researcher', protect, upload.single('idProofFile'), authController.applyForResearcherStatus);module.exports = router; 