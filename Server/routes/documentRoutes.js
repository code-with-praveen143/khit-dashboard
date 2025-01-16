const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadDocument, getAllDocuments } = require("../controllers/documentController");

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload document route
router.post("/", upload.single("document"), uploadDocument);

router.get("/all", getAllDocuments);

module.exports = router;
