const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'link-saver.db');
const INIT_SCRIPT = path.join(__dirname, 'init.sql');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('SQLite DB connected.');
    const schema = fs.readFileSync(INIT_SCRIPT, 'utf8');
    db.exec(schema, (err) => {
      if (err) {
        console.error('Error running schema:', err);
      } else {
        console.log('Database schema initialized.');
      }
    });
  }
});


module.exports = db;
