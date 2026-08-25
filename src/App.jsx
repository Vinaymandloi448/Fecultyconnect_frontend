/**
 * App root component
 *
 * Thin — delegates routing to AppRouter and providers to AppProviders.
 */

import AppRouter from './app/routes/AppRouter';

export default function App() {
  return <AppRouter />;
}