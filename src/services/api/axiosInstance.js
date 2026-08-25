/**
 * Axios instance — single configured client for the entire app
 *
 * Features:
 *  - base URL from env config
 *  - request interceptor  → attaches auth token
 *  - response interceptor → handles 401s globally
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
    const token = localStorage.getItem('accessToken');
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
    // TODO: handle 401 → refresh token or redirect to login
    return Promise.reject(error);
  },
);

export default axiosInstance;
