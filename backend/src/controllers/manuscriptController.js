// backend/src/controllers/manuscriptController.js
const Manuscript = require('../models/Manuscript');
const User = require('../models/User'); 
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

exports.getAllManuscripts = async (req, res) => {
  try {
    const manuscripts = await Manuscript.find();
    res.json(manuscripts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getManuscriptById = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);
    if (!manuscript) {
      return res.status(404).json({ message: 'Manuscript not found' });
    }
    
    // Check if the user is a researcher
    if (req.user && req.user.role === 'researcher') {
      const user = await User.findById(req.user.id);
      if (user && user.approvedManuscripts.includes(req.params.id)) {
        return res.json(manuscript);
      }
    }
    
    const publicView = {
      title: manuscript.title,
      author: manuscript.author,
      description: manuscript.description,
      thumbnail: manuscript.thumbnail,
      summary: manuscript.summary,
    };
    
    res.json(publicView);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeaturedManuscripts = async (req, res) => {
  try {
    const featuredManuscripts = await Manuscript.find({ isFeatured: true });
    res.json(featuredManuscripts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW: Handles public manuscript upload (single thumbnail)
exports.uploadPublicManuscript = (req, res) => {
  upload.single('thumbnail')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Thumbnail upload failed' });
    }
    try {
      const { title, author, category, language, summary } = req.body;
      const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
      
      const newManuscript = new Manuscript({
        title,
        author,
        category,
        language,
        summary,
        thumbnail,
        isPublic: true,
        submittedBy: req.user.id,
      });
      await newManuscript.save();
      res.status(201).json(newManuscript);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

// ✅ NEW: Handles detailed manuscript upload (thumbnail + multiple images)
exports.uploadDetailedManuscript = (req, res) => {
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'manuscriptPages', maxCount: 20 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed' });
    }
    try {
      const { title, author, category, language, summary, description, significance } = req.body;
      const thumbnail = req.files['thumbnail'][0] ? `/uploads/${req.files['thumbnail'][0].filename}` : null;
      const manuscriptImages = req.files['manuscriptPages'].map(file => `/uploads/${file.filename}`);

      const newManuscript = new Manuscript({
        title,
        author,
        category,
        language,
        summary,
        description,
        significance,
        thumbnail,
        images: manuscriptImages,
        isPublic: false,
        submittedBy: req.user.id,
      });
      await newManuscript.save();
      res.status(201).json(newManuscript);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};