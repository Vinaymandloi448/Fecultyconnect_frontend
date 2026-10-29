/**
 * AuthLayout — Slack-Inspired Split Authentication Shell
 *
 * Left Column: Rich aubergine branding, headline, and original UI preview
 * Right Column: Clean white form container (<Outlet />) for Login and Register
 */

import { Outlet, Link } from 'react-router-dom';
import {
  GraduationCap,
  MessageSquare,
  Hash,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
} from 'lucide-react';
import ROUTES from '../constants/routes';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans select-none antialiased">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* ── LEFT PANEL (Desktop): Rich Aubergine Brand Showcase ── */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-[#350d36] via-[#3F0E40] to-[#522653] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden">
          
          {/* Brand header */}
          <div className="space-y-6 relative z-10">
            <Link to={ROUTES.HOME} className="flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-0.5 border border-white/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  FacultyConnect
                </span>
                <p className="text-xs text-purple-200/70 font-medium">
                  Academic Faculty Platform
                </p>
              </div>
            </Link>

            <div className="pt-4 space-y-2">
              <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-snug">
                Welcome to your faculty collaboration workspace.
              </h2>
              <p className="text-xs xl:text-sm text-purple-200/80 leading-relaxed font-normal">
                Stay aligned on course syllabi, invigilation duty rosters, department circulars, and research grants with fellow professors.
              </p>
            </div>
          </div>

          {/* Subtle UI Preview Card */}
          <div className="my-8 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl space-y-3 relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-300" />
                <span className="font-bold text-xs text-white">#examination-updates</span>
              </div>
              <span className="text-[10px] text-purple-200/70 font-medium">Exam Cell</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                  SR
                </div>
                <div>
                  <span className="font-bold text-white text-[11px] mr-1.5">Dr. Sunita Rao (Dean)</span>
                  <p className="text-purple-100 text-[11px] leading-relaxed">
                    Mid-semester invigilation slots have been finalized. Please review the updated schedule.
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-black/20 border border-white/10 flex items-center gap-2 text-[10px]">
                <FileText className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="truncate text-purple-100">Mid_Sem_Exam_Roster_2025.xlsx</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-white/10 text-xs text-purple-200/60 flex items-center justify-between relative z-10">
            <span>Faculty-exclusive workspace</span>
            <span>Encrypted & Verified</span>
          </div>

        </div>

        {/* ── RIGHT PANEL: Form Area ── */}
        <div className="lg:col-span-7 bg-white flex flex-col justify-center px-6 py-10 sm:px-12 xl:px-20 min-h-screen">
          <div className="w-full max-w-md mx-auto">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}
