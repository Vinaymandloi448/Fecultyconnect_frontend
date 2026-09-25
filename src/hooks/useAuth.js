/**
 * useAuth — convenience hook to access auth state and dispatch auth actions
 */

import { useSelector, useDispatch } from 'react-redux';
import { login, register, loadUser, logout, clearError } from '../features/auth/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    login: (credentials) => dispatch(login(credentials)),
    register: (userData) => dispatch(register(userData)),
    loadUser: () => dispatch(loadUser()),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
}
