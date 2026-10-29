import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Attendance from '../components/employee/Attendance';
import LeaveApply from '../components/employee/LeaveApply';
import LeaveList from '../components/employee/LeaveList';
import Announcements from '../components/employee/Announcements';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ phone: '', address: '' });
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('hrm_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.get('http://localhost:5000/api/employees/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.data) {
        setProfile(res.data.data);
        setProfileForm({
          phone: res.data.data.phone || '',
          address: res.data.data.address || ''
        });
      }
    } catch (err) {
      console.log('Profile fetch notice:', err.message);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.put(
        `http://localhost:5000/api/employees/${profile._id}`,
        profileForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileMsg('Personal record updated successfully');
      setProfile(res.data.data);
      setEditingProfile(false);
    } catch (err) {
      setProfileMsg('Failed to update record');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hrm_token');
    localStorage.removeItem('hrm_user');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <span>🏢 HRM Pro</span>
          <span className="nav-brand-badge">Employee Portal</span>
        </div>
        <div className="nav-actions">
          <div className="user-badge">
            <span>{user?.name || 'Employee'}</span>
            <span className="role-pill Employee">Employee</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || 'Team Member'} 👋</h1>
          <p>
            Department: <strong>{user?.department || 'General'}</strong> &bull; Manage your daily
            attendance, submit leave requests, track approvals, and view company news.
          </p>
        </div>

        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          >
            🕒 Attendance &amp; Check-In
          </button>
          <button
            onClick={() => setActiveTab('apply-leave')}
            className={`tab-btn ${activeTab === 'apply-leave' ? 'active' : ''}`}
          >
            📝 Apply for Leave
          </button>
          <button
            onClick={() => setActiveTab('my-leaves')}
            className={`tab-btn ${activeTab === 'my-leaves' ? 'active' : ''}`}
          >
            📑 Leave History &amp; Status
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
          >
            📢 Announcements
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            👤 Personal Record
          </button>
        </div>

        {activeTab === 'attendance' && <Attendance />}

        {activeTab === 'apply-leave' && (
          <LeaveApply onLeaveApplied={() => setActiveTab('my-leaves')} />
        )}

        {activeTab === 'my-leaves' && <LeaveList />}

        {activeTab === 'announcements' && <Announcements />}

        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-title">
              <span>👤 My Personal Information &amp; Record</span>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="btn btn-secondary btn-sm"
              >
                {editingProfile ? 'Cancel' : 'Edit Contact Info'}
              </button>
            </div>

            {profileMsg && <div className="alert alert-success">{profileMsg}</div>}

            {editingProfile ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      placeholder="e.g. +1 555 123 4567"
                    />
                  </div>
                  <div className="form-group">
                    <label>Residential Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, address: e.target.value })
                      }
                      placeholder="e.g. 123 Park Avenue, NY"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Save Personal Information
                </button>
              </form>
            ) : (
              <div className="form-grid">
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NAME</label>
                  <p style={{ fontWeight: 600 }}>{profile?.name || user?.name}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>EMAIL</label>
                  <p style={{ fontWeight: 600 }}>{profile?.email || user?.email}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DEPARTMENT</label>
                  <p style={{ fontWeight: 600 }}>{profile?.department || 'General'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>POSITION</label>
                  <p style={{ fontWeight: 600 }}>{profile?.position || 'Associate'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PHONE</label>
                  <p style={{ fontWeight: 600 }}>{profile?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ADDRESS</label>
                  <p style={{ fontWeight: 600 }}>{profile?.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
