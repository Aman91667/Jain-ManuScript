const Manuscript = require("../models/Manuscript");
const fs = require("fs");

// ===========================================
// ✅ NEW: GET public manuscripts without auth
// ===========================================
exports.getPublicManuscripts = async (req, res) => {
  try {
    // Find manuscripts that are approved and have a 'normal' upload type
    const manuscripts = await Manuscript.find({
      uploadType: "normal",
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json(manuscripts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Public manuscript upload (user + admin)
exports.uploadPublicManuscript = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const { title, description, category } = req.body;
    if (!title) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Title is required" });
    }

    const manuscript = new Manuscript({
      title,
      description,
      category,
      uploadType: "normal",
      files: [`/uploads/${req.file.filename}`],
      uploadedBy: req.user.id,
      isApproved: true,
    });

    await manuscript.save();
    res.status(201).json({ message: "Public manuscript uploaded", manuscript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Detailed manuscript upload (researcher + admin)
exports.uploadDetailedManuscript = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "Files are required" });

    const { title, description, category, language, period, author, keywords } = req.body;
    if (!title) {
      req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(400).json({ message: "Title is required" });
    }

    const filePaths = req.files.map(file => `/uploads/${file.filename}`);

    const manuscript = new Manuscript({
      title,
      description,
      category,
      language,
      period,
      author,
      keywords: keywords ? keywords.split(",").map(k => k.trim()) : [],
      uploadType: "detailed",
      files: filePaths,
      uploadedBy: req.user.id,
      isApproved: true,
    });

    await manuscript.save();
    res.status(201).json({ message: "Detailed manuscript uploaded", manuscript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all manuscripts based on user role
// ... (rest of the file remains the same)

// Get all manuscripts based on user role
exports.getAllManuscripts = async (req, res) => {
  try {
    // ⚠️ Remove this temporary line!
    // const manuscripts = await Manuscript.find().sort({ createdAt: -1 });
    // return res.json(manuscripts);

    // ✅ UNCOMMENT THIS CODE BLOCK to enable role-based access
    const userRole = req.user.role;
    const userId = req.user.id;
    let query = {};

    if (userRole === "user") {
      // Users can only see public/normal manuscripts
      query = { uploadType: "normal" };
    } else if (userRole === "researcher") {
      // Researchers can see approved detailed manuscripts OR their own uploaded normal/detailed ones
      query = {
        $or: [
          { uploadType: "detailed", isApproved: true },
          { uploadedBy: userId }
        ],
      };
    } else if (userRole === "admin") {
      // Admins can see all manuscripts
      query = {};
    } else {
      // Fallback for an unknown role
      return res.status(403).json({ message: "Forbidden: You do not have permission." });
    }

    const manuscripts = await Manuscript.find(query).sort({ createdAt: -1 });
    res.json(manuscripts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ... (rest of the file remains the same)


// ✅ Get manuscript by ID
exports.getManuscriptById = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);
    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found" });
    }
    res.json(manuscript);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get featured manuscripts (e.g. marked by admin)
exports.getFeaturedManuscripts = async (req, res) => {
  try {
    const manuscripts = await Manuscript.find({ isFeatured: true, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(manuscripts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};