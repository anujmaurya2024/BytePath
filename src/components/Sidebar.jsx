import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  TrendingUp, 
  Briefcase, 
  Clock, 
  Calendar, 
  DollarSign, 
  Sliders, 
  Shield, 
  FileText,
  Brain,
  Sun, 
  Moon, 
  LogOut,
  X,
  Award,
  Target,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { TOTAL_PROGRAM_CREDITS } from '../data/syllabus';

const NAV_SECTIONS = [
  {
    title: 'Academic Hub',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'advisor', label: 'ByteAI Advisor 🤖', icon: Brain },
      { id: 'semesters', label: 'Semesters & SGPA', icon: BookOpen },
      { id: 'predictor', label: 'Target Estimator', icon: TrendingUp },
      { id: 'pyqs', label: 'Syllabus & PYQs', icon: FileText },
    ]
  },
  {
    title: 'Student Life',
    items: [
      { id: 'focus', label: 'Focus Zone ⏱️', icon: Clock },
      { id: 'deadlines', label: 'Deadline Planner 📅', icon: Calendar },
      { id: 'expenses', label: 'Pocket Budget 💰', icon: DollarSign },
      { id: 'gradesim', label: 'Grade Simulator 📊', icon: Sliders },
    ]
  },
  {
    title: 'Career & Systems',
    items: [
      { id: 'career', label: 'Career Roadmap 🚀', icon: Briefcase },
      { id: 'admin', label: 'Admin Console ⚙️', icon: Shield, adminOnly: true },
    ]
  }
];

export default function Sidebar({
  studentId,
  studentName = '',
  handleLogout,
  theme,
  setTheme,
  currentCgpa,
  targetCgpa,
  earnedCredits = 0,
  calculatedAttendancePercent = 0,
  hasEndSemSubscription = false,
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) {
  const isAdmin = studentId?.toLowerCase() === 'admin';
  const creditsPct = Math.min((earnedCredits / TOTAL_PROGRAM_CREDITS) * 100, 100);
  
  const getCgpaBadgeColor = (val) => {
    const num = parseFloat(val);
    if (!num) return 'from-slate-500 to-slate-700';
    if (num >= 8.5) return 'from-emerald-500 to-teal-600';
    if (num >= 7.5) return 'from-indigo-500 to-purple-600';
    if (num >= 6.5) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-80 bg-white/95 dark:bg-[#070712]/95 backdrop-blur-2xl
        border-r border-slate-200/80 dark:border-indigo-950/40 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-5 space-y-6">
          
          {/* 1. Header / Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-black gradient-text tracking-tight">BytePath</h1>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    v2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">B.Tech CS & IT Navigator</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <X size={20} />
            </button>
          </div>

          {/* 2. STUDENT INFO CARD (Pinnacle of Left-Side Info) */}
          <div className="p-4 rounded-2xl glass-card border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {studentName ? studentName.substring(0, 2).toUpperCase() : studentId ? studentId.substring(0, 2).toUpperCase() : 'ST'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px]">
                    {studentName || 'Student Scholar'}
                  </p>
                  <p className="text-[10px] font-mono font-semibold text-slate-400 truncate max-w-[130px]">
                    ID: {studentId}
                  </p>
                </div>
              </div>
              
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${isAdmin ? 'from-amber-500 to-rose-500' : 'from-indigo-500 to-purple-600'}`}>
                {isAdmin ? 'ADMIN' : 'CS & IT'}
              </span>
            </div>

            {/* CGPA & Target Metrics */}
            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-surface-700/40 border border-slate-200/50 dark:border-indigo-950/40 text-center">
                <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-slate-400 mb-0.5">
                  <Award size={11} className="text-indigo-400" /> Current
                </div>
                <div className={`text-base font-black gradient-text`}>
                  {currentCgpa > 0 ? currentCgpa : 'N/A'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-surface-700/40 border border-slate-200/50 dark:border-indigo-950/40 text-center">
                <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-slate-400 mb-0.5">
                  <Target size={11} className="text-amber-400" /> Target
                </div>
                <div className="text-base font-black text-amber-500 dark:text-amber-400">
                  {targetCgpa || '8.50'}
                </div>
              </div>
            </div>

            {/* Credit Progress Meter */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200/40 dark:border-indigo-950/30">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold">Degree Progress</span>
                <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">
                  {earnedCredits}/{TOTAL_PROGRAM_CREDITS} CR ({creditsPct.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-surface-600/40 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${creditsPct}%` }}
                />
              </div>
            </div>

            {/* Attendance & Subscription indicators */}
            <div className="mt-2.5 space-y-1.5 pt-1.5 border-t border-slate-200/40 dark:border-indigo-950/30 text-[10px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <CheckCircle2 size={12} className={calculatedAttendancePercent >= 75 ? "text-emerald-400" : "text-amber-400"} />
                  Attendance:
                </span>
                <span className={`font-bold ${calculatedAttendancePercent >= 75 ? "text-emerald-500 dark:text-emerald-400" : "text-amber-500"}`}>
                  {calculatedAttendancePercent}%
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles size={12} className={hasEndSemSubscription ? "text-emerald-400" : "text-amber-400"} />
                  End-Sem Pass:
                </span>
                <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                  hasEndSemSubscription 
                    ? "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400" 
                    : "bg-amber-500/20 text-amber-500"
                }`}>
                  {hasEndSemSubscription ? "VIP ACTIVE 🌟" : "UPGRADE (₹99)"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. GROUPED NAVIGATION SECTIONS */}
          <div className="space-y-5">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-1.5">
                  {section.title}
                </p>
                
                <div className="space-y-0.5">
                  {section.items.map(({ id, label, icon: Icon, adminOnly }) => {
                    if (adminOnly && !isAdmin) return null;
                    const isActive = activeTab === id;

                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setActiveTab(id);
                          setIsOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold
                          transition-all duration-200 cursor-pointer group relative overflow-hidden
                          ${isActive 
                            ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-500/30 shadow-sm' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-surface-700/50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div className={`
                            p-1.5 rounded-lg transition-colors
                            ${isActive 
                              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' 
                              : 'bg-slate-100 dark:bg-surface-700 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                            }
                          `}>
                            <Icon size={15} />
                          </div>
                          <span>{label}</span>
                        </div>

                        {isActive && (
                          <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600 relative z-10" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 4. SIDEBAR FOOTER (Theme & Logout) */}
        <div className="p-4 border-t border-slate-200/80 dark:border-indigo-950/40 space-y-2 bg-slate-50/50 dark:bg-[#090915]/50">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-indigo-950/50 bg-white dark:bg-surface-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-500" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/30 bg-rose-500/10 text-xs font-semibold text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Sign Out"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-1">
            BytePath Scholar Suite © 2026
          </div>
        </div>

      </aside>
    </>
  );
}
