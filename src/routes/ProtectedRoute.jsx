import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ allowedRoles }) {
  const { state: { isAuthenticated, user } } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they try to access an unauthorized route
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                         user.role === 'delivery' ? '/delivery/dashboard' : '/customer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
