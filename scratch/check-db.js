require('dotenv').config({ path: './backend/.env' });
const { pool } = require('../backend/config/db');

async function testDB() {
  try {
    const hotels = await pool.query('SELECT count(*) FROM hotels');
    const rooms = await pool.query('SELECT count(*) FROM rooms');
    console.log('--- Database Health Check ---');
    console.log(`Hotels: ${hotels.rows[0].count}`);
    console.log(`Rooms:  ${rooms.rows[0].count}`);
    
    if (hotels.rows[0].count > 0) {
      const sample = await pool.query('SELECT name, city, star_rating FROM hotels LIMIT 1');
      console.log('Sample Hotel:', sample.rows[0]);
    }
  } catch (err) {
    console.error('DB Check Failed:', err.message);
  } finally {
    process.exit();
  }
}

testDB();
