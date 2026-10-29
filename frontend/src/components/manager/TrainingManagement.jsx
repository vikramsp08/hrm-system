import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingManagement = () => {
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    trainer: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedTrainingId, setSelectedTrainingId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const [trainRes, empRes] = await Promise.all([
        axios.get('http://localhost:5000/api/trainings', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setTrainings(trainRes.data.data || []);
      setEmployees(empRes.data.data || []);
    } catch (err) {
      setError('Failed to fetch training programs or employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('hrm_token');
      await axios.post('http://localhost:5000/api/trainings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Training session created successfully');
      setFormData({ title: '', description: '', date: '', trainer: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create training');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTrainingId || selectedUserIds.length === 0) {
      setError('Please choose a training session and select at least one employee');
      return;
    }

    try {
      const token = localStorage.getItem('hrm_token');
      await axios.put(
        `http://localhost:5000/api/trainings/${selectedTrainingId}/assign`,
        { userIds: selectedUserIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Employees assigned to training successfully');
      setSelectedUserIds([]);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign training');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this training program?')) return;
    try {
      const token = localStorage.getItem('hrm_token');
      await axios.delete(`http://localhost:5000/api/trainings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Training program deleted');
      fetchData();
    } catch (err) {
      setError('Failed to delete training program');
    }
  };

  const toggleUserSelection = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">
          <span>🎓 Create New Training Program</span>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleCreateTraining}>
          <div className="form-grid">
            <div className="form-group">
              <label>Program Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={onChange}
                placeholder="e.g. Advanced Node.js Architecture"
                required
              />
            </div>

            <div className="form-group">
              <label>Scheduled Date *</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Trainer / Instructor</label>
              <input
                type="text"
                name="trainer"
                className="form-control"
                value={formData.trainer}
                onChange={onChange}
                placeholder="e.g. Senior Tech Lead"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Program Description *</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={onChange}
              placeholder="Outline session curriculum, prerequisites, and learning outcomes..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Training Session
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <span>👥 Assign Employees to Scheduled Training</span>
        </div>

        <form onSubmit={handleAssign}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Training</label>
              <select
                className="form-control"
                value={selectedTrainingId}
                onChange={(e) => setSelectedTrainingId(e.target.value)}
              >
                <option value="">-- Choose Training Program --</option>
                {trainings.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title} ({new Date(t.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Select Employees to Assign</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {employees.map((emp) => {
                const isSelected = selectedUserIds.includes(emp.user?._id);
                return (
                  <button
                    type="button"
                    key={emp._id}
                    onClick={() => emp.user?._id && toggleUserSelection(emp.user._id)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {emp.name} ({emp.department})
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
            Assign Selected Staff
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">
          <span>Active Training Programs ({trainings.length})</span>
          <button onClick={fetchData} className="btn btn-secondary btn-sm">
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading programs...</p>
        ) : trainings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No training programs created yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Trainer</th>
                  <th>Date</th>
                  <th>Assigned Attendees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <strong>{t.title}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {t.description}
                      </div>
                    </td>
                    <td>{t.trainer}</td>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>
                      {t.assignedTo && t.assignedTo.length > 0 ? (
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {t.assignedTo.map((u) => (
                            <span key={u._id} className="badge badge-halfday">
                              {u.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          Open for all
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingManagement;
