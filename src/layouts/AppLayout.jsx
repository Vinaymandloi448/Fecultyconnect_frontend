/**
 * AppLayout — Slack-Inspired Multi-Column Layout Shell
 *
 * Structure:
 * 1. Narrow Primary Navigation Rail (68px, deep aubergine #350d36)
 * 2. Secondary Workspace Sidebar (240px, rich aubergine #3F0E40)
 * 3. Main Content Area with TopWorkspaceBar and <Outlet /> (crisp white / soft gray)
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PrimaryNavigationRail from '../components/layout/PrimaryNavigationRail';
import WorkspaceSidebar from '../components/layout/WorkspaceSidebar';
import TopWorkspaceBar from '../components/layout/TopWorkspaceBar';

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F8F9FA] text-[#1D1C1D] font-sans antialiased">
      
      {/* ── 1. Primary Navigation Rail (Desktop) ── */}
      <PrimaryNavigationRail />

      {/* ── 2. Workspace Channels & DMs Sidebar ── */}
      <WorkspaceSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── 3. Main Workspace Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        {/* Top workspace bar */}
        <TopWorkspaceBar onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Dynamic page outlet */}
        <main className="flex-1 overflow-y-auto bg-white flex flex-col min-h-0 relative">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
