const User = require('../models/User');

exports.getPendingResearchers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ role: 'user', isApproved: false });
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending researchers' });
  }
};

exports.approveResearcher = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'researcher';
    user.isApproved = true;
    await user.save();

    res.json({ message: 'Researcher approved successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectResearcher = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Researcher application rejected and user deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
