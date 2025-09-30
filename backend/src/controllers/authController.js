const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role, 
      isApproved: user.isApproved 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Signup Normal User
exports.signupNormal = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: 'user',
      isApproved: true,
      status: 'approved',
    });
    
    await user.save();

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        status: user.status,
      },
      token: generateToken(user),
      message: 'Signup successful',
    });
  } catch (err) {
    logger.error('Error in signupNormal:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Signup Researcher
exports.signupResearcher = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, researchDescription, agreeToTerms } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'ID proof file is required' });
    }
    
    if (agreeToTerms !== 'true' && agreeToTerms !== true) {
      return res.status(400).json({ message: 'You must agree to terms and conditions' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: 'researcher',
      isApproved: false,
      status: 'pending',
      phoneNumber,
      researchDescription,
      idProofUrl: `/uploads/${file.filename}`,
      agreeToTerms: true,
    });
    
    await user.save();

    logger.info(`New researcher application: ${user.email}`);

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        status: user.status,
        phoneNumber: user.phoneNumber,
        researchDescription: user.researchDescription,
        idProofUrl: user.idProofUrl,
      },
      token: generateToken(user),
      message: 'Application submitted successfully. Await admin approval.',
    });
  } catch (err) {
    logger.error('Error in signupResearcher:', err);
    return res.status(500).json({ message: 'Server error during researcher signup' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({ 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        status: user.status,
        phoneNumber: user.phoneNumber,
        researchDescription: user.researchDescription,
        idProofUrl: user.idProofUrl,
        rejectionReason: user.rejectionReason,
      },
      token: generateToken(user) 
    });
  } catch (err) {
    logger.error('Error in login:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json(req.user);
  } catch (err) {
    logger.error('Error in getCurrentUser:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply to become Researcher (for existing normal users)
exports.applyForResearcherStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { phoneNumber, researchDescription, agreeToTerms } = req.body;
    const idProofFile = req.file;

    if (!phoneNumber || !researchDescription || !idProofFile) {
      return res.status(400).json({ 
        message: 'Phone number, research description, and ID proof are required' 
      });
    }

    if (agreeToTerms !== 'true' && agreeToTerms !== true) {
      return res.status(400).json({ 
        message: 'You must agree to terms and conditions' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        phoneNumber,
        researchDescription,
        idProofUrl: `/uploads/${idProofFile.filename}`,
        agreeToTerms: true,
        role: 'researcher',
        isApproved: false,
        status: 'pending',
        rejectionReason: '',
      },
      { new: true }
    ).select('-password');

    logger.info(`User upgraded to researcher: ${user.email}`);

    res.status(200).json({
      message: 'Application submitted successfully. Await admin approval.',
      user,
    });
  } catch (error) {
    logger.error('Error in applyForResearcherStatus:', error);
    res.status(500).json({ message: 'Server error during application' });
  }
};