/**
 * useSocket — hook to access the Socket.IO client inside React components
 *
 * Connects on mount (if authenticated), disconnects on unmount.
 */

import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket/socketClient';
import useAuth from './useAuth';

export default function useSocket() {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketRef.current = connectSocket(token);
    }

    return () => {
      // Only disconnect if this is the last consumer.
      // For a simple app a global connect/disconnect on login/logout is better;
      // this hook is provided as a convenience.
    };
  }, [isAuthenticated, token]);

  return getSocket();
}
