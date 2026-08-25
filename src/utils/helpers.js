/**
 * Utility helpers
 *
 * Pure functions with no side-effects. Keep this file lean;
 * create new files (dateUtils.js, stringUtils.js, etc.) when
 * a category grows beyond ~10 functions.
 */

/**
 * Conditionally join class names (tiny clsx alternative).
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr, locale = 'en-IN') {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(str, maxLength = 80) {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}
