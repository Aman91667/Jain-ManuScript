const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const authController = require('../controllers/authController');
const { protect, adminMiddleware } = require('../middlewares/authMiddleware');

// --- Multer configuration ---
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// --- Public Routes ---
router.post('/login', authController.login); // ✅ pass function
router.post('/signup/user', authController.signupNormal); // ✅ pass function
router.post('/signup/researcher', upload.single('idProofFile'), authController.signupResearcher); // ✅ pass function
router.post('/apply-for-researcher', protect, upload.single('idProofFile'), authController.applyForResearcherStatus); // ✅ pass function

// --- User Routes ---
router.get('/me', protect, authController.getCurrentUser); // ✅ pass function

// --- Admin Routes ---
router.get('/admin/researcher-applications', protect, adminMiddleware, authController.getPendingResearchers); // ✅ pass function
router.patch('/admin/approve/:researcherId', protect, adminMiddleware, authController.approveResearcher); // ✅ pass function
router.patch('/admin/reject/:researcherId', protect, adminMiddleware, authController.rejectResearcher); // ✅ pass function

module.exports = router;
