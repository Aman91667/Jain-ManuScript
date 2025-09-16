// Researcher.js - Defines the schema for a researcher's application details.
// This model stores all the detailed information for a researcher, linking to the main user via `userId`.

const mongoose = require('mongoose');

const researcherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phoneNumber: { type: String },
  researchDescription: { type: String },
  idProofUrl: { type: String },
  approvedManuscripts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manuscript'
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Researcher', researcherSchema);