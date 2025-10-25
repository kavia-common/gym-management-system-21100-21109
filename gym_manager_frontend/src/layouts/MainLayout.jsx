import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../components/layout/TopNav';
import SideNav from '../components/layout/SideNav';
import '../App.css';

/**
 * MainLayout provides the application shell for authenticated areas.
 * It renders a TopNav, a SideNav and a content area for nested routes via <Outlet/>.
 */
export default function MainLayout() {
  return (
    <div data-theme="light" className="app-shell" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <TopNav />
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 'calc(100vh - 56px)' }}>
        <SideNav />
        <main style={{
          flex: 1,
          padding: '24px',
          background: 'var(--bg-secondary)',
          borderLeft: `1px solid var(--border-color)`
        }}>
          <div className="container" style={{
            margin: '0 auto',
            maxWidth: 1200,
            background: 'var(--bg-primary)',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            padding: 24
          }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
