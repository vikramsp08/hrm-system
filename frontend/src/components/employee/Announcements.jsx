import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.get('http://localhost:5000/api/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data.data || []);
    } catch (err) {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="card">
      <div className="card-title">
        <span>📢 Company Announcements</span>
        <button onClick={fetchAnnouncements} className="btn btn-secondary btn-sm">
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading updates...</p>
      ) : announcements.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No announcements posted yet.</p>
      ) : (
        announcements.map((item) => (
          <div key={item._id} className="announcement-item">
            <h4>{item.title}</h4>
            <div className="announcement-meta">
              Posted by {item.createdBy?.name || 'Management'} ({item.createdBy?.role}) &bull;{' '}
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{item.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;
