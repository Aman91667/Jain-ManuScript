// userRoutes.js - Handles admin-level user management endpoints.

const express = require('express');
const { 
  getPendingResearchers, 
  approveResearcher, 
  rejectResearcher, 
  createUser, 
  applyForResearcherStatus 
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route to get all pending researcher applications
router.get('/pending', authMiddleware, roleMiddleware(['admin']), getPendingResearchers);

// Routes for approving and rejecting researcher applications
router.patch('/approve/:id', authMiddleware, roleMiddleware(['admin']), approveResearcher);
router.patch('/reject/:id', authMiddleware, roleMiddleware(['admin']), rejectResearcher);

// Route for an admin to create a new user directly
router.post('/add', authMiddleware, roleMiddleware(['admin']), createUser);

// Route for an authenticated user to apply for researcher status
router.post('/apply-researcher', authMiddleware, applyForResearcherStatus);

module.exports = router;