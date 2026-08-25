/**
 * AppLayout — wraps all authenticated pages
 *
 * Provides the sidebar + top navbar shell with an <Outlet /> for page content.
 * Sidebar, Navbar, etc. will be built as separate components inside components/layout/.
 */

import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/layout/Sidebar';
// import Navbar  from '../components/layout/Navbar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* <Sidebar /> */}

      <div className="flex flex-1 flex-col">
        {/* <Navbar /> */}

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
