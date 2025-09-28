const Manuscript = require("../models/Manuscript");
// const User = require('../models/User'); // Assume User model is required if not explicitly imported

/**
 * Get all public manuscripts
 * Anyone logged in can access
 */
exports.getPublicManuscripts = async (req, res) => {
    try {
        const manuscripts = await Manuscript.find({ visibility: "public" }).sort({ createdAt: -1 });
        res.json(manuscripts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get researcher manuscripts (only for approved researchers)
 */
exports.getResearcherManuscripts = async (req, res) => {
    try {
        // Authorization is handled on the route, but a defensive check remains:
        if (req.user.role !== "researcher" || !req.user.isApproved) {
            return res.status(403).json({
                message: "Access denied. Only approved researchers can view this content."
            });
        }

        const manuscripts = await Manuscript.find({ visibility: "researcher" }).sort({ createdAt: -1 });
        res.json(manuscripts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get all manuscripts (admin only)
 */
exports.getAllManuscripts = async (req, res) => {
    try {
        // Authorization is handled on the route, but a defensive check remains:
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const manuscripts = await Manuscript.find({}).sort({ createdAt: -1 });
        res.json(manuscripts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get manuscript by ID
 */
exports.getManuscriptById = async (req, res) => {
    try {
        const manuscript = await Manuscript.findById(req.params.id);
        if (!manuscript) {
            return res.status(404).json({ message: "Manuscript not found" });
        }

        // Allow Admin to view anything
        if (req.user.role === 'admin') {
            return res.json(manuscript);
        }

        // Restrict researcher-only manuscripts
        if (manuscript.visibility === "researcher") {
            if (req.user.role !== "researcher" || !req.user.isApproved) {
                return res.status(403).json({
                    message: "Access denied. Researcher-only manuscript."
                });
            }
        }
        
        res.json(manuscript);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Upload Manuscript - ADMINS ONLY
 */
exports.uploadManuscript = async (req, res) => {
    try {
        // CRITICAL FIX: Only allow users with the 'admin' role to proceed.
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only administrators can upload manuscripts." });
        }

        const { title, description, category, visibility, language, period, author, keywords, uploadType } = req.body;
        const files = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];

        const manuscript = new Manuscript({
            title, description, category, visibility, language, period, author, uploadType, files,
            keywords: keywords ? keywords.split(',') : [],
            uploadedBy: req.user._id 
        });

        await manuscript.save();
        res.status(201).json({ manuscript, message: 'Manuscript uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed' });
    }
};

/**
 * Update Manuscript - Owner or Admin
 */
exports.updateManuscript = async (req, res) => {
    try {
        const manuscript = await Manuscript.findById(req.params.id);
        if (!manuscript) return res.status(404).json({ message: 'Manuscript not found' });

        // Authorization Check: Only the owner or an admin can update
        const isOwner = manuscript.uploadedBy.equals(req.user._id);
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Access denied. You must be the owner or an admin to update.' });
        }

        Object.assign(manuscript, req.body);

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => manuscript.files.push(`uploads/${file.filename}`));
        }

        await manuscript.save();
        res.status(200).json({ manuscript, message: 'Updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Update failed' });
    }
};

/**
 * Delete Manuscript - Owner or Admin
 */
exports.deleteManuscript = async (req, res) => {
    try {
        console.log("Delete Request ID:", req.params.id);
        console.log("Request User:", req.user._id, "Role:", req.user.role);

        const manuscript = await Manuscript.findById(req.params.id);

        if (!manuscript) {
            console.log("Manuscript not found in DB");
            return res.status(404).json({ message: 'Manuscript not found' });
        }

        // Authorization Check: Only the owner or an admin can delete
        const isOwner = manuscript.uploadedBy.equals(req.user._id);
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            console.log("Unauthorized delete attempt");
            return res.status(403).json({ message: 'Access denied. You must be the owner or an admin to delete.' });
        }

        await Manuscript.findByIdAndDelete(req.params.id);
        console.log("Manuscript deleted successfully:", req.params.id);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error("Delete Manuscript Error:", err);
        res.status(500).json({ message: 'Delete failed', error: err.message });
    }
};
