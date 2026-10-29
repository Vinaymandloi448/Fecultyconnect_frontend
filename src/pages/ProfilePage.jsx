/**
 * ProfilePage — Faculty Profile & Account Settings (/dashboard/profile)
 *
 * Displays academic credentials, office details, availability status,
 * and allows in-place editing of profile information.
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  User,
  Mail,
  Building2,
  Briefcase,
  MapPin,
  BookOpen,
  Award,
  Edit3,
  Calendar,
  ShieldCheck,
  Check,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import { updateProfile, updateUserStatus } from '../features/auth/authSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    designation: user?.designation || '',
    department: user?.department || '',
    office: user?.office || '',
    subjects: user?.subjects ? user.subjects.join(', ') : '',
    bio: user?.bio || '',
    statusText: user?.statusText || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const statusOptions = [
    { id: 'online', label: 'Active', desc: 'Available for chats and inquiries', color: 'bg-emerald-500' },
    { id: 'in_lecture', label: 'In Class / Lecture', desc: 'Teaching scheduled lab or classroom course', color: 'bg-purple-500' },
    { id: 'research', label: 'Research Hours', desc: 'Focused on lab trials or grant proposals', color: 'bg-blue-500' },
    { id: 'away', label: 'Away / Office Hours', desc: 'Available during walk-in advising hours', color: 'bg-amber-400' },
  ];

  const handleStatusChange = (statusId) => {
    dispatch(updateUserStatus({ status: statusId }));
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        fullName: formData.fullName,
        designation: formData.designation,
        department: formData.department,
        office: formData.office,
        subjects: formData.subjects
          ? formData.subjects.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        bio: formData.bio,
        statusText: formData.statusText,
      }),
    );

    setIsEditModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 select-none">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Faculty Profile & Credentials
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage your official institutional details, teaching profile, and availability status.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              fullName: user?.fullName || '',
              designation: user?.designation || '',
              department: user?.department || '',
              office: user?.office || '',
              subjects: user?.subjects ? user.subjects.join(', ') : '',
              bio: user?.bio || '',
              statusText: user?.statusText || '',
            });
            setIsEditModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your faculty profile has been updated successfully!</span>
        </div>
      )}

      {/* ── PROFILE HERO CARD ── */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar
            name={user?.fullName || 'Faculty'}
            initials={user?.initials}
            status={user?.status}
            size="2xl"
            rounded="2xl"
            gradient={user?.avatarColor}
          />

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 truncate">
                {user?.fullName || 'Faculty Member'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <ShieldCheck className="w-3 h-3 text-purple-600" />
                <span>Authorized Faculty</span>
              </span>
            </div>

            <p className="text-xs font-semibold text-purple-700">
              {user?.designation} · {user?.department}
            </p>

            <p className="text-xs text-slate-500">
              Institutional ID: <span className="font-mono text-slate-700 font-semibold">{user?.facultyId || 'FC-CSE-101'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── AVAILABILITY STATUS SELECTOR ── */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900">
          Availability Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleStatusChange(opt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                user?.status === opt.id
                  ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-100 shadow-2xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                  <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                </div>
                <p className="text-[11px] text-slate-500">{opt.desc}</p>
              </div>

              {user?.status === opt.id && (
                <Check className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── ACADEMIC CREDENTIALS & DETAILS ── */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900">
          Department & Academic Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Department
            </span>
            <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>{user?.department || 'Computer Science & Engineering'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Academic Designation
            </span>
            <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>{user?.designation || 'Professor & HOD'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              College Email
            </span>
            <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
              <Mail className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700">{user?.email || 'r.sharma@facultyconnect.edu'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Office Cabin
            </span>
            <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>{user?.office || 'Engineering Block B, Room 304'}</span>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Teaching & Research Subjects
            </span>
            <div className="flex items-start gap-2 text-slate-800 font-medium text-sm">
              <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                {Array.isArray(user?.subjects) ? user.subjects.join(', ') : user?.subjects || 'Distributed Systems, Cloud Architecture'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Professional Biography
            </span>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {user?.bio || 'Head of Department leading academic curriculum innovation and distributed systems research.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Faculty Profile"
        subtitle="Update your department designation, office location, and subjects."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-slate-800">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleFormChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                required
                value={formData.designation}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Department
              </label>
              <input
                type="text"
                name="department"
                required
                value={formData.department}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Office Cabin Location
            </label>
            <input
              type="text"
              name="office"
              value={formData.office}
              onChange={handleFormChange}
              placeholder="e.g. Block B, Room 304"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Teaching Subjects <span className="font-normal text-slate-400 lowercase">(comma separated)</span>
            </label>
            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleFormChange}
              placeholder="e.g. Distributed Systems, Cloud Computing"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Professional Biography
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleFormChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
