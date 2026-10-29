import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceSummary = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    presentCount: 0,
    halfDayCount: 0,
    absentCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.get('http://localhost:5000/api/attendance/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.data || []);
      setSummary(res.data.summary || {});
    } catch (err) {
      setError('Failed to fetch attendance summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Records</div>
          <div className="value">{summary.totalRecords || 0}</div>
        </div>
        <div className="stat-card">
          <div className="label" style={{ color: 'var(--success)' }}>Total Present</div>
          <div className="value" style={{ color: 'var(--success)' }}>{summary.presentCount || 0}</div>
        </div>
        <div className="stat-card">
          <div className="label" style={{ color: '#0369a1' }}>Half Days</div>
          <div className="value" style={{ color: '#0369a1' }}>{summary.halfDayCount || 0}</div>
        </div>
        <div className="stat-card">
          <div className="label" style={{ color: 'var(--danger)' }}>Absent Records</div>
          <div className="value" style={{ color: 'var(--danger)' }}>{summary.absentCount || 0}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>📊 Company-Wide Attendance Log</span>
          <button onClick={fetchAttendance} className="btn btn-secondary btn-sm">
            Refresh
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p>Loading attendance data...</p>
        ) : data.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No attendance records found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.user?.name || 'N/A'}</strong></td>
                    <td>{item.user?.department || 'General'}</td>
                    <td>{item.date}</td>
                    <td>{item.checkInTime || '-'}</td>
                    <td>{item.checkOutTime || '-'}</td>
                    <td>
                      <span className={`badge badge-${item.status.toLowerCase().replace(/\s+/g, '')}`}>
                        {item.status}
                      </span>
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

export default AttendanceSummary;
