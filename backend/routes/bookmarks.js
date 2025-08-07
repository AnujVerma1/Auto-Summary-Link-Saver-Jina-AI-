const express = require('express');
const router = express.Router();
const db = require('../database/db');
const verifyToken = require('../middleware/verifyToken');


const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

router.post('/', verifyToken, async (req, res) => {
  const { url, title, summary, tags } = req.body;
  const userId = req.user.id;


  const parsedUrl = new URL(url);
  const faviconUrl = `${parsedUrl.origin}/favicon.ico`;

  let finalSummary = summary;

  // If summary not provided, fetch from Jina
  // Jina AI summary logic
  if (!finalSummary || finalSummary.trim() === '') {
    try {
      const jinaApiUrl = `https://r.jina.ai/${url}`;


      const jinaRes = await fetch(jinaApiUrl);
      finalSummary = await jinaRes.text();

      if (!finalSummary || finalSummary.length < 20) {
        console.warn('Short or empty summary from Jina AI');
        finalSummary = 'Summary not available';
      }

      console.log('Fetched summary (first 100 chars):', finalSummary.slice(0, 100));
    } catch (err) {
      console.error('Jina API Error:', err.message);
      finalSummary = 'Summary not available';
    }
  }



  const sql = `INSERT INTO bookmarks (user_id, url, title, summary, favicon_url, tags) VALUES (?, ?, ?, ?, ?, ?)`;
  let cleanedTags = '';

  if (Array.isArray(tags)) {
    cleanedTags = tags.map(t => String(t).trim().toLowerCase()).join(',');
  } else if (typeof tags === 'string') {
    cleanedTags = tags.split(',').map(t => t.trim().toLowerCase()).join(',');
  } else {
    console.warn('Invalid tags format received:', tags);
    cleanedTags = '';
  }


  db.run(sql, [userId, url, title, finalSummary, faviconUrl, cleanedTags], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save bookmark' });
    }
    res.status(201).json({ message: 'Bookmark saved!', bookmarkId: this.lastID });
  });
});

// GET /api/bookmarks — Fetch all bookmarks for the logged-in user
router.get('/', verifyToken, (req, res) => {
  const userId = req.user.id;

  console.log("👤 Fetching bookmarks for userId:", userId);

  const sql = `SELECT id, url, title, summary, favicon_url, tags FROM bookmarks WHERE user_id = ? ORDER BY order_index ASC`;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('DB Error fetching bookmarks:', err);
      return res.status(500).json({ message: 'Failed to fetch bookmarks' });
    }

    res.json(rows);
  });
});

router.delete('/:id', verifyToken, (req, res) => {
  const userId = req.user.id;
  const bookmarkId = req.params.id;

  console.log('Attempting to delete bookmark:', bookmarkId, 'for user:', userId);

  const sql = `DELETE FROM bookmarks WHERE id = ? AND user_id = ?`;
  db.run(sql, [bookmarkId, userId], function (err) {
    if (err) {
      console.error('DB Delete Error:', err);
      return res.status(500).json({ message: 'Failed to delete bookmark' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Bookmark not found or not owned by user' });
    }
    res.json({ message: 'Bookmark deleted successfully' });
  });
});


router.patch('/reorder', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { reorderedBookmarks } = req.body;

  if (!Array.isArray(reorderedBookmarks)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  const updatePromises = reorderedBookmarks.map(bm => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE bookmarks SET order_index = ? WHERE id = ? AND user_id = ?`,
        [bm.order_index, bm.id, userId],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });

  try {
    await Promise.all(updatePromises);
    res.json({ message: 'Bookmark order updated' });
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});


module.exports = router;

