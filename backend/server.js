const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bookmarkRoutes = require('./routes/bookmarks');
const authRoutes = require('./routes/auth');

dotenv.config();

const db = require('./database/db');
// require('./patches/add-favicon-column');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Link Saver Backend is running!');
});

app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
