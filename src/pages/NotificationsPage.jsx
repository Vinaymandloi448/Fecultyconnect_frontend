/**
 * NotificationsPage — Activity & Notifications Center (/dashboard/notifications)
 *
 * Displays notifications for messages, group activity, college announcements,
 * and shared documents with filter pills and read/unread state management.
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  Megaphone,
  FileText,
  Users,
  CheckCheck,
  Check,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import {
  markAsRead,
  markAllRead,
  setFilter,
} from '../features/notifications/notificationsSlice';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications, unreadCount, selectedFilter } = useSelector(
    (state) => state.notifications,
  );

  const filterTabs = [
    { id: 'all', label: 'All Activity' },
    { id: 'unread', label: 'Unread Only' },
    { id: 'message', label: 'Messages' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'file', label: 'Shared Files' },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === 'unread') return !notif.isRead;
    if (selectedFilter === 'all') return true;
    return notif.type === selectedFilter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'message':
      case 'mention':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-rose-600" />;
      case 'file':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'channel':
      default:
        return <Users className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleNotificationClick = (notif) => {
    dispatch(markAsRead(notif.id));
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 select-none">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Activity & Notifications Center
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time activity across department channels, direct messages, and college circulars.
          </p>
        </div>

        {/* Mark All Read Action */}
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllRead())}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* ── FILTER PILLS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setFilter(tab.id))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── NOTIFICATIONS FEED ── */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No notifications found in this view.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-white border-slate-200 hover:border-purple-300'
                  : 'bg-purple-50/25 border-purple-200 shadow-2xs hover:border-purple-300 ring-1 ring-purple-100'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {/* Avatar with type badge */}
                <div className="relative shrink-0">
                  <Avatar
                    name={notif.avatar || 'FC'}
                    initials={notif.avatar}
                    size="md"
                    rounded="xl"
                    gradient={notif.avatarColor}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {getIcon(notif.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
                      {notif.title}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Unread notification" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed truncate max-w-lg">
                    {notif.description}
                  </p>
                </div>
              </div>

              {/* Timestamp & arrow */}
              <div className="flex items-center gap-3 shrink-0 text-slate-400">
                <span className="text-[11px]">{notif.time}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
