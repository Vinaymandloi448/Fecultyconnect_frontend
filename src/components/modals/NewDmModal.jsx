/**
 * NewDmModal — Slack-style modal to search faculty and start a DM
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck } from 'lucide-react';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import { setActiveConversation } from '../../features/chat/chatSlice';
import ROUTES from '../../constants/routes';

export default function NewDmModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { facultyMembers } = useSelector((state) => state.chat);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [query, setQuery] = useState('');

  // Filter out current user from candidates
  const candidates = facultyMembers.filter((m) => m.id !== currentUser?.id);

  const filteredFaculty = candidates.filter(
    (m) =>
      m.fullName.toLowerCase().includes(query.toLowerCase()) ||
      m.department.toLowerCase().includes(query.toLowerCase()) ||
      m.designation.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelectFaculty = (faculty) => {
    dispatch(setActiveConversation({ id: faculty.id, type: 'direct' }));
    onClose();
    setQuery('');
    navigate(ROUTES.messageUrl(faculty.id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Direct message"
      subtitle="Start an individual 1-on-1 academic collaboration chat with any faculty member."
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by faculty name, designation, or department..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Faculty List */}
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 -mx-2 px-2">
          {filteredFaculty.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No faculty members found matching &quot;{query}&quot;
            </div>
          ) : (
            filteredFaculty.map((faculty) => (
              <button
                key={faculty.id}
                onClick={() => handleSelectFaculty(faculty)}
                className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-purple-50 flex items-center justify-between group transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    name={faculty.fullName}
                    initials={faculty.initials}
                    status={faculty.status}
                    size="md"
                    rounded="xl"
                    gradient={faculty.avatarColor}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-purple-900 truncate">
                      {faculty.fullName}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {faculty.designation} · {faculty.department}
                    </div>
                  </div>
                </div>

                <UserCheck className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
