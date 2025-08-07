
const db = require('../database/db');

db.run('ALTER TABLE bookmarks ADD COLUMN favicon_url TEXT', (err) => {
  if (err) {
    console.error('Error adding favicon_url column:', err.message);
  } else {
    console.log('favicon_url column added successfully.');
  }
});
