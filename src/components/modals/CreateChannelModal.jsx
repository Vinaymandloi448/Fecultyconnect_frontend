/**
 * CreateChannelModal — Slack-style modal to create a new channel
 */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Hash, Lock, Globe, Building2, HelpCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import { createChannel, setActiveConversation } from '../../features/chat/chatSlice';
import ROUTES from '../../constants/routes';

export default function CreateChannelModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Basic Sciences & Humanities',
    'Examination Cell',
    'Academic Affairs',
    'General College',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedName = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    if (!formattedName) {
      setError('Please provide a channel name.');
      return;
    }

    dispatch(
      createChannel({
        name: formattedName,
        description,
        department,
        isPrivate,
      }),
    );

    dispatch(setActiveConversation({ id: formattedName, type: 'channel' }));
    onClose();
    setName('');
    setDescription('');
    setIsPrivate(false);
    setError('');
    navigate(ROUTES.channelUrl(formattedName));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a channel"
      subtitle="Channels are where your faculty team communicates. They're best organized around a topic — like #admissions or #curriculum-review."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Channel Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. syllabus-revision-2025"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        {/* Department Association */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Department / Committee
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm font-medium text-slate-800 transition-all bg-white"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Description <span className="font-normal text-slate-400 lowercase">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this channel about?"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm text-slate-800 placeholder-slate-400 resize-none transition-all"
          />
        </div>

        {/* Visibility Setting */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="mt-0.5 text-purple-700">
              {isPrivate ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">
                {isPrivate ? 'Make Private' : 'Public to All College Faculty'}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isPrivate
                  ? 'Only invited faculty members can see and join this channel.'
                  : 'Any faculty member in FacultyConnect can search and view this channel.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isPrivate ? 'bg-purple-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isPrivate ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Disclaimer Notice */}
        <p className="text-[11px] text-slate-400 italic">
          Note: In development mock mode, newly created channels are stored in current session state.
        </p>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-md shadow-purple-900/20 transition-all cursor-pointer"
          >
            Create Channel
          </button>
        </div>
      </form>
    </Modal>
  );
}
