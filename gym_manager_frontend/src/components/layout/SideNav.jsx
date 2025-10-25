import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * SideNav is a placeholder vertical navigation for modules.
 * Highlights the active section and provides simple links for now.
 */
export default function SideNav() {
  const location = useLocation();
  const links = [
    { to: '/owner', label: 'Owner Dashboard' },
    { to: '/trainer', label: 'Trainer Dashboard' },
    { to: '/member', label: 'Member Dashboard' },
  ];

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      borderRight: `1px solid var(--border-color)`,
      background: 'var(--bg-primary)',
      padding: 12
    }}>
      <nav>
        {links.map((l) => {
          const active = location.pathname.startsWith(l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              style={{
                display: 'block',
                padding: '10px 12px',
                marginBottom: 8,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                borderRadius: 8,
                background: active ? 'var(--bg-secondary)' : 'transparent',
                border: active ? `1px solid var(--border-color)` : '1px solid transparent',
                transition: 'all .2s ease'
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
