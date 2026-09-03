const express = require('express');
const router = express.Router();
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/activities (Public - Newest first)
router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const activities = await db.all('SELECT * FROM activities ORDER BY date DESC, id DESC');
    res.json(activities);
  } catch (err) {
    console.error('Fetch activities error:', err);
    res.status(500).json({ error: 'Failed to fetch activities.' });
  }
});

// GET /api/activities/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const db = await getDB();
    const activity = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
    if (!activity) return res.status(404).json({ error: 'Activity not found.' });

    // Fetch related gallery photos
    const photos = await db.all('SELECT * FROM gallery WHERE activity_id = ?', [req.params.id]);
    res.json({ ...activity, photos });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity details.' });
  }
});

// POST /api/activities (Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, location, photo_url } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ error: 'Title, description, and date are required.' });
    }

    const db = await getDB();
    const result = await db.run(
      `INSERT INTO activities (title, description, date, location, photo_url)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, date, location || '', photo_url || '']
    );

    const newActivity = await db.get('SELECT * FROM activities WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Activity created successfully', activity: newActivity });
  } catch (err) {
    console.error('Add activity error:', err);
    res.status(500).json({ error: 'Failed to create activity.' });
  }
});

// PUT /api/activities/:id (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, location, photo_url } = req.body;
    const db = await getDB();

    const existing = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    const updatedTitle = title !== undefined ? title : existing.title;
    const updatedDesc = description !== undefined ? description : existing.description;
    const updatedDate = date !== undefined ? date : existing.date;
    const updatedLoc = location !== undefined ? location : existing.location;
    const updatedPhoto = photo_url !== undefined ? photo_url : existing.photo_url;

    await db.run(
      `UPDATE activities
       SET title = ?, description = ?, date = ?, location = ?, photo_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updatedTitle, updatedDesc, updatedDate, updatedLoc, updatedPhoto, req.params.id]
    );

    const updatedActivity = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
    res.json({ message: 'Activity updated successfully', activity: updatedActivity });
  } catch (err) {
    console.error('Update activity error:', err);
    res.status(500).json({ error: 'Failed to update activity.' });
  }
});

// DELETE /api/activities/:id (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDB();
    const existing = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    await db.run('DELETE FROM activities WHERE id = ?', [req.params.id]);
    res.json({ message: 'Activity deleted successfully.' });
  } catch (err) {
    console.error('Delete activity error:', err);
    res.status(500).json({ error: 'Failed to delete activity.' });
  }
});

module.exports = router;
