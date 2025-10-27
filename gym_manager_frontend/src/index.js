import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { store } from './state/store';
import { config } from './config';
import { authSuccess, logout } from './state/slices/authSlice';
import AuthProvider from './context/AuthContext';
import { supabase } from './lib/supabaseClient';

async function enableMocksIfNeeded() {
  // Only initialize MSW when explicitly enabled via env toggle
  if (String(process.env.REACT_APP_USE_MOCKS) === 'true' || config.useMocks === true) {
    try {
      const { worker } = await import('./mocks/browser');
      // Start the worker and allow unhandled requests to pass through
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          // Avoid SW registration issues when served from nested paths
          url: '/mockServiceWorker.js',
        },
      });
      // eslint-disable-next-line no-console
      console.info('[MSW] Mock Service Worker started (REACT_APP_USE_MOCKS=true)');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[MSW] Failed to initialize mock service worker. Proceeding without mocks.', e);
    }
  }
}

async function hydrateAuthFromSupabase() {
  // Skip in mock mode or if client is not usable
  const unusable =
    config.useMocks ||
    !supabase ||
    supabase.__noop ||
    !supabase.auth ||
    typeof supabase.auth.getSession !== 'function';

  if (unusable) {
    // eslint-disable-next-line no-console
    if (supabase?.__noop) {
      console.info('[Supabase] Skipping hydrate: no-op client (missing env).');
    }
    return;
  }

  try {
    // Read current session on load
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    const profile = session?.user;

    if (session && profile) {
      const resolvedRole =
        profile?.app_metadata?.role ||
        profile?.user_metadata?.role ||
        'member';

      store.dispatch(
        authSuccess({
          token: session.access_token || null,
          user: {
            id: profile.id,
            name: profile?.user_metadata?.name || profile?.email || 'User',
            email: profile?.email || '',
            role: resolvedRole,
          },
        })
      );
    }

    // Subscribe to auth state changes if available
    if (
      !supabase.__noop &&
      typeof supabase.auth.onAuthStateChange === 'function'
    ) {
      supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession?.user) {
          const u = newSession.user;
          const r =
            u?.app_metadata?.role ||
            u?.user_metadata?.role ||
            'member';
          store.dispatch(
            authSuccess({
              token: newSession.access_token || null,
              user: {
                id: u.id,
                name: u?.user_metadata?.name || u?.email || 'User',
                email: u?.email || '',
                role: r,
              },
            })
          );
        } else {
          // Signed out
          store.dispatch(logout());
        }
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[Supabase] Failed to hydrate session:', e?.message || e);
  }
}

async function bootstrap() {
  await enableMocksIfNeeded();
  await hydrateAuthFromSupabase();

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

bootstrap();
