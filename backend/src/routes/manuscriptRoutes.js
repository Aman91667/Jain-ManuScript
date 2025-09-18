const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const manuscriptController = require('../controllers/manuscriptController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// --- Upload folder ---
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
// Public manuscripts
// ---------------------
router.get('/public', manuscriptController.getPublicManuscripts);
router.post('/public', protect, authorize('user', 'admin'), upload.single('files'), manuscriptController.uploadPublicManuscript);

// ---------------------
// Detailed manuscripts
// ---------------------
router.post('/detailed', protect, authorize('researcher', 'admin'), upload.array('files', 10), manuscriptController.uploadDetailedManuscript);

// ---------------------
// Featured & general
// ---------------------
router.get('/featured', manuscriptController.getFeaturedManuscripts);
router.get('/', protect, manuscriptController.getAllManuscripts);
router.get('/:id', protect, manuscriptController.getManuscriptById);

module.exports = router;
