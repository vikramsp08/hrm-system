import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'All'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.get('http://localhost:5000/api/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('hrm_token');
      await axios.post('http://localhost:5000/api/announcements', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Announcement published successfully');
      setFormData({ title: '', message: '', targetAudience: 'All' });
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const token = localStorage.getItem('hrm_token');
      await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Announcement removed');
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to delete announcement');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">
          <span>📢 Broadcast New Announcement</span>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={onChange}
                placeholder="e.g. Annual Company Offsite 2026"
                required
              />
            </div>

            <div className="form-group">
              <label>Target Audience</label>
              <select
                name="targetAudience"
                className="form-control"
                value={formData.targetAudience}
                onChange={onChange}
              >
                <option value="All">All Staff (Everyone)</option>
                <option value="Employees">Employees Only</option>
                <option value="Managers">Managers Only</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Message Content *</label>
            <textarea
              name="message"
              className="form-control"
              value={formData.message}
              onChange={onChange}
              placeholder="Write the announcement description..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <span>Active Announcements ({announcements.length})</span>
          <button onClick={fetchAnnouncements} className="btn btn-secondary btn-sm">
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No announcements active.</p>
        ) : (
          announcements.map((item) => (
            <div key={item._id} className="announcement-item" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4>{item.title}</h4>
                  <div className="announcement-meta">
                    Audience: <strong>{item.targetAudience}</strong> &bull; Posted by{' '}
                    {item.createdBy?.name || 'HR'} &bull;{' '}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.92rem' }}>{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsManager;
