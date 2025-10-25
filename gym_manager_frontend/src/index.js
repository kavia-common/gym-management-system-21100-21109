import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { store } from './state/store';
import { config } from './config';

async function enableMocksIfNeeded() {
  if (config.useMocks) {
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

async function bootstrap() {
  await enableMocksIfNeeded();

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

bootstrap();
