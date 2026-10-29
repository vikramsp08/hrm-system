import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.get('http://localhost:5000/api/attendance/my-attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data.data || []);
    } catch (err) {
      setError('Could not fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleMark = async () => {
    setMarking(true);
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.post(
        'http://localhost:5000/api/attendance/mark',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = records.find((r) => r.date === todayStr);

  return (
    <div>
      <div className="card">
        <div className="card-title">
          <span>🕒 Daily Attendance Punch</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: {todayStr}</span>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleMark}
            className="btn btn-primary"
            disabled={marking || (todayRecord && todayRecord.checkOutTime)}
          >
            {marking
              ? 'Processing...'
              : !todayRecord
              ? 'Check In Now'
              : !todayRecord.checkOutTime
              ? 'Check Out Now'
              : 'Attendance Completed Today'}
          </button>

          {todayRecord && (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong>Status Today:</strong> {todayRecord.status} | <strong>Check-In:</strong>{' '}
              {todayRecord.checkInTime || 'N/A'} | <strong>Check-Out:</strong>{' '}
              {todayRecord.checkOutTime || 'Pending'}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>📋 My Attendance History</span>
          <button onClick={fetchAttendance} className="btn btn-secondary btn-sm">
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading attendance history...</p>
        ) : records.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No attendance records recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id}>
                    <td>{rec.date}</td>
                    <td>{rec.checkInTime || '-'}</td>
                    <td>{rec.checkOutTime || '-'}</td>
                    <td>
                      <span className={`badge badge-${rec.status.toLowerCase().replace(/\s+/g, '')}`}>
                        {rec.status}
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

export default Attendance;
