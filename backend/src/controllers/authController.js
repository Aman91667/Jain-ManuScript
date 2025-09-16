// authController.js - Handles all authentication-related business logic.

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Researcher = require('../models/Researcher');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

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

exports.signupNormal = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user = new User({ name, email, password: hashedPassword, role: 'user', isApproved: true });
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user, token, message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signupResearcher = (req, res) => {
  upload.single('idProofFile')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed' });
    }
    try {
      const { name, email, password, phoneNumber, researchDescription } = req.body;
      const idProofUrl = req.file ? `/uploads/${req.file.filename}` : null;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password before saving to the database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        isApproved: false
      });
      await user.save();

      const researcher = new Researcher({
        userId: user._id,
        phoneNumber,
        researchDescription,
        idProofUrl
      });
      await researcher.save();
      
      const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ user, token, message: 'Application submitted successfully. Awaiting admin approval.' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    if (user.role === 'user' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user, token, message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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