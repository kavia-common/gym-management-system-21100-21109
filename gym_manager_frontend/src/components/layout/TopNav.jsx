import React from 'react';
import '../../styles/theme.css';

/**
 * TopNav aligned with Ocean Professional theme.
 * Includes a hamburger to toggle the responsive sidebar (dispatches 'toggle-sidenav' event).
 */
export default function TopNav() {
  const toggleSidenav = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidenav'));
  };

  return (
    <header className="topnav u-gradient-soft">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          aria-label="Toggle menu"
          onClick={toggleSidenav}
          className="btn btn-ghost"
          style={{ padding: '6px 10px' }}
        >
          ☰
        </button>
        <div className="topnav-brand">Gym Manager</div>
      </div>
      <div className="topnav-actions">
        <span>Welcome</span>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-secondary)' }} />
      </div>
    </header>
  );
}
