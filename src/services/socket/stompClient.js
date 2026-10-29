/**
 * Spring STOMP WebSocket Client
 *
 * Implements native Spring STOMP connection using @stomp/stompjs.
 * Connects to ws://localhost:8080/ws with JWT Bearer authentication.
 *
 * STOMP Specifications:
 * - CONNECT header: "Authorization: Bearer <token>"
 * - Send destination: "/app/chat.send" with body { conversationId, content }
 * - Subscription topic: "/topic/conversation/{conversationId}"
 */

import { Client } from '@stomp/stompjs';
import env from '../../config/env';

let stompClient = null;
const activeSubscriptions = new Map();

/**
 * Initialize and activate STOMP connection
 * @param {string} token - Valid JWT token
 * @param {Function} onConnected - Optional callback when connection established
 * @param {Function} onError - Optional error callback
 */
export const connectStomp = (token, onConnected, onError) => {
  if (stompClient && stompClient.active) {
    if (onConnected) onConnected();
    return stompClient;
  }

  const wsUrl = env.WS_URL || 'ws://localhost:8080/ws';

  stompClient = new Client({
    brokerURL: wsUrl,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      if (env.IS_DEV) {
        console.debug('[STOMP]', str);
      }
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    if (env.IS_DEV) {
      console.log('[STOMP] Connected successfully to Spring Boot broker:', frame);
    }
    if (onConnected) onConnected(frame);
  };

  stompClient.onStompError = (frame) => {
    console.error('[STOMP] Broker error:', frame.headers['message'], frame.body);
    if (onError) onError(frame);
  };

  stompClient.onWebSocketError = (event) => {
    console.error('[STOMP] WebSocket transport error:', event);
    if (onError) onError(event);
  };

  stompClient.onDisconnect = () => {
    if (env.IS_DEV) {
      console.log('[STOMP] Disconnected from Spring Boot broker');
    }
    activeSubscriptions.clear();
  };

  stompClient.activate();
  return stompClient;
};

/**
 * Returns current STOMP client
 */
export const getStompClient = () => stompClient;

/**
 * Subscribe to a specific conversation's topic
 * @param {string} conversationId - The conversation ID
 * @param {Function} onMessage - Callback receiving parsed MessageResponse
 * @returns {Function} Unsubscribe function
 */
export const subscribeToConversation = (conversationId, onMessage) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('[STOMP] Cannot subscribe: client not connected');
    return () => {};
  }

  const topic = `/topic/conversation/${conversationId}`;

  // Unsubscribe previous subscription to avoid double handlers
  if (activeSubscriptions.has(topic)) {
    try {
      activeSubscriptions.get(topic).unsubscribe();
    } catch (e) {
      console.debug('[STOMP] Cleanup existing sub error:', e);
    }
    activeSubscriptions.delete(topic);
  }

  try {
    const subscription = stompClient.subscribe(topic, (message) => {
      try {
        const body = JSON.parse(message.body);
        if (env.IS_DEV) {
          console.log('[STOMP] Incoming message on topic', topic, body);
        }
        if (onMessage) {
          onMessage(body);
        }
      } catch (err) {
        console.error('[STOMP] Failed to parse message frame body:', err);
      }
    });

    activeSubscriptions.set(topic, subscription);

    return () => {
      try {
        subscription.unsubscribe();
        activeSubscriptions.delete(topic);
      } catch (err) {
        console.debug('[STOMP] Error during unsubscribe:', err);
      }
    };
  } catch (err) {
    console.error('[STOMP] Error subscribing to', topic, err);
    return () => {};
  }
};

/**
 * Send real-time chat message over STOMP
 * @param {string} conversationId - The target conversation ID
 * @param {string} content - Message text content
 * @returns {boolean} Whether publish was initiated
 */
export const sendStompMessage = (conversationId, content) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('[STOMP] Client not connected; cannot send via STOMP');
    return false;
  }

  try {
    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        conversationId,
        content,
      }),
    });
    return true;
  } catch (err) {
    console.error('[STOMP] Failed to publish message:', err);
    return false;
  }
};

/**
 * Disconnect and cleanup STOMP client
 */
export const disconnectStomp = () => {
  if (stompClient) {
    try {
      activeSubscriptions.clear();
      stompClient.deactivate();
    } catch (e) {
      console.debug('[STOMP] Error during deactivate:', e);
    }
    stompClient = null;
  }
};
