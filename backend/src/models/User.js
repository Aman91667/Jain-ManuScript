// User.js - Defines the schema for a user in the application.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'researcher', 'admin'], default: 'user' },
    isApproved: { type: Boolean, default: false },
    // ✅ NEW FIELDS FOR RESEARCHER APPLICATION
    phoneNumber: { type: String },
    researchDescription: { type: String },
    idProofUrl: { type: String },
}, { timestamps: true }); // Mongoose will automatically add createdAt and updatedAt fields

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);