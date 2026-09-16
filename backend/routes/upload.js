const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { isCloudinaryConfigured, uploadToCloudinary } = require('../config/cloudinary');

// Helper to save buffer to local disk when Cloudinary is not configured
const saveBufferToLocalDisk = (file) => {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const filename = 'file-' + uniqueSuffix + ext;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${filename}`;
};

// Helper to process a single file upload
const processFileUpload = async (file) => {
  if (isCloudinaryConfigured()) {
    const result = await uploadToCloudinary(file.buffer, 'maa_ambika_youth_club');
    return result.secure_url;
  } else {
    return saveBufferToLocalDisk(file);
  }
};

// POST /api/upload/single (Protected)
router.post('/single', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded or invalid file format.' });
    }

    const fileUrl = await processFileUpload(req.file);
    res.json({ message: 'Image uploaded successfully', url: fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Image upload failed.' });
  }
});

// POST /api/upload/multiple (Protected)
router.post('/multiple', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded.' });
    }

    const uploadPromises = req.files.map(file => processFileUpload(file));
    const urls = await Promise.all(uploadPromises);

    res.json({ message: `${req.files.length} images uploaded successfully`, urls });
  } catch (err) {
    console.error('Multiple upload error:', err);
    res.status(500).json({ error: err.message || 'Multiple images upload failed.' });
  }
});

module.exports = router;
