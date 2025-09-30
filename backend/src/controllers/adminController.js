const User = require('../models/User');
const logger = require('../config/logger');

// Fetch pending researchers
exports.getResearcherRequests = async (req, res) => {
  try {
    const requests = await User.find({ 
      role: 'researcher', 
      status: 'pending' 
    }).select('-password');
    
    res.status(200).json(requests);
  } catch (err) {
    logger.error('Error fetching researcher requests:', err);
    res.status(500).json({ message: 'Server error fetching researcher requests' });
  }
};

// Approve researcher
exports.approveResearcher = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'researcher') {
      return res.status(400).json({ message: 'User is not a researcher' });
    }

    user.isApproved = true;
    user.status = 'approved';
    user.rejectionReason = '';
    
    await user.save();

    logger.info(`Researcher approved: ${user.email} by admin ${req.user.email}`);

    res.status(200).json({
      message: 'Researcher approved successfully',
      user
    });
  } catch (err) {
    logger.error('Error approving researcher:', err);
    res.status(500).json({ message: 'Server error approving researcher' });
  }
};

// Reject researcher
exports.rejectResearcher = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Rejection reason is required' 
      });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'researcher') {
      return res.status(400).json({ message: 'User is not a researcher' });
    }

    user.isApproved = false;
    user.status = 'rejected';
    user.rejectionReason = rejectionReason.trim();
    
    await user.save();

    logger.info(`Researcher rejected: ${user.email} by admin ${req.user.email}`);

    res.status(200).json({ 
      message: 'Researcher rejected successfully', 
      user 
    });
  } catch (err) {
    logger.error('Error rejecting researcher:', err);
    res.status(500).json({ message: 'Server error rejecting researcher' });
  }
};