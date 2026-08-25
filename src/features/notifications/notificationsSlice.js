/**
 * Notifications Redux slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
    markAsRead(state, action) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => { n.isRead = true; });
      state.unreadCount = 0;
    },
    setNotificationsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setNotificationsError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllRead,
  setNotificationsLoading,
  setNotificationsError,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
