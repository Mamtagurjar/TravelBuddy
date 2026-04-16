const express = require('express');
const cors = require('cors');
require('dotenv').config();

const searchRoutes = require('./routes/search');
const { pool } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TravelBuddy API',
    version: '1.0.0',
    endpoints: {
      // health: 'GET /api/health',
      search: 'GET /api/search',
      filters: 'GET /api/search/filters',
    },
  });
});

// Mount search routes
app.use('/api/search', searchRoutes);

// ─── Global error handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// ─── Start server ────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Search API:  http://localhost:${PORT}/api/search`);

  // Test database connection on startup
  try {
    const result = await pool.query('SELECT NOW() AS current_time, current_database() AS db_name');
    const { current_time, db_name } = result.rows[0];
    console.log(`✅ Database connected successfully!`);
    console.log(`   📦 Database: ${db_name}`);
    console.log(`   🕐 Server time: ${current_time}`);
  } catch (error) {
    console.error(`❌ Database connection FAILED!`);
    console.error(`   Error: ${error.message}`);
    console.error(`   💡 Make sure PostgreSQL is running and .env credentials are correct.`);
  }
});
