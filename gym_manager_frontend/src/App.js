import React from 'react';
import './App.css';
import './styles/theme.css';
import AppRoutes from './routes/AppRoutes';

/**
 * PUBLIC_INTERFACE
 * App - root component mounting the route tree.
 */
function App() {
  return (
    <div className="app-shell">
      <AppRoutes />
    </div>
  );
}

export default App;
