const { pool } = require('./config/db'); 
pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'rooms'")
  .then(res => { 
    console.log(res.rows.map(r => r.column_name).join(', ')); 
    process.exit(); 
  });
