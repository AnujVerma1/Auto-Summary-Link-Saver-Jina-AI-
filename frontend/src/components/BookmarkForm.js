import React, { useState } from 'react';
import axios from 'axios';

const BookmarkForm = ({ onBookmarkSaved }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/bookmarks',
        {
          url,
          title,
          summary,
          tags: tags.split(',').map((t) => t.trim().toLowerCase()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Bookmark saved!');
      setUrl('');
      setTitle('');
      setSummary('');
      setTags('');

      if (onBookmarkSaved) onBookmarkSaved();

    } catch (err) {
      console.error(err);
      alert('Failed to save bookmark');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 mb-4 rounded-4"
      style={{
        background: '#1e1e1e',
        color: '#e0e0e0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <h3 className="mb-4 text-center" style={{ fontWeight: '500' }}>📌 Save a Bookmark</h3>

      <div className="mb-3">
        <label className="form-label">🔗 Bookmark URL</label>
        <input
          type="url"
          className="form-control"
          style={{
            backgroundColor: '#2a2a2a',
            color: '#f0f0f0',
            border: '1px solid #444',
            transition: 'border-color 0.2s',
          }}
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">📘 Title</label>
        <input
          type="text"
          className="form-control"
          style={{
            backgroundColor: '#2a2a2a',
            color: '#f0f0f0',
            border: '1px solid #444',
          }}
          placeholder="Give it a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">📝 Summary</label>
        <textarea
          className="form-control"
          style={{
            backgroundColor: '#2a2a2a',
            color: '#f0f0f0',
            border: '1px solid #444',
            minHeight: '80px',
          }}
          placeholder="Write a quick summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">🏷️ Tags (comma-separated)</label>
        <input
          type="text"
          className="form-control"
          style={{
            backgroundColor: '#2a2a2a',
            color: '#f0f0f0',
            border: '1px solid #444',
          }}
          placeholder="e.g. react, frontend, tutorial"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn w-100"
        style={{
          backgroundColor: '#00ccff',
          color: '#000',
          fontWeight: '500',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 16px',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#00b8e6')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#00ccff')}
      >
        🚀 Save Bookmark
      </button>
    </form>
  );
};

export default BookmarkForm;
