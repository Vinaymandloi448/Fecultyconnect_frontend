/**
 * Application router configuration
 *
 * All route definitions live here. Pages are imported directly
 * (lazy-loading can be added later when bundle size warrants it).
 *
 * Route structure:
 *   /login, /register           → PublicRoute (redirect if already logged in)
 *   /dashboard, /chat, etc.     → ProtectedRoute (redirect to /login if not logged in)
 *   /                           → redirect to /dashboard
 *   *                           → 404
 */

import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../../layouts/AuthLayout';
import AppLayout from '../../layouts/AppLayout';

// Route guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Pages
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import DashboardPage from '../../pages/DashboardPage';
import ChatPage from '../../pages/ChatPage';
import GroupsPage from '../../pages/GroupsPage';
import ProfilePage from '../../pages/ProfilePage';
import NotFoundPage from '../../pages/NotFoundPage';

import ROUTES from '../../constants/routes';

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public auth routes (redirect to dashboard if already logged in) ── */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>
      </Route>

      {/* ── Protected app routes (redirect to login if not authenticated) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.CHAT} element={<ChatPage />} />
          <Route path={ROUTES.CHAT_CONVERSATION} element={<ChatPage />} />
          <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
          <Route path={ROUTES.GROUP_DETAIL} element={<GroupsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Root redirect ── */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* ── Catch-all 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
