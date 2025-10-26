import { createSlice } from '@reduxjs/toolkit';

/**
 * Shape of auth state:
 * {
 *   user: { id, name, role, ... } | null,
 *   token: string | null,
 *   status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *   error: string | null
 * }
 */

// PUBLIC_INTERFACE
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // PUBLIC_INTERFACE
    startAuth(state) {
      state.status = 'loading';
      state.error = null;
    },
    // PUBLIC_INTERFACE
    authSuccess(state, action) {
      const { user, token } = action.payload || {};
      state.user = user || null;
      state.token = token || null;
      state.status = 'succeeded';
      state.error = null;
      try {
        window.localStorage.setItem('gm.auth.redux', JSON.stringify({ user, token }));
      } catch {
        // ignore storage errors
      }
    },
    // PUBLIC_INTERFACE
    authFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload || 'Authentication failed';
    },
    // PUBLIC_INTERFACE
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      try {
        window.localStorage.removeItem('gm.auth.redux');
      } catch {
        // ignore
      }
    },
    // PUBLIC_INTERFACE
    setToken(state, action) {
      state.token = action.payload || null;
    },
  },
});

export const { startAuth, authSuccess, authFailure, logout, setToken } = authSlice.actions;

export default authSlice.reducer;
