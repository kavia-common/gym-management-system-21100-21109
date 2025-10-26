import React from 'react';
import './App.css';
import './styles/theme.css';
import AppRoutes from './routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from './state/slices/uiSlice';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header.jsx';
import EnvBanner from './components/ui/EnvBanner';

/**
 * PUBLIC_INTERFACE
 * App - root component mounting the route tree with AuthProvider and Header.
 * Configure Supabase envs in .env:
 *  - REACT_APP_SUPABASE_URL=
 *  - REACT_APP_SUPABASE_ANON_KEY=
 * Optional redirect base:
 *  - REACT_APP_SITE_URL=
 * See docs/supabase.md for details.
 */
function App() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    dispatch(setTheme(theme || 'light'));
  }, [dispatch, theme]);

  return (
    <AuthProvider>
      <Header />
      <EnvBanner />
      <div className="app-shell">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
