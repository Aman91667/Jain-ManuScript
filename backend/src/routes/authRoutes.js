// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Import the auth and admin middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Use a single import for the entire controller object
const authController = require('../controllers/authController');

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// --- Public Routes ---
router.post('/login', authController.login);
router.post('/signup/user', authController.signupNormal);
router.post('/signup/researcher', upload.single('idProofFile'), authController.signupResearcher);
router.post(
  '/apply-for-researcher',
  authMiddleware,
  upload.single('idProofFile'),
  authController.applyForResearcherStatus
);

// --- User Routes ---
router.get('/me', authMiddleware, authController.getCurrentUser);

// --- Admin Routes ---
router.get(
  '/admin/researcher-applications',
  authMiddleware,
  adminMiddleware,
  authController.getPendingResearchers
);

// NEW ROUTES: To handle researcher approval and rejection
router.patch('/admin/approve/:researcherId', authMiddleware, adminMiddleware, authController.approveResearcher);
router.patch('/admin/reject/:researcherId', authMiddleware, adminMiddleware, authController.rejectResearcher);


module.exports = router;