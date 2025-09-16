// backend/src/routes/manuscriptRoutes.js
const express = require('express');
const {
  getAllManuscripts,
  getManuscriptById,
  getFeaturedManuscripts,
  uploadPublicManuscript, // NEW
  uploadDetailedManuscript, // NEW
} = require('../controllers/manuscriptController');
const { addAnnotation, getManuscriptAnnotations } = require('../controllers/annotationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/featured', getFeaturedManuscripts);
router.get('/', getAllManuscripts);
router.get('/:id', getManuscriptById);

// New upload routes
router.post('/upload/public', authMiddleware, roleMiddleware(['admin']), uploadPublicManuscript);
router.post('/upload/detailed', authMiddleware, roleMiddleware(['admin']), uploadDetailedManuscript);

// Annotations are protected
router.get('/:id/annotations', authMiddleware, getManuscriptAnnotations);
router.post('/:id/annotations', authMiddleware, roleMiddleware(['researcher', 'admin']), addAnnotation);

module.exports = router;