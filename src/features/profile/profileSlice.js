/**
 * Profile Redux slice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profileData = action.payload;
    },
    setProfileLoading(state, action) {
      state.isLoading = action.payload;
    },
    setProfileError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setProfile, setProfileLoading, setProfileError } =
  profileSlice.actions;

export default profileSlice.reducer;
