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
      if (!error.response || error.code === 'ERR_NETWORK') {
        return rejectWithValue(
          'Cannot connect to backend server at http://localhost:8080. Please verify the Spring Boot service is running.',
        );
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
      if (!error.response || error.code === 'ERR_NETWORK') {
        return rejectWithValue(
          'Cannot connect to backend server at http://localhost:8080. Please verify the Spring Boot service is running.',
        );
      }

      let message = 'Registration failed. Please check the provided details.';
      if (typeof error.response?.data?.error === 'string') {
        message = error.response.data.error;
      } else if (typeof error.response?.data?.message === 'string') {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        if (Array.isArray(error.response.data.errors)) {
          message = error.response.data.errors
            .map((e) => (typeof e === 'string' ? e : e.defaultMessage || JSON.stringify(e)))
            .join(', ');
        } else if (typeof error.response.data.errors === 'object') {
          message = Object.entries(error.response.data.errors)
            .map(([field, err]) => `${field}: ${err}`)
            .join(', ');
        }
      }
      return rejectWithValue(message);
    }
  },
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const isMock = localStorage.getItem('isMockAuth') === 'true';

    if (!token) {
      return rejectWithValue({ isUnauthorized: true, message: 'No token found' });
    }

    if (isMock || token.startsWith('mock-')) {
      const user = savedUser || MOCK_CURRENT_USER;
      return { user, isMock: true };
    }

    try {
      const response = await fetchCurrentUser();
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return { user, isMock: false };
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isMockAuth');
        return rejectWithValue({
          isUnauthorized: true,
          message: 'Session expired. Please log in again.',
        });
      }

      // Do not clear token or log out users on unrelated errors (e.g. temporary network failure)
      return rejectWithValue({
        isUnauthorized: false,
        message: 'Could not connect to verify session. Preserving offline credentials.',
      });
    }
  },
);


// ── Slice ────────────────────────────────────────────────────────

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!(savedToken && savedUser),
  isMockAuth: savedIsMock,
  isLoading: !!savedToken,
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
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload?.isUnauthorized) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = action.payload.message;
        } else {
          // If session verification failed due to network error, do not log user out
          state.error = action.payload?.message || null;
        }
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
