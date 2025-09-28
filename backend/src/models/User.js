const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'researcher', 'admin'], default: 'user' },
  isApproved: { type: Boolean, default: false },
  phoneNumber: String,
  researchDescription: String,
  idProofUrl: String,
  agreeToTerms: { type: Boolean, required: true, default: false }, // <-- Add this field
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
