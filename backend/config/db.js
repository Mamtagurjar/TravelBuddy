const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'travelbuddy',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'ashish@123',
  // password: process.env.DB_PASSWORD || '11Mamta2004',
  // Connection pool settings for production readiness
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Fail fast if can't connect in 5s
});

// Log connection status
pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error:', err);
  process.exit(-1);
});

/**
 * Execute a parameterized query against the database.
 * @param {string} text - SQL query string with $1, $2... placeholders
 * @param {Array} params - Parameter values
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
