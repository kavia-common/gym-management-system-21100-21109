import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentRole } from '../../lib/authStub';

/**
 * PUBLIC_INTERFACE
 * RoleGuard - In stub mode, defaults to allowing access when role is unknown.
 * If role exists and is not allowed, redirects to the user's default dashboard.
 *
 * Props:
 * - allow: string[] - list of allowed roles (e.g., ['owner'])
 */
export default function RoleGuard({ allow = [], children }) {
  const reduxRole = useSelector((s) => s.auth.user?.role);
  const role = reduxRole || getCurrentRole();

  if (!role) {
    // No role available (stub): allow access to avoid blocking navigation
    return children;
  }

  const isAllowed = allow.includes(role);

  if (isAllowed) return children;

  // Redirect to appropriate dashboard when role isn't permitted
  if (role === 'owner') return <Navigate to="/owner" replace />;
  if (role === 'trainer') return <Navigate to="/trainer" replace />;
  if (role === 'member') return <Navigate to="/member" replace />;

  // Unknown role fallback: allow
  return children;
}
