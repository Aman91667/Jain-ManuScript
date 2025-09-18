const express = require('express');
const router = express.Router();
const { submitHelpRequest, requestAccess } = require('../controllers/helpController');
const { protect } = require('../middlewares/authMiddleware'); // ✅ named import
const roleMiddleware = require('../middlewares/roleMiddleware');

// ---------------------
// Help routes
// ---------------------
router.post('/request-access', protect, roleMiddleware(['researcher']), requestAccess);
router.post('/request', protect, submitHelpRequest);

module.exports = router;
