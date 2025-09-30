const Manuscript = require("../models/Manuscript");
const logger = require('../config/logger');

// -----------------------------
// Public manuscripts - normal users
// -----------------------------
exports.getPublicManuscripts = async (req, res) => {
  try {
    // Only return normal manuscripts for public users
    const manuscripts = await Manuscript.find({ 
      visibility: "public",
      uploadType: "normal"  // only normal uploads
    })
    .sort({ createdAt: -1 })
    .select('-__v');
    
    res.json(manuscripts);
  } catch (err) {
    logger.error('Error fetching public manuscripts:', err);
    res.status(500).json({ message: "Server error fetching manuscripts" });
  }
};

// -----------------------------
// Researcher manuscripts - approved researchers only
// -----------------------------
exports.getResearcherManuscripts = async (req, res) => {
  try {
    // Only approved researchers can access
    if (req.user.role !== "researcher" || !req.user.isApproved) {
      return res.status(403).json({
        message: "Access denied. Only approved researchers can view this content."
      });
    }

    // Return only detailed manuscripts
    const manuscripts = await Manuscript.find({
      uploadType: "detailed",
      visibility: "researcher" // Only manuscripts meant for researchers
    })
    .sort({ createdAt: -1 })
    .select('-__v');
    
    res.json(manuscripts);
  } catch (err) {
    logger.error('Error fetching researcher manuscripts:', err);
    res.status(500).json({ message: "Server error fetching manuscripts" });
  }
};

// -----------------------------
// Admin manuscripts - all manuscripts
// -----------------------------
exports.getAllManuscripts = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const manuscripts = await Manuscript.find({})
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(manuscripts);
  } catch (err) {
    logger.error('Error fetching all manuscripts:', err);
    res.status(500).json({ message: "Server error fetching manuscripts" });
  }
};

// -----------------------------
// Get manuscript by ID
// -----------------------------
exports.getManuscriptById = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id).select('-__v');
    
    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found" });
    }

    // Admin can view anything
    if (req.user.role === 'admin') {
      return res.json(manuscript);
    }

    // Restrict researcher-only manuscripts
    if (manuscript.visibility === "researcher" && !req.user.isApproved) {
      return res.status(403).json({
        message: "Access denied. This is a researcher-only manuscript."
      });
    }

    // Restrict normal users from seeing detailed manuscripts
    if (req.user.role !== "researcher" && manuscript.uploadType === "detailed") {
      return res.status(403).json({
        message: "Access denied. Detailed manuscripts are for approved researchers only."
      });
    }
    
    res.json(manuscript);
  } catch (err) {
    logger.error('Error fetching manuscript by ID:', err);
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// Upload manuscript - admins only
// -----------------------------
exports.uploadManuscript = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Access denied. Only administrators can upload manuscripts." 
      });
    }

    const { title, description, category, visibility, language, period, author, keywords, uploadType } = req.body;
    const files = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (files.length === 0) return res.status(400).json({ message: 'At least one file is required' });

    const manuscript = new Manuscript({
      title,
      description,
      category,
      visibility: visibility || 'public',
      language,
      period,
      author,
      uploadType: uploadType || 'normal',
      files,
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
      uploadedBy: req.user._id
    });

    await manuscript.save();
    logger.info(`New manuscript uploaded: ${manuscript.title} by ${req.user.email}`);
    res.status(201).json({ manuscript, message: 'Manuscript uploaded successfully' });
  } catch (err) {
    logger.error('Error uploading manuscript:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

// -----------------------------
// Update manuscript - owner or admin
// -----------------------------
exports.updateManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);
    if (!manuscript) return res.status(404).json({ message: 'Manuscript not found' });

    const isOwner = manuscript.uploadedBy.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Access denied. Owner or admin only.' });

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'category', 'visibility', 'language', 'period', 'author', 'uploadType'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) manuscript[field] = req.body[field];
    });

    // Update keywords
    if (req.body.keywords) manuscript.keywords = req.body.keywords.split(',').map(k => k.trim());

    // Update files
    if (req.body.existingFiles) {
      try { manuscript.files = JSON.parse(req.body.existingFiles); } 
      catch (e) { logger.error('Error parsing existingFiles:', e); }
    }
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(file => `/uploads/${file.filename}`);
      manuscript.files = [...manuscript.files, ...newFiles];
    }

    await manuscript.save();
    logger.info(`Manuscript updated: ${manuscript.title} by ${req.user.email}`);
    res.status(200).json({ data: manuscript, message: 'Manuscript updated successfully' });
  } catch (err) {
    logger.error('Error updating manuscript:', err);
    res.status(500).json({ message: 'Update failed' });
  }
};

// -----------------------------
// Delete manuscript - owner or admin
// -----------------------------
exports.deleteManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);
    if (!manuscript) return res.status(404).json({ message: 'Manuscript not found' });

    const isOwner = manuscript.uploadedBy.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Access denied. Owner or admin only.' });

    await Manuscript.findByIdAndDelete(req.params.id);
    logger.info(`Manuscript deleted: ${manuscript.title} by ${req.user.email}`);
    res.status(200).json({ message: 'Manuscript deleted successfully' });
  } catch (err) {
    logger.error('Error deleting manuscript:', err);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
