import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveApplications = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.get('http://localhost:5000/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch leave applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setActionMessage('');
    setError('');
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.put(
        `http://localhost:5000/api/leaves/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMessage(res.data.message || `Leave ${status.toLowerCase()} successfully`);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update leave status');
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <span>📑 Leave Applications Oversight</span>
        <button onClick={fetchLeaves} className="btn btn-secondary btn-sm">
          Refresh
        </button>
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading leave applications...</p>
      ) : leaves.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No leave applications found.</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Reviewed By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td><strong>{leave.user?.name || 'User'}</strong></td>
                  <td>{leave.user?.department || 'General'}</td>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`badge badge-${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.reviewedBy
                      ? `${leave.reviewedBy.name} (${leave.reviewedBy.role})`
                      : 'Pending'}
                  </td>
                  <td>
                    {leave.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                          className="btn btn-success btn-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                          className="btn btn-danger btn-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveApplications;
