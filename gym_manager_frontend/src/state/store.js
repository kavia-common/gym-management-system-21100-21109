import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

/**
 * PUBLIC_INTERFACE
 * configureAppStore - Creates and returns the configured Redux store.
 */
export function configureAppStore(preloadedState) {
  /** This function sets up the Redux store with the available slices. */
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
    },
    preloadedState,
    // Default middleware from RTK is sufficient. We can customize later if needed.
    devTools: process.env.NODE_ENV !== 'production',
  });
}

// PUBLIC_INTERFACE
export const store = configureAppStore();
