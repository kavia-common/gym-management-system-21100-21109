import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PUBLIC_INTERFACE
 * RoleGuard - Renders children only if the current user's role is one of the allowed roles.
 * Otherwise redirects user to their default dashboard based on their role.
 *
 * Props:
 * - allow: string[] - list of allowed roles (e.g., ['owner'])
 */
export default function RoleGuard({ allow = [], children }) {
  const role = useSelector((s) => s.auth.user?.role);

  if (!role) {
    // If no role yet (should usually be handled by ProtectedRoute), deny access.
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allow.includes(role);

  if (isAllowed) return children;

  // Redirect to appropriate dashboard when role isn't permitted
  if (role === 'owner') return <Navigate to="/owner" replace />;
  if (role === 'trainer') return <Navigate to="/trainer" replace />;
  if (role === 'member') return <Navigate to="/member" replace />;

  // Unknown role fallback
  return <Navigate to="/login" replace />;
}
