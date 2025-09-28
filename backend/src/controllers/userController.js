const User = require('../models/User');
const Manuscript = require('../models/Manuscript');

// --- Get profile ---
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user: req.user }); // <-- wrap in { user } for frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Update profile ---
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });

    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

// --- Get user's manuscripts ---
exports.getMyManuscripts = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });

    const manuscripts = await Manuscript.find({ uploadedBy: req.user._id });
    res.status(200).json({ manuscripts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch manuscripts' });
  }
};
