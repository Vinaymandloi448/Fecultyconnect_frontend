/**
 * Auth Redux slice
 *
 * Manages authentication state: user info, tokens, loading/error states.
 * Async thunks for login/register/logout will be added here.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
    setAuthLoading(state, action) {
      state.isLoading = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  // extraReducers: (builder) => {
  //   Add async thunk cases here (login, register, etc.)
  // },
});

export const { setCredentials, clearCredentials, setAuthLoading, setAuthError } =
  authSlice.actions;

export default authSlice.reducer;
