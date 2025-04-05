import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if path matches role
  if (location.pathname.includes('/dashboard/healthcare_provider') && userRole !== 'healthcare_provider') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;