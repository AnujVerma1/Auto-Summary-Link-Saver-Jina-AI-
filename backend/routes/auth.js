const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, hash],
    function (err) {
if (err) {
  if (err.message.includes('UNIQUE constraint failed: users.email')) {
    return res.status(400).json({ error: 'Email is already registered.' });
  }
  return res.status(400).json({ error: err.message });
}

      const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET);
      res.json({ token });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (!user || !user.password_hash) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    try {
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
      res.json({ token });

    } catch (compareErr) {
      console.error("Compare Error:", compareErr);
      res.status(500).json({ error: 'Login failed' });
    }
  });
});


module.exports = router;
