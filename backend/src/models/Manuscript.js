// backend/src/models/Manuscript.js
const mongoose = require('mongoose');

const manuscriptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String },
  description: { type: String },
  summary: { type: String },
  significance: { type: String },
  thumbnail: { type: String }, 
  images: [{ type: String }],
  language: { type: String },
  status: { type: String, enum: ['published', 'pending', 'draft'], default: 'published' },
  isPublic: { type: Boolean, default: false }, // ✅ NEW: Differentiate between public and private
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Manuscript', manuscriptSchema);