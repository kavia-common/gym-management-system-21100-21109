import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../App.css';

/**
 * AuthLayout provides a minimal layout for unauthenticated routes like Login and Register.
 * It centers the form content and provides basic navigation between auth pages.
 */
export default function AuthLayout() {
  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'var(--bg-primary)',
        border: `1px solid var(--border-color)`,
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        padding: 24
      }}>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Gym Manager</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>Welcome back</p>
        </div>
        <Outlet />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/login" className="App-link" style={{ marginRight: 12 }}>Login</Link>
          <Link to="/register" className="App-link">Register</Link>
        </div>
      </div>
    </div>
  );
}
