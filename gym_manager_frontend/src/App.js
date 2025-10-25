import React, { useState, useEffect } from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';

// PUBLIC_INTERFACE
function App() {
  /**
   * Temporary theme state and side effect to showcase theme switching
   * until global state management is introduced.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <AppRoutes />
    </div>
  );
}

export default App;
