import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Dashboard is a placeholder protected page.
 */
export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#111827' }}>Dashboard</h2>
      <p style={{ color: '#374151' }}>Welcome, {user?.email}</p>
      <button
        onClick={() => signOut()}
        style={{
          padding: '10px 14px',
          backgroundColor: '#EF4444',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
    </div>
  );
}
