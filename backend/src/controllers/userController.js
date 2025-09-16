// userController.js - Handles admin-level user management tasks and researcher applications.

const User = require('../models/User');
const Researcher = require('../models/Researcher');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Gets all researcher applications that are not yet approved.
exports.getPendingResearchers = async (req, res) => {
  try {
    const pendingResearchers = await Researcher.find({ isApproved: false })
      .populate('userId', 'name email'); // Populate the user's name and email
    res.json(pendingResearchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approves a researcher application.
exports.approveResearcher = async (req, res) => {
  try {
    const researcher = await Researcher.findById(req.params.id);
    if (!researcher) return res.status(404).json({ message: 'Researcher application not found' });
    
    const user = await User.findById(researcher.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isApproved = true;
    user.role = 'researcher';
    await user.save();
    
    researcher.isApproved = true;
    await researcher.save();

    res.json({ message: 'Researcher approved successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rejects a researcher application by deleting the user and their application.
exports.rejectResearcher = async (req, res) => {
  try {
    const researcher = await Researcher.findById(req.params.id);
    if (!researcher) return res.status(404).json({ message: 'Researcher application not found' });

    await User.findByIdAndDelete(researcher.userId);
    await Researcher.findByIdAndDelete(req.params.id);

    res.json({ message: 'Researcher application rejected and user deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gets all users with the 'researcher' role.
exports.getAllResearchers = async (req, res) => {
  try {
    const researchers = await User.find({ role: 'researcher' }).select('-password');
    res.json(researchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin function to create a new user or admin directly.
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    user = new User({ name, email, password, role, isApproved: true });
    await user.save();
    res.status(201).json({ user, message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handles an existing user upgrading to researcher status
exports.applyForResearcherStatus = (req, res) => {
  upload.single('idProofFile')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed' });
    }
    try {
      const userId = req.user.id;
      const { phoneNumber, researchDescription } = req.body;
      const idProofUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      const existingResearcher = await Researcher.findOne({ userId });
      if (existingResearcher) {
        return res.status(400).json({ message: 'Application already submitted.' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const researcher = new Researcher({
        userId,
        phoneNumber,
        researchDescription,
        idProofUrl,
      });
      await researcher.save();

      user.isApproved = false;
      await user.save();

      res.status(201).json({ message: 'Application submitted successfully. Awaiting admin approval.' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};