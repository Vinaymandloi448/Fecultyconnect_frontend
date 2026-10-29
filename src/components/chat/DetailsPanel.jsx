/**
 * DetailsPanel — Slack-style collapsible right panel
 *
 * Shows channel details, member roster, or 1-on-1 faculty profile card.
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  Hash,
  Lock,
  Building2,
  Calendar,
  Users,
  Search,
  FileText,
  Mail,
  MapPin,
  BookOpen,
  Award,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { toggleDetailsPanel } from '../../features/chat/chatSlice';

export default function DetailsPanel({
  conversation,
  type = 'channel',
  faculty,
}) {
  const dispatch = useDispatch();
  const { facultyMembers } = useSelector((state) => state.chat);
  const { documents } = useSelector((state) => state.documents);

  const [memberSearch, setMemberSearch] = useState('');
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'members' | 'files'

  // If channel, get channel members
  const channelFaculty = facultyMembers.filter(
    (f) => conversation?.members?.includes(f.id) || conversation?.id === 'general',
  );

  const filteredMembers = channelFaculty.filter((f) =>
    f.fullName.toLowerCase().includes(memberSearch.toLowerCase()),
  );

  // Files shared in this channel
  const channelFiles = documents.filter((d) => d.channel === conversation?.id);

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shrink-0 select-none animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-sm text-slate-900">
          {type === 'channel' ? 'Channel Details' : 'Faculty Profile'}
        </h3>
        <button
          onClick={() => dispatch(toggleDetailsPanel())}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── CHANNEL VIEW ── */}
      {type === 'channel' ? (
        <div className="flex-1 overflow-y-auto">
          {/* Identity card */}
          <div className="p-4 border-b border-slate-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center mb-2">
              {conversation?.isPrivate ? (
                <Lock className="w-6 h-6" />
              ) : (
                <Hash className="w-6 h-6" />
              )}
            </div>
            <h4 className="font-bold text-base text-slate-900">
              #{conversation?.name}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {conversation?.department}
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-slate-200 px-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-purple-600 text-purple-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'members'
                  ? 'border-purple-600 text-purple-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Members</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
                {channelFaculty.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'files'
                  ? 'border-purple-600 text-purple-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Files</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
                {channelFiles.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'about' && (
              <div className="space-y-4 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Topic</span>
                  <p className="leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {conversation?.topic || 'No topic set for this channel.'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Description</span>
                  <p className="leading-relaxed">
                    {conversation?.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Department: {conversation?.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Created in {conversation?.createdAt || 'January 2024'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search channel members..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredMembers.map((m) => (
                    <div key={m.id} className="py-2 flex items-center gap-2.5">
                      <Avatar
                        name={m.fullName}
                        initials={m.initials}
                        status={m.status}
                        size="sm"
                        rounded="xl"
                        gradient={m.avatarColor}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {m.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {m.designation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-2">
                {channelFiles.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    No files uploaded in this channel yet.
                  </p>
                ) : (
                  channelFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                    >
                      <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {file.size} · {file.sharedBy}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── DIRECT MESSAGE FACULTY VIEW ── */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center pt-2">
            <Avatar
              name={faculty?.fullName}
              initials={faculty?.initials}
              status={faculty?.status}
              size="xl"
              rounded="2xl"
              gradient={faculty?.avatarColor}
              className="mx-auto mb-3"
            />
            <h4 className="font-bold text-base text-slate-900">
              {faculty?.fullName}
            </h4>
            <p className="text-xs text-purple-700 font-semibold mt-0.5">
              {faculty?.designation}
            </p>
            <p className="text-xs text-slate-500">
              {faculty?.department}
            </p>
          </div>

          {/* Status Message */}
          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs">
            <span className="font-bold text-purple-900 block mb-0.5">Availability</span>
            <span className="text-purple-700">
              {faculty?.statusText || 'Active on Campus'}
            </span>
          </div>

          {/* Academic Profile Details */}
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-2.5 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Email</span>
                <span className="text-purple-700">{faculty?.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Office</span>
                <span>{faculty?.office || 'Department Cabin'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-600">
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Teaching Areas</span>
                <span>{faculty?.subjects?.join(', ') || 'Computer Science'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-600">
              <Award className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Faculty ID</span>
                <span className="font-mono text-[11px]">{faculty?.facultyId || 'FAC-101'}</span>
              </div>
            </div>
          </div>

          {/* Bio Snippet */}
          {faculty?.bio && (
            <div className="pt-3 border-t border-slate-100">
              <span className="font-bold text-xs text-slate-800 block mb-1">About</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {faculty.bio}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
