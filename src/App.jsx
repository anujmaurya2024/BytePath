import React, { useState, useEffect } from 'react';
import { useAcademicStore } from './hooks/useAcademicStore';
import Header from './components/Header';
import TabNav from './components/TabNav';
import Dashboard from './components/Dashboard';
import SemestersPanel from './components/SemestersPanel';
import PredictorPanel from './components/PredictorPanel';
import SyllabusPanel from './components/SyllabusPanel';
import FocusZone from './components/FocusZone';
import DeadlineTracker from './components/DeadlineTracker';
import ExpenseTracker from './components/ExpenseTracker';
import GradeSimulator from './components/GradeSimulator';
import CareerPanel from './components/CareerPanel';
import AdminPortal from './components/AdminPortal';
import AdvisorPanel from './components/AdvisorPanel';
import { GraduationCap, ArrowRight, Shield } from 'lucide-react';

export default function App() {
  const store = useAcademicStore();
  const [rollInput, setRollInput] = useState('');
  const [bgParticles, setBgParticles] = useState([]);

  // Generate floating background particles on mount
  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, idx) => ({
      id: idx,
      size: Math.random() * 6 + 2, // size in px
      left: Math.random() * 100, // left %
      bottom: -10, // starts from bottom
      delay: Math.random() * 8, // animation delay
      duration: Math.random() * 15 + 10, // speed
      opacity: Math.random() * 0.3 + 0.1
    }));
    setBgParticles(generated);
  }, []);

  // Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (rollInput.trim()) {
      store.handleLogin(rollInput.trim());
    }
  };

  // 1. LOGIN GATEWAY VIEW
  if (!store.studentId) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#05050c] text-slate-800 dark:text-slate-200 transition-colors duration-500">
        {/* Ambient glowing blobs */}
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[130px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[130px] pointer-events-none animate-pulse-slow"></div>

        {/* Floating background particles */}
        {bgParticles.map(p => (
          <div
            key={p.id}
            className="bg-particle bg-indigo-500/20 dark:bg-indigo-500/10"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: p.opacity
            }}
          />
        ))}

        <div className="w-full max-w-md p-8 glass-card border border-slate-200 dark:border-indigo-950/20 shadow-2xl relative z-10 mx-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)] dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)]">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/35 mb-4 animate-bounce">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black gradient-text tracking-tight">BytePath</h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Track CS & IT credits, predict CGPA targets, and organize student workflows.
            </p>
          </div>
          
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-500 mb-2">
                University Roll Number / ID
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. BT/CSE/2026/042, BT/IT/2026/012 or 'admin'"
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                className="app-input text-center text-base font-semibold shadow-sm"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md cursor-pointer"
            >
              <span>Access Profile</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick tips */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-indigo-950/15 text-center text-[10px] text-slate-455 flex justify-center items-center gap-1.5">
            <Shield size={11} className="text-indigo-400" />
            <span>Type <strong>admin</strong> to publish custom materials.</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN HUB APPARATUS
  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-[#05050a] text-slate-800 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      {/* Ambient glowing blobs */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[130px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[130px] pointer-events-none animate-pulse-slow"></div>

      {/* Floating particles */}
      {bgParticles.map(p => (
        <div
          key={p.id}
          className="bg-particle bg-indigo-500/10 dark:bg-indigo-500/5"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col flex-1">
        {/* Sticky Header */}
        <Header 
          studentId={store.studentId}
          handleLogout={store.handleLogout}
          theme={store.theme}
          setTheme={store.setTheme}
          currentCgpa={store.currentCgpa}
        />

        {/* Dynamic Nav Tabs */}
        <TabNav 
          activeTab={store.activeTab}
          setActiveTab={store.setActiveTab}
          studentId={store.studentId}
        />

        {/* Main Workspace container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
          {store.activeTab === 'dashboard' && (
            <Dashboard 
              chartData={store.chartData}
              currentCgpa={store.currentCgpa}
              targetCgpa={store.targetCgpa}
              earnedCredits={store.earnedCredits}
              remainingCredits={store.remainingCredits}
              calculatedAttendancePercent={store.calculatedAttendancePercent}
              focusSessions={store.focusSessions}
              expenses={store.expenses}
              monthlyBudget={store.monthlyBudget}
              setActiveTab={store.setActiveTab}
            />
          )}

          {store.activeTab === 'advisor' && (
            <AdvisorPanel 
              advisorChat={store.advisorChat}
              addUserChat={store.addUserChat}
              clearChatLogs={store.clearChatLogs}
              currentSemester={store.currentSemester}
              currentCgpa={store.currentCgpa}
              targetCgpa={store.targetCgpa}
              calculatedAttendancePercent={store.calculatedAttendancePercent}
            />
          )}

          {store.activeTab === 'semesters' && (
            <SemestersPanel 
              pastSgpas={store.pastSgpas}
              updateSemesterSGPA={store.updateSemesterSGPA}
              attendanceLogs={store.attendanceLogs}
              setAttendanceLogs={store.setAttendanceLogs}
            />
          )}

          {store.activeTab === 'predictor' && (
            <PredictorPanel 
              currentCgpa={store.currentCgpa}
              targetCgpa={store.targetCgpa}
              setTargetCgpa={store.setTargetCgpa}
              cgpaPredictor={store.cgpaPredictor}
              earnedCredits={store.earnedCredits}
              remainingCredits={store.remainingCredits}
              pastSgpas={store.pastSgpas}
            />
          )}

          {store.activeTab === 'pyqs' && (
            <SyllabusPanel 
              uploadedPyqs={store.uploadedPyqs}
            />
          )}

          {store.activeTab === 'focus' && (
            <FocusZone 
              focusSessions={store.focusSessions}
              setFocusSessions={store.setFocusSessions}
            />
          )}

          {store.activeTab === 'deadlines' && (
            <DeadlineTracker 
              deadlines={store.deadlines}
              setDeadlines={store.setDeadlines}
            />
          )}

          {store.activeTab === 'expenses' && (
            <ExpenseTracker 
              expenses={store.expenses}
              setExpenses={store.setExpenses}
              monthlyBudget={store.monthlyBudget}
              setMonthlyBudget={store.setMonthlyBudget}
            />
          )}

          {store.activeTab === 'gradesim' && (
            <GradeSimulator 
              currentSemester={store.currentSemester}
              simulatedGrades={store.simulatedGrades}
              setSimulatedGrades={store.setSimulatedGrades}
              simulatedSgpa={store.simulatedSgpa}
              currentCgpa={store.currentCgpa}
              targetCgpa={store.targetCgpa}
            />
          )}

          {store.activeTab === 'career' && (
            <CareerPanel 
              careerPhase={store.careerPhase}
              currentSemester={store.currentSemester}
            />
          )}

          {store.activeTab === 'admin' && (
            <AdminPortal 
              uploadedPyqs={store.uploadedPyqs}
              setUploadedPyqs={store.setUploadedPyqs}
              studentId={store.studentId}
            />
          )}
        </main>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 dark:border-indigo-950/20 py-6 text-center text-[10px] text-slate-400 relative z-10 shrink-0">
        <p>© 2026 BytePath CS & IT Scholar Hub. Integrated B.Tech CS & IT Course Syllabus.</p>
        <p className="mt-1 font-mono text-[9px] opacity-75">
          Program weight: 196 credits. Built with React & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}
