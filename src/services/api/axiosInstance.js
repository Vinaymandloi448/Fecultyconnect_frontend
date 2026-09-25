/**
 * Axios instance — single configured client for the entire app
 *
 * Features:
 *  - base URL from env config
 *  - request interceptor  → attaches JWT Bearer token
 *  - response interceptor → handles 401s globally (redirect to login)
 */

import axios from 'axios';
import env from '../../config/env';

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ──────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth state and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if not already on auth pages
      const { pathname } = window.location;
      if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
