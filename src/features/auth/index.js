/**
 * Auth feature barrel export
 */

export { default as authReducer } from './authSlice';
export { login, register, loadUser, logout, clearError } from './authSlice';
export { loginUser, registerUser, fetchCurrentUser } from './authService';
