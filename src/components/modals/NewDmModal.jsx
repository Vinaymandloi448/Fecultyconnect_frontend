/**
 * NewDmModal — Start 1-on-1 faculty conversation
 *
 * Calls POST /api/conversations with body { "facultyId": "..." }
 * Supports quick input of facultyId as well as candidate list selection.
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, ShieldCheck, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import {
  createNewConversation,
  setActiveConversation,
} from '../../features/chat/chatSlice';
import ROUTES from '../../constants/routes';

export default function NewDmModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { facultyMembers } = useSelector((state) => state.chat);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [customFacultyId, setCustomFacultyId] = useState('');
  const [query, setQuery] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  // Filter candidates
  const candidates = facultyMembers.filter(
    (m) => m.id !== currentUser?.id && m.id !== currentUser?.facultyId,
  );

  const filteredFaculty = candidates.filter(
    (m) =>
      m.fullName?.toLowerCase().includes(query.toLowerCase()) ||
      m.department?.toLowerCase().includes(query.toLowerCase()) ||
      m.id?.toLowerCase().includes(query.toLowerCase()),
  );

  const handleStartWithFacultyId = async (facultyId) => {
    const trimmedId = facultyId.trim().toUpperCase();
    if (!trimmedId) return;

    setError('');
    setIsStarting(true);

    try {
      const result = await dispatch(createNewConversation(trimmedId));
      setIsStarting(false);

      if (createNewConversation.fulfilled.match(result)) {
        const conversationId = result.payload.conversationId;
        dispatch(
          setActiveConversation({
            id: conversationId,
            type: 'direct',
          }),
        );
        onClose();
        setCustomFacultyId('');
        setQuery('');
        navigate(ROUTES.messageUrl(conversationId));
      } else {
        setError(result.payload || 'Failed to start conversation. Please check the Faculty ID.');
      }
    } catch (err) {
      setIsStarting(false);
      setError(err?.message || 'Error creating conversation.');
    }
  };

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    handleStartWithFacultyId(customFacultyId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Direct Academic Chat"
      subtitle="Start an individual 1-on-1 collaboration chat with any faculty member using their institutional Faculty ID."
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Direct Faculty ID Input Box ── */}
        <form onSubmit={handleSubmitCustom} className="space-y-1.5 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/70">
          <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider">
            Connect by Faculty ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={customFacultyId}
                onChange={(e) => {
                  setCustomFacultyId(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. FAC002, FAC003, CS-101"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-purple-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 font-mono"
                disabled={isStarting}
              />
            </div>

            <button
              type="submit"
              disabled={isStarting || !customFacultyId.trim()}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isStarting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
              <span>Connect</span>
            </button>
          </div>
          <p className="text-[10px] text-purple-700/70">
            Sends request to <code className="bg-purple-100/80 px-1 py-0.5 rounded text-purple-900">POST /api/conversations</code>
          </p>
        </form>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-2 bg-white text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Or Choose from Roster
          </span>
        </div>

        {/* Search filter input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter colleague roster..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Faculty List */}
        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 -mx-2 px-2">
          {filteredFaculty.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No faculty in roster matching query. Use the direct ID box above.
            </div>
          ) : (
            filteredFaculty.map((faculty) => (
              <button
                key={faculty.id}
                onClick={() => handleStartWithFacultyId(faculty.id)}
                disabled={isStarting}
                className="w-full text-left py-2 px-3 rounded-xl hover:bg-purple-50 flex items-center justify-between group transition-colors focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    name={faculty.fullName}
                    initials={faculty.initials}
                    status={faculty.status}
                    size="sm"
                    rounded="lg"
                    gradient={faculty.avatarColor}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-purple-900 truncate">
                      {faculty.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      ID: <span className="font-mono">{faculty.id}</span> · {faculty.department}
                    </div>
                  </div>
                </div>

                <UserCheck className="w-3.5 h-3.5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

