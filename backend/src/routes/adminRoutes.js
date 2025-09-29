const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

// Admin-only routes
router.get('/researcher/requests', protect, authorize('admin'), adminController.getResearcherRequests);
router.put('/researcher/approve/:userId', protect, authorize('admin'), adminController.approveResearcher);
router.put('/researcher/reject/:userId', protect, authorize('admin'), adminController.rejectResearcher);

module.exports = router;
