/**
 * Auth API service
 *
 * All auth-related HTTP calls go through this file.
 * Uses the centralised Axios instance and API constants.
 */

import axiosInstance from '../../services/api/axiosInstance';
import { AUTH_ENDPOINTS } from '../../constants/api';

export const loginUser = (credentials) =>
  axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);

export const registerUser = (userData) =>
  axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);

export const logoutUser = () =>
  axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);

export const refreshToken = () =>
  axiosInstance.post(AUTH_ENDPOINTS.REFRESH);
