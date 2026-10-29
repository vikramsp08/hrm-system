import React, { useState } from 'react';
import axios from 'axios';

const LeaveApply = ({ onLeaveApplied }) => {
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { leaveType, startDate, endDate, reason } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.post(
        'http://localhost:5000/api/leaves',
        { leaveType, startDate, endDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || 'Leave applied successfully!');
      setFormData({
        leaveType: 'Casual Leave',
        startDate: '',
        endDate: '',
        reason: ''
      });
      if (onLeaveApplied) onLeaveApplied();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <span>📝 Apply for Leave</span>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="leaveType">Leave Category</label>
            <select
              id="leaveType"
              name="leaveType"
              className="form-control"
              value={leaveType}
              onChange={onChange}
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              className="form-control"
              value={startDate}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              className="form-control"
              value={endDate}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Detailed Reason</label>
          <textarea
            id="reason"
            name="reason"
            className="form-control"
            value={reason}
            onChange={onChange}
            placeholder="Please specify why you are requesting this leave..."
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting Application...' : 'Submit Leave Request'}
        </button>
      </form>
    </div>
  );
};

export default LeaveApply;
