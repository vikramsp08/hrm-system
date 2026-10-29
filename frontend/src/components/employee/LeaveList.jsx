import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyLeaves = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.get('http://localhost:5000/api/leaves/my-leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data.data || []);
    } catch (err) {
      setError('Could not retrieve leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  return (
    <div className="card">
      <div className="card-title">
        <span>📑 My Leave Applications &amp; History</span>
        <button onClick={fetchMyLeaves} className="btn btn-secondary btn-sm">
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading leave records...</p>
      ) : leaves.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No leave applications submitted yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Reviewed By</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>
                    <strong>{leave.leaveType}</strong>
                  </td>
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
                      : 'Pending Review'}
                  </td>
                  <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveList;
