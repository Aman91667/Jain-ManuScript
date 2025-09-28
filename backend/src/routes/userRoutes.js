const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.get('/me', protect, userController.getProfile);
router.put('/me', protect, userController.updateProfile);
router.get('/my-manuscripts', protect, userController.getMyManuscripts);

module.exports = router;
