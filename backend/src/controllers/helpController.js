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

    // TODO: Create a new access request entry for the admin to see.
    // This could be stored in a dedicated 'AccessRequest' model or sent as an email.

    res.status(201).json({ message: 'Access request submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};