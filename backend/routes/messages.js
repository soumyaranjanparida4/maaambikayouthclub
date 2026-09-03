const express = require('express');
const router = express.Router();
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// POST /api/messages (Public contact submission)
router.post('/', async (req, res) => {
  try {
    const { name, contact, message } = req.body;
    if (!name || !contact || !message) {
      return res.status(400).json({ error: 'Name, contact number/email, and message are required.' });
    }

    const db = await getDB();
    await db.run(
      'INSERT INTO messages (name, contact, message) VALUES (?, ?, ?)',
      [name.trim(), contact.trim(), message.trim()]
    );

    res.status(201).json({ message: 'Thank you! Your message has been sent to the committee leadership.' });
  } catch (err) {
    console.error('Contact message error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// GET /api/messages (Protected Admin Only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDB();
    const messages = await db.all('SELECT * FROM messages ORDER BY id DESC');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact messages.' });
  }
});

// DELETE /api/messages/:id (Protected Admin Only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDB();
    await db.run('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

module.exports = router;
