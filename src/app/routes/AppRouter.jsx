/**
 * Application Router Configuration
 *
 * Implements the full FacultyConnect route tree:
 *   /                                 → LandingPage
 *   /login                            → LoginPage (PublicRoute)
 *   /register                         → RegisterPage (PublicRoute)
 *   /dashboard                        → DashboardPage (ProtectedRoute, Slack Layout)
 *   /dashboard/channels/:channelId   → ChatPage (Channel conversation)
 *   /dashboard/messages/:userId      → ChatPage (Direct message)
 *   /dashboard/files                  → DocumentsPage (Academic documents repository)
 *   /dashboard/announcements          → AnnouncementsPage (Official notices)
 *   /dashboard/notifications          → NotificationsPage (Activity center)
 *   /dashboard/profile                → ProfilePage (Faculty profile)
 *   *                                 → NotFoundPage
 */

import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../../layouts/AuthLayout';
import AppLayout from '../../layouts/AppLayout';

// Route guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Pages
import LandingPage from '../../pages/LandingPage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import DashboardPage from '../../pages/DashboardPage';
import GroupsPage from '../../pages/GroupsPage';
import ChatPage from '../../pages/ChatPage';
import DocumentsPage from '../../pages/DocumentsPage';
import AnnouncementsPage from '../../pages/AnnouncementsPage';
import NotificationsPage from '../../pages/NotificationsPage';
import ProfilePage from '../../pages/ProfilePage';
import NotFoundPage from '../../pages/NotFoundPage';

import ROUTES from '../../constants/routes';

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public Landing Page ── */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />

      {/* ── Public Auth Routes (Redirect to /dashboard if logged in) ── */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>
      </Route>

      {/* ── Protected Workspace Routes (Slack Layout Shell) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
          <Route path={ROUTES.CHANNEL} element={<ChatPage />} />
          <Route path={ROUTES.MESSAGE} element={<ChatPage />} />
          <Route path={ROUTES.FILES} element={<DocumentsPage />} />
          <Route path={ROUTES.ANNOUNCEMENTS} element={<AnnouncementsPage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />

          {/* Legacy / Convenience Redirects */}
          <Route path="/chat" element={<Navigate to="/dashboard/channels/general" replace />} />
          <Route path="/chat/:conversationId" element={<Navigate to="/dashboard/channels/general" replace />} />
          <Route path="/groups" element={<Navigate to={ROUTES.GROUPS} replace />} />
          <Route path="/groups/:groupId" element={<Navigate to={ROUTES.GROUPS} replace />} />
          <Route path="/documents" element={<Navigate to={ROUTES.FILES} replace />} />
        </Route>
      </Route>


      {/* ── 404 Catch-All ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
