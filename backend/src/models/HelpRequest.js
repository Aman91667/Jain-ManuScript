// HelpRequest.js - Defines the schema for a help request submitted by a researcher.

const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  manuscriptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manuscript',
    default: null,
  },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HelpRequest', helpRequestSchema);