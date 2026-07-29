import React, { useState, useEffect } from 'react';
import { useAcademicStore } from './hooks/useAcademicStore';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
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
import OnboardingModal from './components/OnboardingModal';
import { GraduationCap, ArrowRight, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const store = useAcademicStore();
  const [rollInput, setRollInput] = useState('');
  const [bgParticles, setBgParticles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        <div className="w-full max-w-md p-8 glass-card border border-slate-200/80 dark:border-indigo-950/30 shadow-2xl relative z-10 mx-4 rounded-3xl transition-all duration-500">
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/25 mb-4">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black gradient-text tracking-tight">BytePath</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
              B.Tech CS & IT Scholar Portal & Learning Management
            </p>
          </div>
          
          {/* Form Container */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email or Student Roll ID
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. BT/CSE/2026/042 or student@bytemail.edu"
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                className="app-input text-sm font-semibold shadow-sm py-3 px-4 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                defaultValue="password123"
                className="app-input text-sm font-semibold shadow-sm py-3 px-4 rounded-xl"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-indigo-500/25 cursor-pointer mt-2"
            >
              <span>Sign In to Portal</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick unique ID auto-fill link */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-indigo-950/20 text-center text-xs text-slate-400 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">First time here?</span>
            <button
              type="button"
              onClick={() => {
                const branches = ['CSE', 'IT', 'AI', 'DS'];
                const branch = branches[Math.floor(Math.random() * branches.length)];
                const num = String(Math.floor(100 + Math.random() * 900));
                const newId = `BT/${branch}/2026/${num}`;
                setRollInput(newId);
                store.handleLogin(newId);
              }}
              className="text-[11px] font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={12} /> Generate ID & Enter
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. MAIN HUB APPARATUS WITH LEFT SIDEBAR LAYOUT
  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-[#05050a] text-slate-800 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden flex">
      {/* Ambient glowing background blobs */}
      <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[130px] pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[130px] pointer-events-none animate-pulse-slow"></div>

      {/* Floating particles */}
      {bgParticles.map(p => (
        <div
          key={p.id}
          className="bg-particle bg-indigo-500/10 dark:bg-indigo-500/5 pointer-events-none"
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

      {/* Pinned Left Sidebar Container (Holds ALL Student Info & Nav) */}
      <Sidebar 
        studentId={store.studentId}
        studentName={store.studentName}
        handleLogout={store.handleLogout}
        theme={store.theme}
        setTheme={store.setTheme}
        currentCgpa={store.currentCgpa}
        targetCgpa={store.targetCgpa}
        earnedCredits={store.earnedCredits}
        calculatedAttendancePercent={store.calculatedAttendancePercent}
        hasEndSemSubscription={store.hasEndSemSubscription}
        activeTab={store.activeTab}
        setActiveTab={store.setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Right Content Workspace */}
      <div className="flex-1 md:pl-80 flex flex-col min-h-screen relative z-10 transition-all duration-300 w-full">
        {/* Top Header */}
        <TopHeader 
          activeTab={store.activeTab}
          studentId={store.studentId}
          currentCgpa={store.currentCgpa}
          theme={store.theme}
          setTheme={store.setTheme}
          handleLogout={store.handleLogout}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        {/* Dynamic Workspace Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-6">
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
              hasEndSemSubscription={store.hasEndSemSubscription}
              activateEndSemSubscription={store.activateEndSemSubscription}
              studentId={store.studentId}
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

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 dark:border-indigo-950/30 py-6 text-center text-[10px] text-slate-400 relative z-10 shrink-0 mt-auto">
          <p>© 2026 BytePath B.Tech CS & IT Scholar Hub. Integrated 196-Credit Curriculum.</p>
        </footer>
      </div>

      {/* First-Time Login Onboarding Modal */}
      <OnboardingModal
        isOpen={!!store.studentId && !store.isOnboarded}
        studentId={store.studentId}
        initialTargetCgpa={store.targetCgpa}
        onComplete={store.saveOnboardingProfile}
      />
    </div>
  );
}
