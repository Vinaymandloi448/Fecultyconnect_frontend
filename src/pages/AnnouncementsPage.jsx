/**
 * AnnouncementsPage — Dedicated College Announcements Noticeboard
 *
 * Displays circulars, academic notices, and institutional updates
 * with department filters and read/unread visual state tracking.
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Megaphone,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Plus,
  AlertCircle,
  Eye,
  Check,
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import {
  setCategoryFilter,
  markAnnouncementRead,
  addAnnouncement,
} from '../features/announcements/announcementsSlice';

export default function AnnouncementsPage() {
  const dispatch = useDispatch();
  const { announcements, selectedCategory } = useSelector((state) => state.announcements);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New announcement modal state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDepartment, setNewDepartment] = useState('All Departments');
  const [newPriority, setNewPriority] = useState('normal');

  const categories = [
    'All',
    'Academic Circular',
    'Accreditation',
    'Research Grants',
    'Faculty Development',
  ];

  const filteredAnnouncements = announcements
    .filter((a) => (selectedCategory === 'All' ? true : a.category === selectedCategory))
    .filter((a) => (filterUnreadOnly ? !a.isRead : true))
    .filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.department.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    dispatch(
      addAnnouncement({
        title: newTitle.trim(),
        content: newContent.trim(),
        author: user?.fullName || 'Faculty Member',
        authorRole: user?.designation || 'Faculty',
        department: newDepartment,
        category: 'Academic Circular',
        priority: newPriority,
        actionRequired: 'Review announcement details',
      }),
    );

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 select-none">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Official College Announcements
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Institutional circulars, Dean office memos, exam schedules, and department notices.
          </p>
        </div>

        {/* Action Button: Post Notice */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* ── FILTERS & SEARCH ROW ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setCategoryFilter(cat))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Unread Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter announcements..."
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 w-full sm:w-48"
          />

          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
              filterUnreadOnly
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Unread only
          </button>
        </div>
      </div>

      {/* ── ANNOUNCEMENTS LIST ── */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No announcements found matching the selected filters.
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition-all ${
                ann.isRead
                  ? 'bg-white border-slate-200'
                  : 'bg-purple-50/20 border-purple-200 shadow-xs ring-1 ring-purple-100'
              }`}
            >
              <div className="space-y-3">
                {/* Meta row */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ann.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : ann.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ann.priority}
                    </span>

                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {ann.department}
                    </span>

                    {!ann.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" title="Unread" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ann.date}</span>
                    </div>

                    {!ann.isRead ? (
                      <button
                        onClick={() => dispatch(markAnnouncementRead(ann.id))}
                        className="text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
                      >
                        Mark as read
                      </button>
                    ) : (
                      <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                        <Check className="w-3 h-3" /> Read
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {ann.title}
                </h3>

                {/* Full Body Content */}
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
                  {ann.content}
                </div>

                {/* Footer Info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{ann.author}</span>
                    <span>·</span>
                    <span>{ann.authorRole}</span>
                  </div>

                  {ann.actionRequired && (
                    <span className="text-purple-700 font-semibold text-[11px] bg-purple-50 px-2.5 py-1 rounded-lg">
                      Action: {ann.actionRequired}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── CREATE ANNOUNCEMENT MODAL ── */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Publish Official Announcement"
        subtitle="Post a notice to the entire faculty body or a specific academic division."
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-slate-800">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Notice Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Schedule for Course End Surveys"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Target Department
              </label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="All Departments">All Departments</option>
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Examination Cell">Exam Cell</option>
                <option value="Dean of Academics">Dean Office</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Notice Content
            </label>
            <textarea
              rows={4}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter the official details, guidelines, and deadlines..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
