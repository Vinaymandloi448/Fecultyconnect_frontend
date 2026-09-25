/**
 * Auth Redux slice
 *
 * Manages authentication state: user info, JWT token, loading/error states.
 *
 * Async thunks:
 *   login    → POST /api/auth/login    → saves JWT + user
 *   register → POST /api/auth/register → saves user (auto-login after register)
 *   loadUser → GET  /api/profile/me    → restores auth after page refresh
 *   logout   → clears localStorage + state (no backend call — no endpoint)
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, fetchCurrentUser } from './authService';

// ── Helpers ──────────────────────────────────────────────────────

const savedToken = localStorage.getItem('token') || null;
const savedUser = (() => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

// ── Async thunks ─────────────────────────────────────────────────

/**
 * Login thunk.
 *
 * Backend returns: { token, tokenType, faculty }
 * We store `token` in localStorage and `faculty` as the user object.
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      const { token, faculty } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(faculty));

      return { token, user: faculty };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Login failed';
      return rejectWithValue(message);
    }
  },
);

/**
 * Register thunk.
 *
 * Backend returns: FacultyResponse (201). No JWT on register —
 * user must log in separately after registering.
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      return response.data; // FacultyResponse
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Registration failed';
      return rejectWithValue(message);
    }
  },
);

/**
 * Load user thunk — restores auth state after page refresh.
 *
 * If a token exists in localStorage, we call GET /api/profile/me
 * to verify it's still valid and get fresh user data.
 */
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCurrentUser();
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired');
    }
  },
);

// ── Slice ────────────────────────────────────────────────────────

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!(savedToken && savedUser),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logout — purely client-side.
     * The backend has no /logout endpoint; we just clear local state.
     */
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Register ──
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // No auto-login: user must log in after registration
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Load user (refresh restoration) ──
    builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
