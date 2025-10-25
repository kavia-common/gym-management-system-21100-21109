import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Simple placeholder Register page.
 * Replace with real form and registration handling later.
 */
export default function Register() {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Register</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Create your Gym Manager account.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="theme-toggle" style={{ position: 'static' }} aria-label="Register button">
          Sign Up
        </button>
        <Link to="/login" className="App-link" style={{ alignSelf: 'center' }}>Already have an account?</Link>
      </div>
    </div>
  );
}
