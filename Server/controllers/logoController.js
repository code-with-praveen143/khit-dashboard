const Logo = require("../models/Logo");
const fs = require("fs");

const uploadLogo = async (req, res) => {
  try {
    // Check if a logo already exists
    const existingLogo = await Logo.findOne();
    if (existingLogo) {
      // Delete existing logo file from storage
      const filePath = `uploads/${existingLogo.logoUrl}`;
      fs.unlinkSync(filePath);

      // Remove the existing logo record from the database
      await Logo.deleteOne({ _id: existingLogo._id });
    }

    // Save new logo to the database
    const newLogo = new Logo({
      logoUrl: req.file.filename,
    });
    await newLogo.save();

    res.status(200).json({ message: "Logo uploaded successfully." });
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500).json({ error: "Failed to upload logo." });
  }
};

module.exports = { uploadLogo };
