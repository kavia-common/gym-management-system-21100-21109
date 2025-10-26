import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../components/layout/TopNav';
import SideNav from '../components/layout/SideNav';
import EnvBanner from '../components/ui/EnvBanner';
import '../App.css';
import '../styles/theme.css';

/**
 * MainLayout provides the application shell for authenticated areas.
 * Now uses Ocean Professional theme classes.
 */
export default function MainLayout() {
  return (
    <div className="app-shell" style={{ minHeight: '100vh' }}>
      {/* Global environment warning banner */}
      <EnvBanner />
      <TopNav />
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 'calc(100vh - 56px)' }}>
        <SideNav />
        <main style={{ flex: 1, padding: 24, background: 'var(--color-bg)' }}>
          <div
            className="u-surface"
            style={{ margin: '0 auto', maxWidth: 1200, padding: 24, boxShadow: 'var(--shadow-md)' }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
