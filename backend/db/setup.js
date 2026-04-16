/**
 * Database Setup Script
 * Runs schema.sql and seed.sql to initialize the TravelBuddy database.
 * 
 * Usage: node db/setup.js
 * 
 * Prerequisites:
 *   1. PostgreSQL must be running
 *   2. Create the database first: CREATE DATABASE travelbuddy;
 *   3. Update .env with correct DB credentials
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'travelbuddy',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function runSQLFile(filePath, label) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`\n🔄 Running ${label}...`);
  
  try {
    await pool.query(sql);
    console.log(`✅ ${label} completed successfully.`);
  } catch (error) {
    console.error(`❌ ${label} failed:`, error.message);
    throw error;
  }
}

async function setup() {
  console.log('═══════════════════════════════════════════');
  console.log('   TravelBuddy Database Setup');
  console.log('═══════════════════════════════════════════');
  console.log(`📌 Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`📌 Database: ${process.env.DB_NAME || 'travelbuddy'}`);
  console.log(`📌 User: ${process.env.DB_USER || 'postgres'}`);

  try {
    // Test connection
    const res = await pool.query('SELECT NOW()');
    console.log(`\n✅ Connected to PostgreSQL at ${res.rows[0].now}`);

    // Run schema
    await runSQLFile(path.join(__dirname, 'schema.sql'), 'Schema (DDL)');

    // Run seed data
    await runSQLFile(path.join(__dirname, 'seed.sql'), 'Seed Data');

    // Verify
    console.log('\n📊 Verification:');
    const counts = await pool.query(`
      SELECT 'Hotels' AS entity, COUNT(*) AS count FROM hotels
      UNION ALL SELECT 'Rooms', COUNT(*) FROM rooms
      UNION ALL SELECT 'Amenities', COUNT(*) FROM amenities
      UNION ALL SELECT 'Room-Amenity Links', COUNT(*) FROM room_amenities
      UNION ALL SELECT 'Meal Plans', COUNT(*) FROM meal_plans
      UNION ALL SELECT 'Room-Meal Links', COUNT(*) FROM room_meal_plans
      UNION ALL SELECT 'Bookings', COUNT(*) FROM bookings
    `);
    counts.rows.forEach((row) => {
      console.log(`   ${row.entity.padEnd(20)} ${row.count}`);
    });

    console.log('\n🎉 Database setup complete!');
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setup();
