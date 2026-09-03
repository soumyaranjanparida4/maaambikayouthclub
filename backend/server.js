const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { getDB } = require('./database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leaders', require('./routes/leaders'));
app.use('/api/members', require('./routes/members'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/upload', require('./routes/upload'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', committee: 'Maa Ambika Youth Club Barapada' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'An unexpected server error occurred.' });
});

// Initialize DB middleware for serverless
app.use(async (req, res, next) => {
  try {
    await getDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Initialize DB and start server locally
async function startServer() {
  try {
    await getDB();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`Maa Ambika Youth Club Backend running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
      console.log(`Admin user: admin / admin123`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to initialize database and start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
