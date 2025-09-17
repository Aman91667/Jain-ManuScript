const express = require('express');
const router = express.Router();
const {
  getPendingResearchers,
  approveResearcher,
  rejectResearcher
} = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Only admins should access these
router.get(
  '/pending',
  authMiddleware,
  roleMiddleware(['admin']),
  getPendingResearchers
);

router.patch(
  '/approve/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  approveResearcher
);

router.patch(
  '/reject/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  rejectResearcher
);

module.exports = router;
