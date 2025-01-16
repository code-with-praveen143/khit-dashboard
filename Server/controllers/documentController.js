const path = require("path");
const Document = require("../models/Document");
const fs = require("fs");
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const document = new Document({
      filename: req.file.filename,
    });

    await document.save();
    res.status(200).json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to fetch all documents
exports.getAllDocuments = async (req, res) => {
  try {
    // Fetch all documents from the database
    const documents = await Document.find().sort({ uploadedAt: -1 });

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }

    const result = documents.map((doc) => {
      const filePath = path.join(__dirname, "../uploads", doc.filename);

      // Check if the file exists
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        return {
          type: doc.filename.includes("terms_of_service") ? "terms_of_service" : "privacy_policy",
          content,
        };
      } else {
        return {
          type: doc.filename.includes("terms_of_service") ? "terms_of_service" : "privacy_policy",
          content: "Document file not found",
        };
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};