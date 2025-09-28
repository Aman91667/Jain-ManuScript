const mongoose = require('mongoose');

const researcherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phoneNumber: { type: String, required: true },
  researchDescription: { type: String, required: true },
  idProofUrl: { type: String, required: true },
  isApproved: { type: Boolean, default: false }, // legacy flag
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Researcher', researcherSchema);
