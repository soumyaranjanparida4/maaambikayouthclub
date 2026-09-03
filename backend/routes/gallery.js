const express = require('express');
const router = express.Router();
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/gallery (Public - optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const db = await getDB();

    let query = 'SELECT * FROM gallery';
    const params = [];

    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY id DESC';

    const items = await db.all(query, params);
    res.json(items);
  } catch (err) {
    console.error('Fetch gallery error:', err);
    res.status(500).json({ error: 'Failed to fetch gallery items.' });
  }
});

// POST /api/gallery (Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { image_url, caption, category, activity_id } = req.body;
    if (!image_url) {
      return res.status(400).json({ error: 'Image URL is required.' });
    }

    const db = await getDB();
    const result = await db.run(
      `INSERT INTO gallery (image_url, caption, category, activity_id)
       VALUES (?, ?, ?, ?)`,
      [image_url, caption || '', category || 'Events', activity_id || null]
    );

    const newItem = await db.get('SELECT * FROM gallery WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Photo added to gallery', item: newItem });
  } catch (err) {
    console.error('Add gallery photo error:', err);
    res.status(500).json({ error: 'Failed to add photo to gallery.' });
  }
});

// PUT /api/gallery/:id (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { caption, category, image_url, activity_id } = req.body;
    const db = await getDB();

    const existing = await db.get('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Gallery photo not found.' });
    }

    const updatedCaption = caption !== undefined ? caption : existing.caption;
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedImage = image_url !== undefined ? image_url : existing.image_url;
    const updatedActId = activity_id !== undefined ? activity_id : existing.activity_id;

    await db.run(
      `UPDATE gallery
       SET caption = ?, category = ?, image_url = ?, activity_id = ?
       WHERE id = ?`,
      [updatedCaption, updatedCategory, updatedImage, updatedActId, req.params.id]
    );

    const updatedItem = await db.get('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Gallery item updated', item: updatedItem });
  } catch (err) {
    console.error('Update gallery error:', err);
    res.status(500).json({ error: 'Failed to update gallery photo.' });
  }
});

// DELETE /api/gallery/:id (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDB();
    const existing = await db.get('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Gallery photo not found.' });
    }

    await db.run('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Photo deleted from gallery.' });
  } catch (err) {
    console.error('Delete gallery error:', err);
    res.status(500).json({ error: 'Failed to delete photo from gallery.' });
  }
});

module.exports = router;
