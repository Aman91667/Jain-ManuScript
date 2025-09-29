const User = require('../models/User');
const Researcher = require('../models/Researcher');

// --- Fetch pending researchers ---
exports.getResearcherRequests = async (req, res) => {
  try {
    const requests = await User.find({ role: 'researcher', status: 'pending' }).select('-password');
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching researcher requests' });
  }
};

// --- Approve researcher ---
// --- Approve researcher ---
exports.approveResearcher = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'researcher') return res.status(400).json({ message: 'User is not a researcher' });

    user.isApproved = true;
    user.status = 'approved';
    user.rejected = false;
    user.rejectionReason = undefined;
    await user.save();

    const researcher = await Researcher.findOne({ userId });
    if (researcher) {
      researcher.isApproved = true;
      await researcher.save();
    }

    res.status(200).json({
      message: 'Researcher approved successfully',
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error approving researcher' });
  }
};

// --- Reject researcher ---
exports.rejectResearcher = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'researcher') return res.status(400).json({ message: 'User is not a researcher' });

    user.isApproved = false;
    user.status = 'rejected';
    user.rejected = true;
    user.rejectionReason = rejectionReason || 'No reason provided';
    await user.save();

    const researcher = await Researcher.findOne({ userId });
    if (researcher) {
      researcher.isApproved = false;
      await researcher.save();
    }

    // ✅ Return updated user along with message
    res.status(200).json({ message: 'Researcher rejected successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error rejecting researcher' });
  }
};

