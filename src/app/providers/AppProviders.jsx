/**
 * AppProviders — wraps the entire app with all required context providers
 *
 * Keeps main.jsx clean by centralising Provider nesting here.
 * Also dispatches loadUser on mount to restore auth after page refresh.
 */

import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../store';
import { loadUser } from '../../features/auth/authSlice';

/**
 * Inner component that has access to Redux dispatch (must be inside Provider).
 * Validates the stored JWT on mount by calling GET /api/profile/me.
 */
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </BrowserRouter>
    </Provider>
  );
}
