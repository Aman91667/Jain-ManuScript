const express = require('express');
const { submitHelpRequest, requestAccess } = require('../controllers/helpController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/request-access', authMiddleware, roleMiddleware(['researcher']), requestAccess);
router.post('/request', authMiddleware, submitHelpRequest);

module.exports = router;