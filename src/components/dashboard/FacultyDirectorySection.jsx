/**
 * FacultyDirectorySection component for Faculty Connect Dashboard
 *
 * Showcases IPS Academy faculty directory cards with department tabs,
 * online status indicators, and direct messaging buttons.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, MessageSquare, GraduationCap } from 'lucide-react';
import ROUTES from '../../constants/routes';

export default function FacultyDirectorySection({ facultyMembers = [] }) {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Demonstration faculty list fallback
  const defaultFacultyList = [
    {
      id: 'fac-1',
      fullName: 'Dr. Rajesh Sharma',
      department: 'Computer Science',
      designation: 'Professor & HOD',
      status: 'Online',
      statusColor: 'bg-emerald-400',
      avatarColor: 'from-purple-600 to-indigo-600',
      subjects: ['Data Structures', 'Algorithms'],
    },
    {
      id: 'fac-2',
      fullName: 'Prof. Ananya Verma',
      department: 'Information Technology',
      designation: 'Associate Professor',
      status: 'In Class',
      statusColor: 'bg-amber-400',
      avatarColor: 'from-indigo-600 to-fuchsia-600',
      subjects: ['DBMS', 'Cloud Computing'],
    },
    {
      id: 'fac-3',
      fullName: 'Dr. Vikramaditya Singh',
      department: 'Electronics & Comm.',
      designation: 'Associate Professor',
      status: 'Online',
      statusColor: 'bg-emerald-400',
      avatarColor: 'from-fuchsia-600 to-purple-600',
      subjects: ['VLSI Design', 'Signals & Systems'],
    },
    {
      id: 'fac-4',
      fullName: 'Prof. Suresh Kumar',
      department: 'Mechanical Eng.',
      designation: 'Assistant Professor',
      status: 'Available',
      statusColor: 'bg-purple-400',
      avatarColor: 'from-purple-600 to-indigo-700',
      subjects: ['Thermodynamics', 'Fluid Mechanics'],
    },
    {
      id: 'fac-5',
      fullName: 'Dr. Meenakshi Joshi',
      department: 'Computer Science',
      designation: 'Professor',
      status: 'Online',
      statusColor: 'bg-emerald-400',
      avatarColor: 'from-indigo-600 to-purple-600',
      subjects: ['Machine Learning', 'Artificial Intelligence'],
    },
    {
      id: 'fac-6',
      fullName: 'Prof. Devendra Patel',
      department: 'Civil Engineering',
      designation: 'Senior Lecturer',
      status: 'In Office',
      statusColor: 'bg-emerald-400',
      avatarColor: 'from-fuchsia-700 to-indigo-600',
      subjects: ['Structural Eng', 'Surveying'],
    },
  ];

  const sourceData = facultyMembers.length > 0 ? facultyMembers : defaultFacultyList;

  const departments = ['All', 'Computer Science', 'Information Technology', 'Electronics & Comm.', 'Mechanical Eng.', 'Civil Engineering'];

  const filteredFaculty = sourceData.filter((member) => {
    const matchesDept = selectedDept === 'All' || member.department === selectedDept;
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.designation && member.designation.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Faculty Directory</h3>
            <p className="text-xs text-purple-300/60">Connect & collaborate with IPS Academy colleagues</p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/50">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, department..."
            className="w-full rounded-xl border border-purple-500/20 bg-white/[0.04] pl-8 pr-3 py-1.5 text-xs text-white placeholder-purple-300/40 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all"
          />
        </div>
      </div>

      {/* Department Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDept === dept
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white/[0.04] border border-purple-500/20 text-purple-300/80 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((faculty) => (
          <div
            key={faculty.id}
            className="rounded-2xl bg-white/[0.03] border border-purple-500/20 p-4 hover:bg-white/[0.06] hover:border-purple-400/40 transition-all duration-200 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-tr ${faculty.avatarColor || 'from-purple-600 to-indigo-600'} flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0`}>
                    {faculty.fullName ? faculty.fullName.charAt(0) : 'F'}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${faculty.statusColor || 'bg-emerald-400'} ring-2 ring-[#0b051b]`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                      {faculty.fullName}
                    </h4>
                    <p className="text-xs font-medium text-purple-300/80 truncate">
                      {faculty.designation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Department badge & status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-purple-300/70">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span className="truncate">{faculty.department}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {faculty.status || 'Active'}
                  </span>
                </div>

                {faculty.subjects && faculty.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {faculty.subjects.map((sub) => (
                      <span
                        key={sub}
                        className="px-2 py-0.5 rounded-md bg-purple-900/30 text-purple-200 text-[10px] font-medium border border-purple-500/15"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Message Action Button */}
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => navigate(ROUTES.CHAT)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/30 text-purple-200 hover:text-white font-semibold text-xs transition-all cursor-pointer group-hover:shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
