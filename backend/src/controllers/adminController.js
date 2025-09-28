const Manuscript = require('../models/Manuscript');
const Researcher = require('../models/Researcher');
const User = require('../models/User'); // Essential import
const AccessRequest = require('../models/AccessRequest');

/**
 * Get all researcher access requests (ADMIN ONLY)
 */
exports.getAllAccessRequests = async (req, res) => {
    try {
        // Defensive security check
        if (req.user.role !== 'admin') { 
            return res.status(403).json({ message: "Admin access required" });
        }
        
        const requests = await AccessRequest.find()
            .populate('userId', 'name email')
            .populate('manuscriptId', 'title');
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch requests' });
    }
};

/**
 * Get all users awaiting researcher approval (Admin view)
 */
/**
 * Get all users awaiting researcher approval (Admin view)
 */
exports.getResearcherRequests = async (req, res) => {
  try {
    // Only fetch researchers whose status is 'pending'
    const requests = await User.find({ role: 'researcher', status: 'pending' }).select('-password');
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getResearcherRequests:", error);
    res.status(500).json({ message: 'Server error fetching researcher requests' });
  }
};


/**
 * Approve or reject researcher (Updates User status and Researcher application record)
 */
exports.approveResearcher = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isApproved } = req.body; // true = approve, false = reject

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role !== 'researcher')
            return res.status(400).json({ message: 'User is not a researcher' });

        // Update User Status (The source of truth for authorization checks)
        user.isApproved = isApproved;
        await user.save();

        // Optional: Update the Researcher application entry for record keeping
        const researcher = await Researcher.findOne({ userId });
        if (researcher) {
            researcher.isApproved = isApproved;
            await researcher.save();
        }

        res.status(200).json({ message: `Researcher ${isApproved ? 'approved' : 'rejected'}`, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating researcher status' });
    }
};
// adminController.js
exports.rejectResearcher = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'researcher')
      return res.status(400).json({ message: 'User is not a researcher' });

    // Update status to rejected
    user.isApproved = false;
    user.status = 'rejected';
    await user.save();

    // Update Researcher record if exists
    const researcher = await Researcher.findOne({ userId });
    if (researcher) {
      researcher.isApproved = false;
      await researcher.save();
    }

    res.status(200).json({ message: 'Researcher application rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error rejecting researcher' });
  }
};
