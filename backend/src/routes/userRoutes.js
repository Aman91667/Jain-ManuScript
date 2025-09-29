const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Profile routes
router.get('/me', protect, userController.getProfile);
router.put('/me', protect, userController.updateProfile);

// Manuscripts
router.get('/my-manuscripts', protect, userController.getMyManuscripts);

// Reapply for researcher role
router.post('/researcher/reapply', protect, userController.reapplyResearcher);

module.exports = router;
