import { Users, ShieldCheck, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function FacultyIllustration() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 xl:p-12 overflow-hidden select-none">
      {/* Dynamic Background Light Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-20 w-[250px] h-[250px] bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Floating Badge */}
      <div className="relative z-10 self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-purple-200 text-xs font-medium tracking-wide shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
        <span>Academic Communication Network</span>
      </div>

      {/* Main Vector / Composition Container */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">

        {/* Outer Graphic Circle with Glow */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">

          {/* Concentric Decorative Rings */}
          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border border-dashed border-indigo-400/20 animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute inset-12 rounded-full border border-white/10" />

          {/* Central Hub Emblem */}
          <div className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-fuchsia-500 p-0.5 shadow-2xl shadow-purple-900/50 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-[22px] bg-purple-950/80 backdrop-blur-md flex flex-col items-center justify-center p-3 text-center">
              <GraduationCap className="w-10 h-10 text-purple-200 mb-1" />
              <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase">IPS ACADEMY</span>
            </div>
          </div>

          {/* Orbiting Satellite Node 1: CS Dept */}
          <div className="absolute top-2 left-6 z-20 bg-slate-900/85 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-3 shadow-xl shadow-purple-950/50 flex items-center gap-3 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold text-xs">
              CS
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Computer Science</div>
              <div className="text-[10px] text-purple-300/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                28 Faculty Online
              </div>
            </div>
          </div>

          {/* Orbiting Satellite Node 2: Chat Bubble Overlay */}
          <div className="absolute bottom-4 left-0 z-30 bg-slate-950/90 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-2xl max-w-[210px] transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
                DS
              </div>
              <span className="text-xs font-medium text-slate-200">Dr. Sharma</span>
              <span className="text-[9px] text-purple-300/60 ml-auto">10:42 AM</span>
            </div>
            <p className="text-[11px] text-purple-100 leading-snug bg-purple-900/30 p-2 rounded-lg border border-purple-500/20">
              &quot;Updated syllabus guidelines shared in CS Dept channel.&quot;
            </p>
          </div>

          {/* Orbiting Satellite Node 3: Stats Chip Right */}
          <div className="absolute top-16 -right-4 z-20 bg-slate-900/85 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-3 shadow-xl flex items-center gap-3 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Inter-Department</div>
              <div className="text-[10px] text-indigo-300/80">Real-time Collaboration</div>
            </div>
          </div>

          {/* Orbiting Satellite Node 4: Security/Verification Chip */}
          <div className="absolute -bottom-2 -right-2 z-20 bg-slate-900/85 backdrop-blur-xl border border-emerald-500/30 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-200">Secure Institution Portal</span>
          </div>

          {/* SVG Connecting Vector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            <path d="M 120 80 Q 200 120 200 200" fill="none" stroke="url(#purpleGradient)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 280 100 Q 200 140 200 200" fill="none" stroke="url(#indigoGradient)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 90 300 Q 150 240 200 200" fill="none" stroke="url(#fuchsiaGradient)" strokeWidth="2" strokeDasharray="4 4" />
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="fuchsiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e879f9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Bottom Text Content */}
      <div className="relative z-10 max-w-lg space-y-3">
        <h2 className="text-2xl xl:text-3xl font-bold text-white tracking-tight leading-tight">
          Empowering Academic Excellence & Collaboration
        </h2>
        <p className="text-sm text-purple-200/80 leading-relaxed">
          Faculty Connect bridges departments at IPS Academy, enabling seamless messaging, course coordination, and instant updates across all academic faculties.
        </p>

        {/* Feature Checkmarks */}
        <div className="pt-2 grid grid-cols-2 gap-2.5 text-xs font-medium text-purple-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Departmental Channels</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Instant Peer Messaging</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Notice & Announcement Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Encrypted & Verified Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
