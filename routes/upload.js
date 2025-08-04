const express = require("express");
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
require("dotenv").config();

const router = express.Router();

// Multer setup for in-memory file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config (uses CLOUDINARY_URL from env)
cloudinary.config();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    // Buffer to Data URI for Cloudinary
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Convert buffer to base64
    const dataUri =
      "data:" + file.mimetype + ";base64," + file.buffer.toString("base64");

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "products", // Optional folder in Cloudinary
      // public_id: ... // You can provide a filename here if you want
    });

    res.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Image upload failed" });
  }
});

module.exports = router;
