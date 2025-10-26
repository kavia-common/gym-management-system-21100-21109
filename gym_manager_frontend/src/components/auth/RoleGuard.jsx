import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PUBLIC_INTERFACE
 * RoleGuard - Renders children only if the current user's role is one of the allowed roles
 * AND, for trainer routes, the profile status must be 'active'.
 *
 * Props:
 * - allow: string[] - list of allowed roles (e.g., ['owner'])
 */
export default function RoleGuard({ allow = [], children }) {
  const role = useSelector((s) => s.auth.user?.role);
  const status = useSelector((s) => s.auth.user?.status);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allow.includes(role);

  // Block trainers with non-active status
  if (isAllowed && role === 'trainer' && status && status !== 'active') {
    // Redirect to login with message handled in Login or show a pending note route if available
    return <Navigate to="/login" replace state={{ msg: 'Trainer account pending approval. Access is restricted until approved.' }} />;
  }

  if (isAllowed) return children;

  if (role === 'owner') return <Navigate to="/owner" replace />;
  if (role === 'trainer') return <Navigate to="/trainer" replace />;
  if (role === 'member') return <Navigate to="/member" replace />;

  return <Navigate to="/login" replace />;
}
