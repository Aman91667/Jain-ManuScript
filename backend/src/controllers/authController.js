const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Researcher = require('../models/Researcher');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, isApproved: user.isApproved },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// --------------------
// Signup Normal User
// --------------------
exports.signupNormal = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Create user (schema will hash password)
    const user = new User({
      name,
      email,
      password, // raw password
      role: 'user',
      isApproved: true,
    });
    await user.save();

    // Return user + token
    res.status(201).json({
      user,
      token: generateToken(user),
      message: 'Signup successful',
    });
  } catch (err) {
    console.error('Error in signupNormal:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --------------------
// Signup Researcher
// --------------------
exports.signupResearcher = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, researchDescription, agreeToTerms } = req.body;
    const file = req.file;

    // Validation
    if (!name || !email || !password || !phoneNumber || !researchDescription)
      return res.status(400).json({ message: 'All text fields are required' });

    if (!file) return res.status(400).json({ message: 'ID proof file is required' });
    if (agreeToTerms !== 'true' && agreeToTerms !== true)
      return res.status(400).json({ message: 'You must agree to terms' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create user (schema will hash password)
    const user = new User({
      name,
      email,
      password, // raw password
      role: 'researcher',
      isApproved: false,
      phoneNumber,
      researchDescription,
      idProofUrl: `/uploads/${file.filename}`,
      agreeToTerms: true,
    });
    await user.save();

    // Create Researcher document
    const researcher = new Researcher({
      userId: user._id,
      phoneNumber,
      researchDescription,
      idProofUrl: `/uploads/${file.filename}`,
      isApproved: false,
    });
    await researcher.save();

    return res.status(201).json({
      user,
      token: generateToken(user),
      message: 'Application submitted. Await admin approval',
    });
  } catch (err) {
    console.error('SignupResearcher ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// --------------------
// Login
// --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Return user + token
    res.status(200).json({ user, token: generateToken(user) });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --------------------
// Get Current User
// --------------------
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.status(200).json(req.user);
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --------------------
// Apply to become Researcher
// --------------------
exports.applyForResearcherStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { phoneNumber, researchDescription, agreeToTerms } = req.body;
    const idProofFile = req.file;

    if (!phoneNumber || !researchDescription || !idProofFile || agreeToTerms !== 'true') {
      return res.status(400).json({ message: 'All fields and agreeing to terms are required.' });
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
        rejected: false,
        rejectionReason: '',
        status: 'pending',
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Application submitted successfully. Await admin approval.',
      user,
    });
  } catch (error) {
    console.error('Apply for researcher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



