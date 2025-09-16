// backend/src/models/AccessRequest.js

const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true,
    },
    manuscriptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manuscript', // Reference to your Manuscript model
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);

module.exports = AccessRequest;