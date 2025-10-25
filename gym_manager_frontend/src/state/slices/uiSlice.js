import { createSlice } from '@reduxjs/toolkit';

// PUBLIC_INTERFACE
export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    globalLoading: false,
    modal: null, // { id, props }
    notifications: [], // [{ id, type, message }]
  },
  reducers: {
    // PUBLIC_INTERFACE
    setTheme(state, action) {
      state.theme = action.payload || 'light';
    },
    // PUBLIC_INTERFACE
    showGlobalLoading(state) {
      state.globalLoading = true;
    },
    // PUBLIC_INTERFACE
    hideGlobalLoading(state) {
      state.globalLoading = false;
    },
    // PUBLIC_INTERFACE
    openModal(state, action) {
      state.modal = action.payload || null;
    },
    // PUBLIC_INTERFACE
    closeModal(state) {
      state.modal = null;
    },
    // PUBLIC_INTERFACE
    pushNotification(state, action) {
      const notif = action.payload;
      if (notif) state.notifications.push({ id: Date.now(), ...notif });
    },
    // PUBLIC_INTERFACE
    removeNotification(state, action) {
      const id = action.payload;
      state.notifications = state.notifications.filter((n) => n.id !== id);
    },
  },
});

export const {
  setTheme,
  showGlobalLoading,
  hideGlobalLoading,
  openModal,
  closeModal,
  pushNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
