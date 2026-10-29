/**
 * useStomp — React hook for Spring STOMP WebSocket connection
 *
 * Automatically manages connection lifecycle based on authentication state,
 * exposes reactive connection status, and provides convenient subscription & sending helpers.
 */

import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  connectStomp,
  disconnectStomp,
  subscribeToConversation,
  sendStompMessage,
  addConnectionListener,
  isStompConnected,
} from '../services/socket/stompClient';
import { messageReceived } from '../features/chat/chatSlice';

export default function useStomp() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [isConnected, setIsConnected] = useState(() => isStompConnected());

  // Listen to STOMP connection state changes
  useEffect(() => {
    const unsubscribeListener = addConnectionListener((connected) => {
      setIsConnected(connected);
    });
    return () => {
      unsubscribeListener();
    };
  }, []);

  // Manage client lifecycle based on user authentication token
  useEffect(() => {
    const effectiveToken = token || localStorage.getItem('token');
    if (effectiveToken && !effectiveToken.startsWith('mock-')) {
      connectStomp(effectiveToken);
    } else if (!effectiveToken) {
      setIsConnected(false);
      disconnectStomp();
    }
  }, [token, isAuthenticated]);

  /**
   * Subscribe to conversation topic (/topic/conversation/{conversationId})
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
   * Send chat message via STOMP (/app/chat.send)
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
