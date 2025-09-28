const researcherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phoneNumber: { type: String, required: true },
  researchDescription: { type: String, required: true },
  idProofUrl: { type: String, required: true },
  agreeToTerms: { type: Boolean, required: true }, // <-- add here
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });
