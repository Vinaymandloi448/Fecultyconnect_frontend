/**
 * Spring STOMP WebSocket Client
 *
 * Implements native Spring STOMP connection using @stomp/stompjs.
 * Connects via the Vite proxy (/ws) or direct backend URL with JWT Bearer authentication.
 *
 * STOMP Specifications:
 * - CONNECT header: "Authorization: Bearer <token>"
 * - Send destination: "/app/chat.send" with body { conversationId, content }
 * - Subscription topic: "/topic/conversation/{conversationId}"
 */

import { Client } from '@stomp/stompjs';
import env from '../../config/env';

let stompClient = null;
const activeSubscriptions = new Map(); // topic -> { subscription, onMessage }
const connectionListeners = new Set();
let isCurrentlyConnected = false;

/**
 * Resolves broker WebSocket URL dynamically:
 * - If VITE_WS_URL is provided, use it
 * - In browser environment, use relative WebSocket URL via Vite proxy: ws(s)://<host>/ws
 * - Fallback to ws://localhost:8080/ws
 */
export const getBrokerUrl = () => {
  if (import.meta.env?.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }
  return env.WS_URL || 'ws://localhost:8080/ws';
};

const notifyConnectionListeners = (connected) => {
  isCurrentlyConnected = connected;
  connectionListeners.forEach((listener) => {
    try {
      listener(connected);
    } catch (e) {
      console.debug('[STOMP] Listener callback error:', e);
    }
  });
};

export const isStompConnected = () => Boolean(stompClient && stompClient.connected);

/**
 * Add a connection state listener (called on connect / disconnect)
 */
export const addConnectionListener = (listener) => {
  connectionListeners.add(listener);
  // Immediately notify with current real connected status
  listener(isStompConnected());
  return () => connectionListeners.delete(listener);
};

export const removeConnectionListener = (listener) => {
  connectionListeners.delete(listener);
};

/**
 * Initialize and activate STOMP connection
 * @param {string} token - Valid JWT token
 * @param {Function} onConnected - Optional callback when connection established
 * @param {Function} onError - Optional error callback
 */
export const connectStomp = (token, onConnected, onError) => {
  if (stompClient && stompClient.active) {
    if (onConnected && isStompConnected()) onConnected();
    return stompClient;
  }

  const wsUrl = getBrokerUrl();

  stompClient = new Client({
    brokerURL: wsUrl,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      if (env.IS_DEV) {
        // Redact JWT token from all debug logs to protect credentials
        const sanitized = str.replace(/Bearer\s+[A-Za-z0-9-_=.]+/gi, 'Bearer [REDACTED]');
        console.debug('[STOMP]', sanitized);
      }
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    if (env.IS_DEV) {
      console.log('[STOMP] Connected successfully to Spring Boot broker via', wsUrl);
    }
    notifyConnectionListeners(true);
    if (onConnected) onConnected(frame);

    // Re-subscribe any active topics upon reconnection
    activeSubscriptions.forEach((info, topic) => {
      try {
        const sub = stompClient.subscribe(topic, (message) => {
          try {
            const body = JSON.parse(message.body);
            if (info.onMessage) info.onMessage(body);
          } catch (err) {
            console.error('[STOMP] Message parse error:', err);
          }
        });
        info.subscription = sub;
      } catch (err) {
        console.error('[STOMP] Re-subscribe error for', topic, err);
      }
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('[STOMP] Broker error:', frame.headers?.['message'], frame.body);
    notifyConnectionListeners(false);
    if (onError) onError(frame);
  };

  stompClient.onWebSocketError = (event) => {
    console.error('[STOMP] WebSocket transport error:', event);
    notifyConnectionListeners(false);
    if (onError) onError(event);
  };

  stompClient.onDisconnect = () => {
    if (env.IS_DEV) {
      console.log('[STOMP] Disconnected from Spring Boot broker');
    }
    notifyConnectionListeners(false);
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
  if (!conversationId) return () => {};

  const topic = `/topic/conversation/${conversationId}`;

  // Unsubscribe previous subscription on this topic if exists
  if (activeSubscriptions.has(topic)) {
    try {
      const prev = activeSubscriptions.get(topic);
      if (prev.subscription) prev.subscription.unsubscribe();
    } catch (e) {
      console.debug('[STOMP] Cleanup existing sub error:', e);
    }
    activeSubscriptions.delete(topic);
  }

  let subscription = null;

  if (stompClient && stompClient.connected) {
    try {
      subscription = stompClient.subscribe(topic, (message) => {
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
    } catch (err) {
      console.error('[STOMP] Error subscribing to', topic, err);
    }
  }

  // Register in active subscriptions map so onConnect can resubscribe if needed
  activeSubscriptions.set(topic, { subscription, onMessage });

  return () => {
    try {
      const active = activeSubscriptions.get(topic);
      if (active?.subscription) {
        active.subscription.unsubscribe();
      }
      activeSubscriptions.delete(topic);
    } catch (err) {
      console.debug('[STOMP] Error during unsubscribe:', err);
    }
  };
};

/**
 * Send real-time chat message over STOMP (/app/chat.send)
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
      activeSubscriptions.forEach((info) => {
        try {
          if (info.subscription) info.subscription.unsubscribe();
        } catch (e) {
          console.debug('[STOMP] Cleanup error on deactivate:', e);
        }
      });
      activeSubscriptions.clear();
      stompClient.deactivate();
    } catch (e) {
      console.debug('[STOMP] Error during deactivate:', e);
    }
    stompClient = null;
    notifyConnectionListeners(false);
  }
};
