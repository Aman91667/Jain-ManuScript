const express = require('express');
const router = express.Router();
const multer = require('multer'); // <--- NEW: Import Multer here
const { v4: uuidv4 } = require('uuid'); // <--- NEW: Import uuid
const path = require('path'); // <--- NEW: Import path
const fs = require('fs'); // <--- NEW: Import fs

const { protect, authorize } = require('../middlewares/authMiddleware');
const manuscriptController = require('../controllers/manuscriptController');

// -----------------------------------------------------------------
// MULTER SETUP (Moved from missing uploadMiddleware.js)
// -----------------------------------------------------------------

const uploadDir = path.join(process.cwd(), 'uploads');
// Ensure the 'uploads' directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, uuidv4() + '-' + file.originalname),
});
const upload = multer({ storage });

// -----------------------------------------------------------------
// MANUSCRIPT ROUTES
// -----------------------------------------------------------------

// Public manuscripts - anyone logged in can access
router.get('/public', protect, manuscriptController.getPublicManuscripts);

// Researcher manuscripts - only approved researchers
router.get('/researcher', protect, manuscriptController.getResearcherManuscripts);

// Admin: all manuscripts
router.get('/admin', protect, authorize('admin'), manuscriptController.getAllManuscripts);

// --- CRUD ROUTES WITH AUTHORIZATION ---

// Upload manuscript: Now REQUIRES 'admin' role
router.post('/', protect, authorize('admin'), upload.array('files', 5), manuscriptController.uploadManuscript);

// Update manuscript: Requires 'admin' OR the owner to be logged in (check is in controller)
router.put('/:id', protect, upload.array('files', 5), manuscriptController.updateManuscript);

// Delete manuscript: Requires 'admin' OR the owner to be logged in (check is in controller)
router.delete('/:id', protect, manuscriptController.deleteManuscript);

// Get manuscript by ID - restricted access for researcher-only manuscripts
router.get('/:id', protect, manuscriptController.getManuscriptById);

module.exports = router;