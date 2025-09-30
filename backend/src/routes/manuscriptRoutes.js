
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const manuscriptController = require('../controllers/manuscriptController');
const { upload } = require('../middlewares/uploadMiddleware');
const { uploadLimiter } = require('../middlewares/rateLimitMiddleware');
const { manuscriptValidation, mongoIdValidation } = require('../middlewares/validationMiddleware');

// Public manuscripts - anyone logged in can access
router.get('/public', protect, manuscriptController.getPublicManuscripts);

// Researcher manuscripts - only approved researchers
router.get('/researcher', protect, authorize('researcher'), manuscriptController.getResearcherManuscripts);

// Admin: all manuscripts
router.get('/admin', protect, authorize('admin'), manuscriptController.getAllManuscripts);

// Upload manuscript: Requires 'admin' role
router.post('/', protect, authorize('admin'), uploadLimiter, upload.array('files', 5), manuscriptValidation, manuscriptController.uploadManuscript);

// Update manuscript: Owner or admin
router.put('/:id', protect, mongoIdValidation, upload.array('files', 5), manuscriptController.updateManuscript);

// Delete manuscript: Owner or admin
router.delete('/:id', protect, mongoIdValidation, manuscriptController.deleteManuscript);

// Get manuscript by ID
router.get('/:id', protect, mongoIdValidation, manuscriptController.getManuscriptById);

module.exports = router;