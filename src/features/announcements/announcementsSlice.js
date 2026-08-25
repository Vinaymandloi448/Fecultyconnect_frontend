/**
 * Announcements Redux slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  announcements: [],
  isLoading: false,
  error: null,
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setAnnouncements(state, action) {
      state.announcements = action.payload;
    },
    setAnnouncementsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setAnnouncementsError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setAnnouncements, setAnnouncementsLoading, setAnnouncementsError } =
  announcementsSlice.actions;

export default announcementsSlice.reducer;
