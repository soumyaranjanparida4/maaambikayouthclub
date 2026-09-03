const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');

// POST /api/upload/single (Protected)
router.post('/single', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded or invalid file format.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ message: 'Image uploaded successfully', url: fileUrl });
});

// POST /api/upload/multiple (Protected)
router.post('/multiple', authenticateToken, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded.' });
  }

  const urls = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ message: `${req.files.length} images uploaded successfully`, urls });
});

module.exports = router;
