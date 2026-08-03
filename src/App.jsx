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
import { getActiveSession, registerAccount, signIn } from './services/authApi';
import { GraduationCap, ArrowRight, Check, CheckCircle2, Copy, Mail, UserRound } from 'lucide-react';

export default function App() {
  const store = useAcademicStore();
  const [authMode, setAuthMode] = useState('signin');
  const [identity, setIdentity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedAccount, setIssuedAccount] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
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

  // Restore a previously authenticated account, including after a browser refresh.
  useEffect(() => {
    const session = getActiveSession();
    if (!store.studentId && session?.loginId) {
      store.handleLogin(session);
    }
  }, [store.handleLogin, store.studentId]);

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setIssuedAccount(null);
    setPassword('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        const account = await registerAccount({ name, email, password });
        setIssuedAccount(account);
      } else {
        const account = await signIn({ identity, password });
        store.handleLogin(account);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'We could not sign you in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUniqueId = async () => {
    if (!issuedAccount?.loginId) return;

    try {
      await navigator.clipboard.writeText(issuedAccount.loginId);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setAuthError('Copy your unique ID manually before continuing.');
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
              Plan your B.Tech semester with clarity
            </p>
          </div>
          
          <div className="grid grid-cols-2 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] p-1 mb-6" role="tablist" aria-label="Authentication options">
            <button type="button" onClick={() => switchAuthMode('signin')} className={`min-h-10 rounded-lg py-2 text-sm font-bold transition ${authMode === 'signin' ? 'bg-white dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} role="tab" aria-selected={authMode === 'signin'}>Sign in</button>
            <button type="button" onClick={() => switchAuthMode('signup')} className={`min-h-10 rounded-lg py-2 text-sm font-bold transition ${authMode === 'signup' ? 'bg-white dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} role="tab" aria-selected={authMode === 'signup'}>Create account</button>
          </div>

          {/* Form Container */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="full-name">Full name</label>
                <div className="relative">
                  <UserRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="full-name" type="text" required autoComplete="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="app-input text-sm font-semibold shadow-sm py-3 pl-10 pr-4 rounded-xl" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="account-identity">
                {authMode === 'signup' ? 'Google account email' : 'Unique ID or Google account email'}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="account-identity" type="text" required autoComplete={authMode === 'signup' ? 'email' : 'username'} placeholder={authMode === 'signup' ? 'name@gmail.com' : 'BTP-2026-AB12CD or name@gmail.com'} value={authMode === 'signup' ? email : identity} onChange={(e) => authMode === 'signup' ? setEmail(e.target.value) : setIdentity(e.target.value)} className="app-input text-sm font-semibold shadow-sm py-3 pl-10 pr-4 rounded-xl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="account-password">
                BytePath password
              </label>
              <input 
                id="account-password"
                type="password"
                required
                placeholder="••••••••"
                minLength={8}
                autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="app-input text-sm font-semibold shadow-sm py-3 px-4 rounded-xl"
              />
            </div>
            {authError && (
              <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-300" role="alert">
                {authError}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-indigo-500/25 cursor-pointer disabled:cursor-wait disabled:opacity-70 mt-2"
            >
              <span>{isSubmitting ? 'Please wait…' : authMode === 'signup' ? 'Create account & get ID' : 'Sign in to portal'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {issuedAccount && (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 size={18} />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">Account created — save your unique ID</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <code className="text-sm font-black tracking-wide text-indigo-600 dark:text-indigo-200">{issuedAccount.loginId}</code>
                <button type="button" onClick={copyUniqueId} className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-500/10" aria-label="Copy unique BytePath ID">
                  {isCopied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
              <button type="button" onClick={() => store.handleLogin(issuedAccount)} className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                Continue to portal <ArrowRight size={13} className="inline" />
              </button>
            </div>
          )}

          {/* Quick unique ID auto-fill link */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-indigo-950/20 text-center text-sm text-slate-400 flex items-center justify-between gap-3">
            <span>{authMode === 'signin' ? 'First time here?' : 'Already registered?'}</span>
            <button
              type="button"
              onClick={() => switchAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
            >
              {authMode === 'signin' ? 'Create an account' : 'Already have an account? Sign in'}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. MAIN HUB APPARATUS WITH LEFT SIDEBAR LAYOUT
  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-[#05050a] text-slate-800 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden flex">
      <a className="skip-link" href="#main-content">Skip to main content</a>
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
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 w-full space-y-6" tabIndex="-1">
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
        <footer className="border-t border-slate-200/80 dark:border-indigo-950/30 py-6 text-center text-xs text-slate-400 relative z-10 shrink-0 mt-auto">
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
