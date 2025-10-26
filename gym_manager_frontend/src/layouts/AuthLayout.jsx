import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import EnvBanner from '../components/ui/EnvBanner';
import '../App.css';
import '../styles/theme.css';

/**
 * AuthLayout provides a minimal layout for unauthenticated routes like Login and Register.
 * It centers the form content and provides basic navigation between auth pages.
 */
export default function AuthLayout() {
  return (
    <>
      {/* Global environment warning banner */}
      <EnvBanner />
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div className="u-surface" style={{ width: '100%', maxWidth: 440, padding: 24, boxShadow: 'var(--shadow-md)' }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 24 }}>Gym Manager</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>Welcome back</p>
          </div>
          <Outlet />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link to="/login" className="btn btn-ghost" style={{ marginRight: 8 }}>Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}
