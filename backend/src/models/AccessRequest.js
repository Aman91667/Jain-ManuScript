const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manuscriptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manuscript', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AccessRequest', accessRequestSchema);
