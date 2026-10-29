import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('hrm_token');
  const user = JSON.parse(localStorage.getItem('hrm_user') || 'null');

  const goToDashboard = () => {
    if (!user) return navigate('/login');
    if (user.role === 'HR') navigate('/hr');
    else if (user.role === 'Manager') navigate('/manager');
    else navigate('/employee');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <span>🏢 HRM Pro</span>
          <span className="nav-brand-badge">Enterprise v1.0</span>
        </div>
        <div className="nav-actions">
          {token && user ? (
            <button onClick={goToDashboard} className="btn btn-primary btn-sm">
              Go to {user.role} Dashboard &rarr;
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="home-hero">
        <h1>
          Modern Workforce &amp; <span>Human Resource</span> Management
        </h1>
        <p>
          A centralized, role-based platform designed for modern organizations. Manage employee
          records, streamline leave approvals, track real-time attendance, organize training sessions, and broadcast internal announcements.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {token && user ? (
            <button onClick={goToDashboard} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Open My Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                Access Portal
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                Register Account
              </Link>
            </>
          )}
        </div>

        <div className="home-role-cards">
          <div className="role-preview-card">
            <span className="role-pill HR">HR Role</span>
            <h3 style={{ marginTop: '0.75rem' }}>HR Administration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Full control over organizational workforce directory and company-wide oversight.
            </p>
            <ul>
              <li>Create, view, edit &amp; delete employee profiles</li>
              <li>Review and approve/reject leave requests</li>
              <li>View comprehensive attendance summaries</li>
              <li>Broadcast announcements across the organization</li>
            </ul>
          </div>

          <div className="role-preview-card">
            <span className="role-pill Manager">Manager Role</span>
            <h3 style={{ marginTop: '0.75rem' }}>Team &amp; Growth Leadership</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Streamline team leave approvals and build talent with targeted training programs.
            </p>
            <ul>
              <li>Review and process team leave applications</li>
              <li>Create, schedule &amp; manage training programs</li>
              <li>Assign team members to skill workshops</li>
              <li>Broadcast team updates and announcements</li>
            </ul>
          </div>

          <div className="role-preview-card">
            <span className="role-pill Employee">Employee Role</span>
            <h3 style={{ marginTop: '0.75rem' }}>Employee Self-Service</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Empowering team members with instant access to daily records and requests.
            </p>
            <ul>
              <li>Apply for leave &amp; track approval status</li>
              <li>Daily Check-in / Check-out attendance tracking</li>
              <li>Maintain personal contact &amp; address details</li>
              <li>Access assigned training and announcements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
