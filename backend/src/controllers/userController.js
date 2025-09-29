const User = require('../models/User');
const Manuscript = require('../models/Manuscript');
const Researcher = require('../models/Researcher');

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

// --- Reapply for researcher role ---
exports.reapplyResearcher = async (req, res) => {
  try {
    const userId = req.user._id;
    const { phoneNumber, researchDescription } = req.body;
    const file = req.file; // multer upload if provided

    const updateData = {
      phoneNumber,
      researchDescription,
      status: 'pending',       // reset to pending
      isApproved: false,
      rejectionReason: '',     // clear old rejection reason
    };

    if (file) {
      updateData.idProofUrl = `/uploads/${file.filename}`;
    }

    // Update User
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Sync Researcher model as well
    await Researcher.findOneAndUpdate(
      { userId },
      {
        phoneNumber,
        researchDescription,
        idProofUrl: updateData.idProofUrl,
        isApproved: false,
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Reapplied successfully. Awaiting admin approval.', user });
  } catch (err) {
    console.error('Error in reapplyResearcher:', err);
    res.status(500).json({ message: 'Server error reapplying for researcher' });
  }
};
