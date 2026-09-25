/**
 * Environment configuration
 *
 * Centralises all environment variables so the rest of the app
 * imports from here instead of reading import.meta.env directly.
 */

const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws',
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

export default env;
