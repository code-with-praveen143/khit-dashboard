const express = require("express");
const multer = require("multer");
const { uploadLogo } = require("../controllers/logoController");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to handle logo uploads
router.post("/logo", upload.single("logo"), uploadLogo);

module.exports = router;
