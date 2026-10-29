/**
 * ProfilePage — Faculty Profile & Account Settings (/dashboard/profile)
 *
 * Displays academic credentials, office details, availability status,
 * and allows in-place editing of profile information.
 */

import { useEffect, useState } from 'react';
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
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import { updateUserStatus } from '../features/auth/authSlice';
import {
  fetchProfile,
  updateFacultyProfile,
  clearProfileStatus,
} from '../features/profile/profileSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profileData, isLoading, isUpdating, error: profileError, updateSuccess } =
    useSelector((state) => state.profile);

  // Active profile is either fetched backend profileData or fallback to auth user
  const activeFaculty = profileData || user;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    fullName: activeFaculty?.fullName || '',
    designation: activeFaculty?.designation || '',
    department: activeFaculty?.department || '',
    subjects: activeFaculty?.subjects ? activeFaculty.subjects.join(', ') : '',
    bio: activeFaculty?.bio || '',
    profileImage: activeFaculty?.profileImage || '',
  });

  // Fetch current faculty profile from backend on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Keep form data in sync when profile loads
  useEffect(() => {
    if (activeFaculty) {
      setFormData({
        fullName: activeFaculty.fullName || '',
        designation: activeFaculty.designation || '',
        department: activeFaculty.department || '',
        subjects: Array.isArray(activeFaculty.subjects)
          ? activeFaculty.subjects.join(', ')
          : activeFaculty.subjects || '',
        bio: activeFaculty.bio || '',
        profileImage: activeFaculty.profileImage || '',
      });
    }
  }, [activeFaculty]);

  // Auto-close modal on update success
  useEffect(() => {
    if (updateSuccess) {
      setIsEditModalOpen(false);
      const timer = setTimeout(() => {
        dispatch(clearProfileStatus());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    dispatch(
      updateFacultyProfile({
        fullName: formData.fullName.trim(),
        designation: formData.designation.trim(),
        department: formData.department.trim(),
        subjects: formData.subjects
          ? formData.subjects.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        bio: formData.bio.trim(),
        profileImage: formData.profileImage || '',
      }),
    );
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
              fullName: activeFaculty?.fullName || '',
              designation: activeFaculty?.designation || '',
              department: activeFaculty?.department || '',
              subjects: Array.isArray(activeFaculty?.subjects)
                ? activeFaculty.subjects.join(', ')
                : activeFaculty?.subjects || '',
              bio: activeFaculty?.bio || '',
              profileImage: activeFaculty?.profileImage || '',
            });
            setIsEditModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {profileError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      {updateSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your faculty profile has been updated successfully in the college database!</span>
        </div>
      )}

      {isLoading && (
        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-center gap-2 text-xs text-purple-700">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Synchronizing profile with backend...</span>
        </div>
      )}

      {/* ── PROFILE HERO CARD ── */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar
            name={activeFaculty?.fullName || 'Faculty'}
            initials={
              activeFaculty?.fullName
                ? activeFaculty.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'FC'
            }
            status={activeFaculty?.status || 'online'}
            size="2xl"
            rounded="2xl"
            gradient={activeFaculty?.avatarColor}
          />

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 truncate">
                {activeFaculty?.fullName || 'Faculty Member'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <ShieldCheck className="w-3 h-3 text-purple-600" />
                <span>Authorized Faculty ({activeFaculty?.role || 'FACULTY'})</span>
              </span>
            </div>

            <p className="text-xs font-semibold text-purple-700">
              {[activeFaculty?.designation, activeFaculty?.department].filter(Boolean).join(' · ') || 'Faculty Member'}
            </p>

            <p className="text-xs text-slate-500">
              Institutional Faculty ID:{' '}
              <span className="font-mono text-purple-900 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {activeFaculty?.facultyId || 'Unassigned'}
              </span>
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
                activeFaculty?.status === opt.id
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

              {activeFaculty?.status === opt.id && (
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
              <span>{activeFaculty?.department || 'Not specified'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Academic Designation
            </span>
            <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>{activeFaculty?.designation || 'Faculty Member'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              College Email
            </span>
            <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
              <Mail className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-semibold">{activeFaculty?.email || 'Not specified'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Institutional Faculty ID
            </span>
            <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span className="font-mono text-purple-900 font-bold">{activeFaculty?.facultyId || 'Unassigned'}</span>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Teaching & Research Subjects
            </span>
            <div className="flex items-start gap-2 text-slate-800 font-medium text-sm">
              <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                {Array.isArray(activeFaculty?.subjects) && activeFaculty.subjects.length > 0
                  ? activeFaculty.subjects.join(', ')
                  : (typeof activeFaculty?.subjects === 'string' && activeFaculty.subjects.trim())
                  ? activeFaculty.subjects
                  : 'No teaching subjects specified'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
              Professional Biography
            </span>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {activeFaculty?.bio || 'No professional biography provided.'}
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
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
