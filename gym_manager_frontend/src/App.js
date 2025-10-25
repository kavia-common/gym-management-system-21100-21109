import React from 'react';
import './App.css';
import './styles/theme.css';
import AppRoutes from './routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from './state/slices/uiSlice';

/**
 * PUBLIC_INTERFACE
 * App - root component mounting the route tree.
 */
function App() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);

  // ensure document attribute reflects current theme (light/dark) if used later
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // simple first-run effect to ensure theme key exists
  React.useEffect(() => {
    dispatch(setTheme(theme || 'light'));
  }, [dispatch, theme]);

  return (
    <div className="app-shell">
      <AppRoutes />
    </div>
  );
}

export default App;
