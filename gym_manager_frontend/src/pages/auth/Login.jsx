import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Simple placeholder Login page.
 * Replace with real form and auth handling later.
 */
export default function Login() {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Enter your credentials to access your dashboard.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="theme-toggle" style={{ position: 'static' }} aria-label="Login button">
          Sign In
        </button>
        <Link to="/register" className="App-link" style={{ alignSelf: 'center' }}>Create an account</Link>
      </div>
    </div>
  );
}
