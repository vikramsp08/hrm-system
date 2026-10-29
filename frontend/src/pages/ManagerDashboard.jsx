import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerLeaveApplications from '../components/manager/LeaveApplications';
import TrainingManagement from '../components/manager/TrainingManagement';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leaves');
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
          <span className="nav-brand-badge">Manager Portal</span>
        </div>
        <div className="nav-actions">
          <div className="user-badge">
            <span>{user?.name || 'Manager'}</span>
            <span className="role-pill Manager">Manager</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Manager Operations Hub</h1>
          <p>
            Welcome, <strong>{user?.name}</strong>. Manage and approve team leave requests,
            schedule professional training programs, and assign skill development tracks to employees.
          </p>
        </div>

        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('leaves')}
            className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          >
            ✅ Team Leave Requests
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`tab-btn ${activeTab === 'training' ? 'active' : ''}`}
          >
            🎓 Training &amp; Development
          </button>
        </div>

        {activeTab === 'leaves' && <ManagerLeaveApplications />}
        {activeTab === 'training' && <TrainingManagement />}
      </div>
    </div>
  );
};

export default ManagerDashboard;
