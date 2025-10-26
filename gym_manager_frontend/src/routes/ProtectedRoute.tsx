import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute guards routes from unauthenticated access.
 * It renders children or <Outlet /> when authenticated; otherwise redirects to /login.
 */
export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
