const { Pool } = require('pg');
require('dotenv').config({ path: 'backend/.env' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'travelbuddy',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '11Mamta2004',
});

async function check() {
  try {
    const res = await pool.query('SELECT id, name FROM hotels LIMIT 5');
    console.log('Hotels in DB:');
    console.table(res.rows);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

check();
