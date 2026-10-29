/**
 * useStomp — React hook for Spring STOMP WebSocket connection
 *
 * Automatically manages connection lifecycle based on authentication state,
 * exposes status, and provides convenient subscription & sending helpers.
 */

import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  connectStomp,
  disconnectStomp,
  subscribeToConversation,
  sendStompMessage,
  getStompClient,
} from '../services/socket/stompClient';
import { messageReceived } from '../features/chat/chatSlice';

export default function useStomp() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token && !token.startsWith('mock-')) {
      const client = connectStomp(
        token,
        () => setIsConnected(true),
        () => setIsConnected(false),
      );

      // Periodically check if connected
      const checkInterval = setInterval(() => {
        const c = getStompClient();
        setIsConnected(Boolean(c && c.connected));
      }, 2000);

      return () => {
        clearInterval(checkInterval);
        // Note: Keep active across route changes; disconnect only on explicit logout
      };
    } else {
      setIsConnected(false);
      disconnectStomp();
    }
  }, [isAuthenticated, token]);

  /**
   * Subscribe to conversation topic
   */
  const subscribe = useCallback(
    (conversationId) => {
      if (!conversationId) return () => {};

      return subscribeToConversation(conversationId, (incomingMessage) => {
        dispatch(messageReceived(incomingMessage));
      });
    },
    [dispatch],
  );

  /**
   * Send chat message via STOMP
   */
  const send = useCallback((conversationId, content) => {
    return sendStompMessage(conversationId, content);
  }, []);

  return {
    isConnected,
    subscribe,
    send,
  };
}
