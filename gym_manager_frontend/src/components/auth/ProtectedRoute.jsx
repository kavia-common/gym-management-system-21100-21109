import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute - Guards routes that require authentication.
 * If no token is present, redirects to /login preserving the original location in state.from.
 */
export default function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();

  if (!token) {
    // Redirect unauthenticated users to login page with the intended path
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
