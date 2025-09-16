// Annotation.js - Defines the schema for a researcher's annotation on a manuscript.

const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema({
  // References to the related manuscript and user
  manuscriptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manuscript',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { type: String, required: true },

  // Annotation details
  text: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  position: { // Stores coordinates for the annotation on the page
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Annotation', annotationSchema);