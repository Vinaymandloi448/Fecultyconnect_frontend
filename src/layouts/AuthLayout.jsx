/**
 * AuthLayout — wraps authentication pages (login, register, forgot-password)
 *
 * Renders a centred card with an <Outlet /> for the active auth page.
 * Authenticated users should be redirected away from this layout.
 */

import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-8">
        <Outlet />
      </div>
    </main>
  );
}
