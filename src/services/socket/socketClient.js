/**
 * Socket.IO client — kept completely separate from Axios
 *
 * Lazy-initialised: call `connectSocket(token)` after login,
 * `disconnectSocket()` on logout.
 */

import { io } from 'socket.io-client';
import env from '../../config/env';

let socket = null;

/**
 * Open a Socket.IO connection (idempotent).
 * @param {string} token – JWT or session token to authenticate the socket
 * @returns {import('socket.io-client').Socket}
 */
export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(env.SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  });

  socket.on('connect', () => {
    if (env.IS_DEV) console.log('[socket] connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    if (env.IS_DEV) console.log('[socket] disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    if (env.IS_DEV) console.error('[socket] connection error:', err.message);
  });

  return socket;
};

/**
 * Returns the current socket instance (may be null).
 */
export const getSocket = () => socket;

/**
 * Gracefully close the connection.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
