const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'travelbuddy',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '11Mamta2004',
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'hotels'
    `);
    console.log('✅ Connection successful');
    console.log('Columns in hotels table:', res.rows.map(r => r.column_name).join(', '));
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

check();
