const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const manuscriptController = require("../controllers/manuscriptController");

// /uploads folder
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });


// =================================================================
// ✅ NEW: GET public manuscripts - accessible without a token!
// =================================================================
router.get("/public", manuscriptController.getPublicManuscripts);

// Public upload
router.post(
  "/public",
  authMiddleware,
  roleMiddleware(["user", "admin"]),
  upload.single("files"),
  manuscriptController.uploadPublicManuscript
);

// Detailed upload
router.post(
  "/detailed",
  authMiddleware,
  roleMiddleware(["researcher", "admin"]),
  upload.array("files", 10),
  manuscriptController.uploadDetailedManuscript
);

// ⚠️ Place specific route before /:id
router.get("/featured", manuscriptController.getFeaturedManuscripts);

// Get all manuscripts
router.get("/", authMiddleware, manuscriptController.getAllManuscripts);

// Get by ID (must be last)
router.get("/:id", authMiddleware, manuscriptController.getManuscriptById);

module.exports = router;