// helpController.js - Handles help and access requests from researchers.

const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');

// Handles a general help request from an authenticated user.
exports.submitHelpRequest = async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user.id);
    
    const newRequest = new HelpRequest({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      message,
    });
    await newRequest.save();

    // TODO: Implement a notification system to alert admins (e.g., email service).

    res.status(201).json({ message: 'Help request submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handles a request from a researcher for access to a specific manuscript.
exports.requestAccess = async (req, res) => {
  try {
    const { manuscriptId } = req.body;
    const user = await User.findById(req.user.id);

    // ✅ The new code to create a help request for a manuscript.
    const newRequest = new HelpRequest({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      message: `Requesting access to manuscript ID: ${manuscriptId}`,
      manuscriptId,
    });
    await newRequest.save();

    res.status(201).json({ message: 'Access request submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};