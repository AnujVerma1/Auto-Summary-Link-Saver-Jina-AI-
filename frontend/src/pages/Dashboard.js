import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import BookmarkForm from '../components/BookmarkForm';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Dashboard = () => {
  const user = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [expanded, setExpanded] = useState(new Set());
  const [tagFilter, setTagFilter] = useState('');
  const navigate = useNavigate();

  const toggleSummary = (id) => {
    setExpanded(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token from localStorage:", token);
      if (!token) {
        console.warn('No token found in localStorage');
        return;
      }

      const res = await axios.get('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(res.data);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const deleteBookmark = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this bookmark?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookmarks();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete bookmark');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(bookmarks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBookmarks(items);

    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/bookmarks/reorder', {
        reorderedBookmarks: items.map((bm, index) => ({
          id: bm.id,
          order_index: index
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  if (user === null) return <p>Loading...</p>;


  const filteredBookmarks = bookmarks.filter((bm) => {
    if (!tagFilter.trim()) return true;
    const tagString = (bm.tags || '')
      .split(',')
      .map(t => t.trim().toLowerCase())
      .join(',');
    return tagString.includes(tagFilter.trim().toLowerCase());
  });

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#e0e0e0',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h2>Welcome, {user.email}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <BookmarkForm onBookmarkSaved={fetchBookmarks} />

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '14px' }}>
        <label className="form-label" style={{ fontSize: '20px' }}>Filter</label>
        <input
          type="text"
          placeholder="Filter by tag (e.g., news)"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          style={{
            marginBottom: '25px',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #444',
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#1e1e1e',
            color: '#f0f0f0',
            fontSize: '14px',
          }}
        />
      </div>

      <h3 style={{ marginBottom: '15px' }}>Your Bookmarks:</h3>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="bookmarks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ listStyle: 'none', padding: 0, minHeight: '50px' }}
            >
              {filteredBookmarks.length === 0 ? (
                <li style={{ padding: '10px', color: '#999' }}>No bookmarks saved yet.</li>
              ) : (
                filteredBookmarks.map((bm, index) => (
                  <Draggable key={bm.id} draggableId={bm.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          backgroundColor: '#1e1e1e',
                          padding: '20px',
                          marginBottom: '15px',
                          borderRadius: '10px',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.4)',
                          position: 'relative',
                        }}
                      >

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          {bm.favicon_url && (
                            <img
                              src={bm.favicon_url}
                              alt="favicon"
                              style={{ width: '18px', height: '18px', marginRight: '10px' }}
                            />
                          )}
                          <strong>{bm.title}</strong>
                        </div>


                        <a
                          href={bm.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#00ccff', textDecoration: 'underline' }}
                        >
                          {bm.url}
                        </a>

                        <i
                          className="fas fa-trash"
                          onClick={() => deleteBookmark(bm.id)}
                          title="Delete Bookmark"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            color: '#ff4d4d',
                            fontSize: '24px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, color 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.2)';
                            e.target.style.color = '#ff6666';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.color = '#ff4d4d';
                          }}
                        ></i>

                        <div style={{ marginTop: '10px', color: '#aaa' }}>
                          <em>
                            {expanded.has(bm.id)
                              ? bm.summary
                              : bm.summary.slice(0, 300) + (bm.summary.length > 300 ? '...' : '')}
                          </em>
                          {bm.summary.length > 300 && (
                            <button
                              onClick={() => toggleSummary(bm.id)}
                              style={{
                                marginLeft: '10px',
                                background: 'none',
                                border: 'none',
                                color: '#00ccff',
                                cursor: 'pointer',
                                fontSize: '0.9em',
                              }}
                            >
                              {expanded.has(bm.id) ? 'Show Less' : 'Read More'}
                            </button>
                          )}
                        </div>

                        {bm.tags && (
                          <div style={{ marginTop: '10px', color: '#00ff99', fontSize: '0.9em' }}>
                            Tags:{' '}
                            {Array.isArray(bm.tags)
                              ? bm.tags.join(', ')
                              : bm.tags.split(',').map(tag => tag.trim()).join(', ')}
                          </div>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

};

export default Dashboard;