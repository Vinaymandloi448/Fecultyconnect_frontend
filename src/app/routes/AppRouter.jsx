/**
 * Application router configuration
 *
 * All route definitions live here. Pages are lazy-loaded
 * to keep the initial bundle small.
 */

import { Routes, Route } from 'react-router-dom';

// Layouts
// import AuthLayout   from '../../layouts/AuthLayout';
// import AppLayout    from '../../layouts/AppLayout';

// Pages — lazy-load when they exist
// import DashboardPage     from '../../pages/DashboardPage';
// import LoginPage          from '../../pages/LoginPage';
// import RegisterPage       from '../../pages/RegisterPage';
// import ChatPage            from '../../pages/ChatPage';
// import GroupsPage          from '../../pages/GroupsPage';
// import DocumentsPage       from '../../pages/DocumentsPage';
// import AnnouncementsPage   from '../../pages/AnnouncementsPage';
// import ProfilePage         from '../../pages/ProfilePage';
// import NotFoundPage        from '../../pages/NotFoundPage';

import ROUTES from '../../constants/routes';

export default function AppRouter() {
  return (
    <Routes>
      {/* 
        Uncomment and wire up routes as pages are built.

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD}            element={<DashboardPage />} />
          <Route path={ROUTES.CHAT}                 element={<ChatPage />} />
          <Route path={ROUTES.CHAT_CONVERSATION}    element={<ChatPage />} />
          <Route path={ROUTES.GROUPS}               element={<GroupsPage />} />
          <Route path={ROUTES.GROUP_DETAIL}         element={<GroupsPage />} />
          <Route path={ROUTES.DOCUMENTS}            element={<DocumentsPage />} />
          <Route path={ROUTES.ANNOUNCEMENTS}        element={<AnnouncementsPage />} />
          <Route path={ROUTES.PROFILE}              element={<ProfilePage />} />
          <Route path={ROUTES.NOTIFICATIONS}        element={<NotFoundPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      */}
      <Route path={ROUTES.HOME} element={<div>Home — routes not wired yet</div>} />
    </Routes>
  );
}
