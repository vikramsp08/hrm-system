import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeCRUD from '../components/hr/EmployeeCRUD';
import LeaveApplications from '../components/hr/LeaveApplications';
import AttendanceSummary from '../components/hr/AttendanceSummary';
import AnnouncementsManager from '../components/hr/AnnouncementsManager';

const HrDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employees');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('hrm_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

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
          <span className="nav-brand-badge">HR Administrator Portal</span>
        </div>
        <div className="nav-actions">
          <div className="user-badge">
            <span>{user?.name || 'HR Admin'}</span>
            <span className="role-pill HR">HR</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>HR Administration Hub</h1>
          <p>
            Welcome, <strong>{user?.name}</strong>. Manage the employee directory, process leave
            approvals, monitor company-wide attendance, and broadcast official announcements.
          </p>
        </div>

        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('employees')}
            className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
          >
            👥 Employee Directory (CRUD)
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          >
            📑 Leave Applications
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          >
            📊 Attendance Summary
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
          >
            📢 Announcements Manager
          </button>
        </div>

        {activeTab === 'employees' && <EmployeeCRUD />}
        {activeTab === 'leaves' && <LeaveApplications />}
        {activeTab === 'attendance' && <AttendanceSummary />}
        {activeTab === 'announcements' && <AnnouncementsManager />}
      </div>
    </div>
  );
};

export default HrDashboard;
