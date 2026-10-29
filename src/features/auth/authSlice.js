/**
 * Auth Redux slice
 *
 * Manages authentication state: user info, JWT token, loading/error states.
 * Fully supports Spring Boot backend and development mock authentication.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, fetchCurrentUser } from './authService';
import { MOCK_CURRENT_USER } from '../../data/mockData';

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
const savedIsMock = localStorage.getItem('isMockAuth') === 'true';

// ── Async thunks ─────────────────────────────────────────────────

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      const { token, faculty } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(faculty));
      localStorage.removeItem('isMockAuth');

      return { token, user: faculty, isMock: false };
    } catch (error) {
      // If backend is unreachable or connection refused, allow dev fallback
      const isNetworkError = !error.response || error.code === 'ERR_NETWORK';
      if (isNetworkError) {
        // Fallback to mock faculty login for development
        const mockUser = {
          ...MOCK_CURRENT_USER,
          email: credentials.email || MOCK_CURRENT_USER.email,
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('isMockAuth', 'true');
        return { token: mockToken, user: mockUser, isMock: true };
      }

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Authentication failed. Please verify your credentials.';
      return rejectWithValue(message);
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      return response.data;
    } catch (error) {
      const isNetworkError = !error.response || error.code === 'ERR_NETWORK';
      if (isNetworkError) {
        // Mock successful registration in dev mode
        return {
          id: 'fac-' + Date.now().toString().slice(-4),
          ...userData,
          status: 'online',
          initials: userData.fullName
            ? userData.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            : 'FC',
        };
      }

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Registration failed. Please check the provided details.';
      return rejectWithValue(message);
    }
  },
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const isMock = localStorage.getItem('isMockAuth') === 'true';

    if (isMock || (token && token.startsWith('mock-'))) {
      const user = savedUser || MOCK_CURRENT_USER;
      return { user, isMock: true };
    }

    try {
      const response = await fetchCurrentUser();
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return { user, isMock: false };
    } catch {
      // In dev mode, preserve mock session if present
      if (savedUser) {
        return { user: savedUser, isMock: true };
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isMockAuth');
      return rejectWithValue('Session expired');
    }
  },
);

// ── Slice ────────────────────────────────────────────────────────

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!(savedToken && savedUser),
  isMockAuth: savedIsMock,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginWithMock(state, action) {
      const user = action.payload || MOCK_CURRENT_USER;
      const mockToken = 'mock-jwt-token-quick';
      state.user = user;
      state.token = mockToken;
      state.isAuthenticated = true;
      state.isMockAuth = true;
      state.error = null;
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isMockAuth', 'true');
    },
    updateProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    updateUserStatus(state, action) {
      if (state.user) {
        state.user.status = action.payload.status;
        if (action.payload.statusText !== undefined) {
          state.user.statusText = action.payload.statusText;
        }
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isMockAuth = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isMockAuth');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isMockAuth = action.payload.isMock;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Load user
    builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isMockAuth = action.payload.isMock;
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

export const {
  loginWithMock,
  updateProfile,
  updateUserStatus,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
