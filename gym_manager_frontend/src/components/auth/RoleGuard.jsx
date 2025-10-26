import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PUBLIC_INTERFACE
 * RoleGuard - Renders children only if the current user's role is one of the allowed roles.
 * Relies on role stored in Redux from Supabase user metadata.
 *
 * Props:
 * - allow: string[] - list of allowed roles (e.g., ['owner'])
 */
export default function RoleGuard({ allow = [], children }) {
  const role = useSelector((s) => s.auth.user?.role);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allow.includes(role);

  if (isAllowed) return children;

  if (role === 'owner') return <Navigate to="/owner" replace />;
  if (role === 'trainer') return <Navigate to="/trainer" replace />;
  if (role === 'member') return <Navigate to="/member" replace />;

  return <Navigate to="/login" replace />;
}
