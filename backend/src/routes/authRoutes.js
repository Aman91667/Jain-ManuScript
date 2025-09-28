const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Multer setup
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, uuidv4() + '-' + file.originalname),
});
const upload = multer({ storage });

// Auth routes
router.post('/login', authController.login);
router.post('/signup/user', authController.signupNormal);
router.post('/signup/researcher', upload.single('idProofFile'), authController.signupResearcher);
router.get('/me', protect, authController.getCurrentUser);
router.post('/apply-for-researcher', protect, upload.single('idProofFile'), authController.applyForResearcherStatus);

module.exports = router;
