const express = require('express');
const router = express.Router();
const { getDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/settings (Public)
router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const settings = await db.get('SELECT * FROM settings WHERE id = 1');
    res.json(settings || {});
  } catch (err) {
    console.error('Fetch settings error:', err);
    res.status(500).json({ error: 'Failed to fetch website settings.' });
  }
});

// PUT /api/settings (Protected Admin Only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      committee_name,
      tagline,
      about,
      vision,
      mission,
      address,
      phone,
      email,
      map_url,
      facebook_url,
      instagram_url,
      hero_image,
      logo
    } = req.body;

    const db = await getDB();
    const existing = await db.get('SELECT * FROM settings WHERE id = 1');

    if (!existing) {
      await db.run(
        `INSERT INTO settings (
          id, committee_name, tagline, about, vision, mission, address, phone, email, map_url, facebook_url, instagram_url, hero_image, logo
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          committee_name || 'MAA AMBIKA YOUTH CLUB BARAPADA',
          tagline || 'Unity • Service • Youth • Community',
          about || '',
          vision || '',
          mission || '',
          address || '',
          phone || '',
          email || '',
          map_url || '',
          facebook_url || '',
          instagram_url || '',
          hero_image || '',
          logo || ''
        ]
      );
    } else {
      await db.run(
        `UPDATE settings
         SET committee_name = ?, tagline = ?, about = ?, vision = ?, mission = ?,
             address = ?, phone = ?, email = ?, map_url = ?, facebook_url = ?,
             instagram_url = ?, hero_image = ?, logo = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = 1`,
        [
          committee_name !== undefined ? committee_name : existing.committee_name,
          tagline !== undefined ? tagline : existing.tagline,
          about !== undefined ? about : existing.about,
          vision !== undefined ? vision : existing.vision,
          mission !== undefined ? mission : existing.mission,
          address !== undefined ? address : existing.address,
          phone !== undefined ? phone : existing.phone,
          email !== undefined ? email : existing.email,
          map_url !== undefined ? map_url : existing.map_url,
          facebook_url !== undefined ? facebook_url : existing.facebook_url,
          instagram_url !== undefined ? instagram_url : existing.instagram_url,
          hero_image !== undefined ? hero_image : existing.hero_image,
          logo !== undefined ? logo : existing.logo
        ]
      );
    }

    const updatedSettings = await db.get('SELECT * FROM settings WHERE id = 1');
    res.json({ message: 'Settings updated successfully', settings: updatedSettings });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'Failed to update website settings.' });
  }
});

module.exports = router;
