import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { TailSpin } from 'react-loader-spinner';

const ProtectedRoute = ({ children, roles }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="Loader full-page"><TailSpin height="80" width="80" color="#6366f1" /></div>;
  }

  if (!token) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.some(role => user?.role?.includes(role))) {
    // User role not authorized
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
