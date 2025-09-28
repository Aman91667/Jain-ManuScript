// adminRoutes.js (This code is correct)
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware'); 
const adminController = require('../controllers/adminController');

// ...

// Only logged-in Admins can access researcher requests
router.get('/researcher/requests', 
    protect, 
    authorize('admin'), 
    adminController.getResearcherRequests
);

// Only logged-in Admins can approve/reject researchers
router.put('/researcher/approve/:userId', 
    protect, 
    authorize('admin'), 
    adminController.approveResearcher
);

module.exports = router;