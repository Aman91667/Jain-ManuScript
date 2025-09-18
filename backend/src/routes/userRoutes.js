const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authController = require('../controllers/authController');
const { protect, adminMiddleware } = require('../middlewares/authMiddleware');

// --- Upload folder setup ---
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// --- Multer config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ---------------------
// Public routes
// ---------------------
router.post('/login', authController.login);
router.post('/signup/user', authController.signupNormal);
router.post('/signup/researcher', upload.single('idProofFile'), authController.signupResearcher);
router.post('/apply-for-researcher', protect, upload.single('idProofFile'), authController.applyForResearcherStatus);

// ---------------------
// User routes
// ---------------------
router.get('/me', protect, authController.getCurrentUser);

// ---------------------
// Admin routes
// ---------------------
router.get('/admin/researcher-applications', protect, adminMiddleware, authController.getPendingResearchers);
router.patch('/admin/approve/:researcherId', protect, adminMiddleware, authController.approveResearcher);
router.patch('/admin/reject/:researcherId', protect, adminMiddleware, authController.rejectResearcher);

module.exports = router;
