import React from 'react';

/**
 * TopNav is a placeholder top navigation bar for the application.
 * Replace with actual navigation, profile menu, and quick actions later.
 */
export default function TopNav() {
  return (
    <header style={{
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'var(--bg-primary)',
      borderBottom: `1px solid var(--border-color)`
    }}>
      <div style={{ fontWeight: 700 }}>Gym Manager</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>TopNav Placeholder</div>
    </header>
  );
}
