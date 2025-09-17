const mongoose = require('mongoose');

const manuscriptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, trim: true },
  language: { type: String, trim: true },
  period: { type: String, trim: true },
  author: { type: String, trim: true },
  keywords: { type: [String] }, // Changed to an array of strings
  files: { type: [String], required: true }, // Changed from fileUrl to files array
  
  // ===================== ADDED =====================
  uploadType: {
    type: String,
    enum: ['normal', 'detailed'],
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // =================================================

}, {
  timestamps: true,
});

module.exports = mongoose.model('Manuscript', manuscriptSchema);