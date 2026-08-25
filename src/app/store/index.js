/**
 * Redux store configuration
 *
 * Import and register each feature slice here as the app grows.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // chat:          chatReducer,
    // groups:        groupsReducer,
    // documents:     documentsReducer,
    // announcements: announcementsReducer,
    // notifications: notificationsReducer,
    // profile:       profileReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
