/**
 * GroupsPage — Full Academic Groups Management Interface
 *
 * Implements:
 * - Load all groups (GET /api/groups)
 * - View group details (GET /api/groups/{groupId})
 * - Create group (POST /api/groups)
 * - Delete group (DELETE /api/groups/{groupId})
 * - Add group member (POST /api/groups/{groupId}/members/{facultyId})
 * - Remove group member (DELETE /api/groups/{groupId}/members/{facultyId})
 * - Comprehensive loading, empty, success, and error states
 */

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Trash2,
  UserPlus,
  UserMinus,
  Search,
  Building2,
  BookOpen,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  fetchGroups,
  createNewGroup,
  deleteExistingGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  setActiveGroup,
  clearGroupsError,
} from '../features/groups/groupsSlice';
import Modal from '../components/ui/Modal';
import ROUTES from '../constants/routes';

export default function GroupsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { groups, activeGroup, isLoading, isCreating, error, successMessage } =
    useSelector((state) => state.groups);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMemberFacultyId, setNewMemberFacultyId] = useState('');
  const [memberActionLoading, setMemberActionLoading] = useState(false);

  // Create form state
  const [newGroupForm, setNewGroupForm] = useState({
    name: '',
    description: '',
    department: user?.department || 'Computer Science & Engineering',
    subject: '',
  });

  // Fetch groups on mount
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  // Set first group active if none selected
  useEffect(() => {
    if (groups.length > 0 && !activeGroup) {
      dispatch(setActiveGroup(groups[0]));
    }
  }, [groups, activeGroup, dispatch]);

  // Auto clear success message after 4s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearGroupsError());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const filteredGroups = groups.filter(
    (g) =>
      g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupForm.name.trim()) return;

    const res = await dispatch(
      createNewGroup({
        name: newGroupForm.name.trim(),
        description: newGroupForm.description.trim(),
        department: newGroupForm.department.trim(),
        subject: newGroupForm.subject.trim() || newGroupForm.department.trim(),
      }),
    );

    if (createNewGroup.fulfilled.match(res)) {
      setIsCreateModalOpen(false);
      setNewGroupForm({
        name: '',
        description: '',
        department: user?.department || 'Computer Science & Engineering',
        subject: '',
      });
      dispatch(setActiveGroup(res.payload));
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      await dispatch(deleteExistingGroup(groupId));
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const facultyId = newMemberFacultyId.trim().toUpperCase();
    if (!facultyId || !activeGroup) return;

    setMemberActionLoading(true);
    await dispatch(
      addMemberToGroup({
        groupId: activeGroup.groupId,
        facultyId,
      }),
    );
    setMemberActionLoading(false);
    setNewMemberFacultyId('');
  };

  const handleRemoveMember = async (facultyId) => {
    if (!activeGroup) return;
    if (window.confirm(`Remove faculty member ${facultyId} from this group?`)) {
      setMemberActionLoading(true);
      await dispatch(
        removeMemberFromGroup({
          groupId: activeGroup.groupId,
          facultyId,
        }),
      );
      setMemberActionLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 select-none">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Academic & Departmental Groups
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Collaborate within departmental faculty teams, committees, and syllabus review councils.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Group</span>
        </button>
      </div>

      {/* ── NOTIFICATION BANNERS ── */}
      {error && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => dispatch(clearGroupsError())}
            className="text-xs font-bold text-rose-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => dispatch(clearGroupsError())}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── MAIN TWO-COLUMN CONTENT ── */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        
        {/* Left Column: Group List (w-80) */}
        <div className="w-full sm:w-80 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col overflow-hidden">
          
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groups or department..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <span>Loading groups from backend...</span>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-600">No groups found</p>
                <p className="text-[11px] text-slate-400">
                  {searchQuery ? 'Try another search keyword' : 'Create your first faculty group above!'}
                </p>
              </div>
            ) : (
              filteredGroups.map((group) => {
                const isSelected = activeGroup?.groupId === group.groupId;
                return (
                  <button
                    key={group.groupId || group.id}
                    onClick={() => dispatch(setActiveGroup(group))}
                    className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50/70 border-l-4 border-l-purple-700'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {group.name}
                      </div>
                      <div className="text-[11px] text-purple-700 truncate font-medium">
                        {group.department}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        ID: <span className="font-mono">{group.groupId}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 shrink-0">
                      {group.memberIds?.length || 0} members
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Group Details & Member Management */}
        <div className="hidden sm:flex flex-1 bg-white rounded-2xl border border-slate-200 shadow-2xs flex-col overflow-hidden">
          {activeGroup ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Active Group Top Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-900">
                      {activeGroup.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      {activeGroup.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Group ID: <span className="font-mono text-slate-700 font-bold">{activeGroup.groupId}</span>
                    {activeGroup.createdBy && (
                      <span> · Created by <strong className="text-slate-700">{activeGroup.createdBy}</strong></span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteGroup(activeGroup.groupId)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete group (creator only)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.channelUrl(activeGroup.groupId))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition-colors"
                  >
                    <span>Open Channel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Group Description */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Description & Academic Focus
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {activeGroup.description || 'No description provided.'}
                </p>
              </div>

              {/* Add Member Form */}
              <div className="space-y-2.5 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <UserPlus className="w-4 h-4 text-purple-700" />
                  <span>Add Faculty Member to Group</span>
                </div>
                <p className="text-[11px] text-purple-800/80">
                  Enter the colleague&apos;s institutional Faculty ID (e.g. FAC002, FAC003). Only the group creator can add or remove members.
                </p>

                <form onSubmit={handleAddMember} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    required
                    value={newMemberFacultyId}
                    onChange={(e) => setNewMemberFacultyId(e.target.value)}
                    placeholder="Enter Faculty ID (e.g. FAC002)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                    disabled={memberActionLoading}
                  />
                  <button
                    type="submit"
                    disabled={memberActionLoading || !newMemberFacultyId.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {memberActionLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>Add Member</span>
                  </button>
                </form>
              </div>

              {/* Member Roster */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Group Members ({activeGroup.memberIds?.length || 0})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {activeGroup.memberIds && activeGroup.memberIds.length > 0 ? (
                    activeGroup.memberIds.map((memberId) => (
                      <div
                        key={memberId}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {memberId.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 font-mono truncate">
                              {memberId}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {memberId === activeGroup.createdBy ? 'Group Creator' : 'Member'}
                            </div>
                          </div>
                        </div>

                        {memberId !== activeGroup.createdBy && (
                          <button
                            onClick={() => handleRemoveMember(memberId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title={`Remove ${memberId}`}
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-6 text-center text-xs text-slate-400">
                      No members registered in this group yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-300" />
              <p className="font-semibold text-slate-600 text-sm">Select a group to view details</p>
              <p className="text-xs text-slate-400">
                Manage group memberships, view syllabus review cells, or start conversations.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ── CREATE GROUP MODAL ── */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Faculty Group"
        subtitle="Groups coordinate subject curricula, examination duties, and departmental initiatives."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4 text-slate-800">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Group Name
            </label>
            <input
              type="text"
              required
              value={newGroupForm.name}
              onChange={(e) => setNewGroupForm({ ...newGroupForm, name: e.target.value })}
              placeholder="e.g. CSE Curriculum Committee"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Department
            </label>
            <input
              type="text"
              required
              value={newGroupForm.department}
              onChange={(e) => setNewGroupForm({ ...newGroupForm, department: e.target.value })}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Subject / Topic Area
            </label>
            <input
              type="text"
              value={newGroupForm.subject}
              onChange={(e) => setNewGroupForm({ ...newGroupForm, subject: e.target.value })}
              placeholder="e.g. Cloud Architecture & Labs"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Description
            </label>
            <textarea
              rows={3}
              value={newGroupForm.description}
              onChange={(e) => setNewGroupForm({ ...newGroupForm, description: e.target.value })}
              placeholder="State the committee or group objectives..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600 resize-none"
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
              disabled={isCreating || !newGroupForm.name.trim()}
              className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Group</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
