/**
 * useAuth — convenience hook to access auth state and dispatch auth actions
 */

import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, clearCredentials } from '../features/auth/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = (payload) => dispatch(setCredentials(payload));
  const logout = () => dispatch(clearCredentials());

  return {
    ...auth,
    login,
    logout,
  };
}
