const express = require('express');
const router = express.Router();
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/leaders (Public)
router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const leaders = await db.all('SELECT * FROM leaders ORDER BY display_order ASC');
    res.json(leaders);
  } catch (err) {
    console.error('Fetch leaders error:', err);
    res.status(500).json({ error: 'Failed to fetch leaders.' });
  }
});

// GET /api/leaders/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const db = await getDB();
    const leader = await db.get('SELECT * FROM leaders WHERE id = ?', [req.params.id]);
    if (!leader) return res.status(404).json({ error: 'Leader not found.' });
    res.json(leader);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leader details.' });
  }
});

// PUT /api/leaders/:id (Protected Admin Only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, photo_url, description, phone, position, display_order } = req.body;
    const db = await getDB();

    const existing = await db.get('SELECT * FROM leaders WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Leader position record not found.' });
    }

    const updatedName = name !== undefined ? name : existing.name;
    const updatedPhoto = photo_url !== undefined ? photo_url : existing.photo_url;
    const updatedDesc = description !== undefined ? description : existing.description;
    const updatedPhone = phone !== undefined ? phone : existing.phone;
    const updatedPos = position !== undefined ? position : existing.position;
    const updatedOrder = display_order !== undefined ? display_order : existing.display_order;

    await db.run(
      `UPDATE leaders
       SET name = ?, photo_url = ?, description = ?, phone = ?, position = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updatedName, updatedPhoto, updatedDesc, updatedPhone, updatedPos, updatedOrder, req.params.id]
    );

    const updatedLeader = await db.get('SELECT * FROM leaders WHERE id = ?', [req.params.id]);
    res.json({ message: 'Leader updated successfully', leader: updatedLeader });
  } catch (err) {
    console.error('Update leader error:', err);
    res.status(500).json({ error: 'Failed to update leader information.' });
  }
});

module.exports = router;
