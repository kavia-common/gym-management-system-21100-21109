import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/theme.css';

/**
 * SideNav aligned with Ocean Professional theme.
 * - Collapsible on desktop (collapsed state narrows width)
 * - Slide-over on mobile (open overlays content)
 */
export default function SideNav() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  // Toggle handler from TopNav hamburger (mobile)
  useEffect(() => {
    const fn = () => setOpen((v) => !v);
    window.addEventListener('toggle-sidenav', fn);
    return () => window.removeEventListener('toggle-sidenav', fn);
  }, []);

  // Close on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/owner', label: 'Owner Dashboard', icon: '🏛️' },
    { to: '/trainer', label: 'Trainer Dashboard', icon: '🏋️' },
    { to: '/member', label: 'Member Dashboard', icon: '🧑‍🤝‍🧑' },
  ];

  return (
    <>
      <aside
        className={`sidenav ${collapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}
        aria-label="Sidebar navigation"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
            {collapsed ? 'GM' : 'Modules'}
          </span>
          <button
            className="btn btn-ghost"
            style={{ padding: '6px 8px' }}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>
        <nav style={{ paddingTop: 4 }}>
          {links.map((l) => {
            const active = location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={active ? 'active' : undefined}
                title={collapsed ? l.label : undefined}
                aria-current={active ? 'page' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span aria-hidden="true">{l.icon}</span>
                {!collapsed && <span>{l.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      {/* Mobile overlay */}
      {open && <div className="content-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  );
}
