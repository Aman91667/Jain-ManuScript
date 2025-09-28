const mongoose = require('mongoose');

const manuscriptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  content: String,
  category: String,
  visibility: { type: String, enum: ['public', 'researcher'], default: 'public' },
  language: String,
  period: String,
  author: String,
  keywords: [String],
  uploadType: { type: String, enum: ['normal', 'detailed'], default: 'normal' },
  files: [{ type: String }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Manuscript', manuscriptSchema);
