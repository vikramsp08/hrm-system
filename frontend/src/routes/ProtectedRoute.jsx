import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('hrm_token');
  const userString = localStorage.getItem('hrm_user');

  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect based on actual user role
      if (user.role === 'HR') return <Navigate to="/hr" replace />;
      if (user.role === 'Manager') return <Navigate to="/manager" replace />;
      return <Navigate to="/employee" replace />;
    }
  } catch (err) {
    localStorage.removeItem('hrm_token');
    localStorage.removeItem('hrm_user');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
