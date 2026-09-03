const express = require('express');
const router = express.Router();
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/members (Public)
router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const members = await db.all('SELECT * FROM members ORDER BY display_order ASC, id DESC');
    res.json(members);
  } catch (err) {
    console.error('Fetch members error:', err);
    res.status(500).json({ error: 'Failed to fetch members.' });
  }
});

// POST /api/members (Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, photo_url, role, description, display_order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Member full name is required.' });
    }

    const db = await getDB();
    const maxOrder = await db.get('SELECT MAX(display_order) as max_order FROM members');
    const nextOrder = display_order !== undefined ? display_order : ((maxOrder?.max_order || 0) + 1);

    const result = await db.run(
      `INSERT INTO members (name, photo_url, role, description, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [name, photo_url || '', role || 'Active Member', description || '', nextOrder]
    );

    const newMember = await db.get('SELECT * FROM members WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Member added successfully', member: newMember });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ error: 'Failed to add committee member.' });
  }
});

// PUT /api/members/:id (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, photo_url, role, description, display_order } = req.body;
    const db = await getDB();

    const existing = await db.get('SELECT * FROM members WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const updatedName = name !== undefined ? name : existing.name;
    const updatedPhoto = photo_url !== undefined ? photo_url : existing.photo_url;
    const updatedRole = role !== undefined ? role : existing.role;
    const updatedDesc = description !== undefined ? description : existing.description;
    const updatedOrder = display_order !== undefined ? display_order : existing.display_order;

    await db.run(
      `UPDATE members
       SET name = ?, photo_url = ?, role = ?, description = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updatedName, updatedPhoto, updatedRole, updatedDesc, updatedOrder, req.params.id]
    );

    const updatedMember = await db.get('SELECT * FROM members WHERE id = ?', [req.params.id]);
    res.json({ message: 'Member updated successfully', member: updatedMember });
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({ error: 'Failed to update member information.' });
  }
});

// DELETE /api/members/:id (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDB();
    const existing = await db.get('SELECT * FROM members WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    await db.run('DELETE FROM members WHERE id = ?', [req.params.id]);
    res.json({ message: 'Member deleted successfully.' });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ error: 'Failed to delete member.' });
  }
});

module.exports = router;
