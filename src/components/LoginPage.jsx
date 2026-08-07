import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Copy, 
  Mail, 
  UserRound, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  X,
  Zap
} from 'lucide-react';
import { registerAccount, signIn, signInWithGoogleProfile, signInWithGoogleCredential } from '../services/authApi';

// Official Google G SVG Logo
function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('signin');
  const [identity, setIdentity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedAccount, setIssuedAccount] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');

  // Auto-initialize Google One-Tap if client ID is set in environment
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            try {
              const session = await signInWithGoogleCredential(response.credential);
              onLoginSuccess(session);
            } catch (err) {
              setAuthError(err.message || 'Google Auth failed');
            }
          }
        });
      } catch (e) {
        console.warn('Google One Tap init skipped', e);
      }
    }
  }, [onLoginSuccess]);

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setIssuedAccount(null);
    setPassword('');
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200 dark:bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-indigo-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(password);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        const account = await registerAccount({ name, email, password });
        setIssuedAccount(account);
      } else {
        const account = await signIn({ identity, password });
        onLoginSuccess(account);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignInClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // Show smooth Google Sign-In account selector modal for local development / testing
      setShowGoogleModal(true);
    }
  };

  const handleSimulatedGoogleLogin = async (selectedProfile) => {
    setIsSubmitting(true);
    setAuthError('');
    try {
      const session = await signInWithGoogleProfile({
        name: selectedProfile.name,
        email: selectedProfile.email,
        picture: selectedProfile.picture
      });
      setShowGoogleModal(false);
      onLoginSuccess(session);
    } catch (err) {
      setAuthError(err.message || 'Google Auth login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleCustomEmail.trim()) return;
    await handleSimulatedGoogleLogin({
      name: googleCustomName.trim() || 'Google Student',
      email: googleCustomEmail.trim()
    });
  };

  const copyUniqueId = async () => {
    if (!issuedAccount?.loginId) return;
    try {
      await navigator.clipboard.writeText(issuedAccount.loginId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setAuthError('Copy your unique ID manually.');
    }
  };

  const handleQuickDemoStudent = async () => {
    setIsSubmitting(true);
    setAuthError('');
    try {
      let session;
      try {
        session = await signIn({ identity: 'BTP-2026-CS8899', password: 'demo-student-pass' });
      } catch {
        // Create demo student if not exists
        session = await registerAccount({
          name: 'Aarav Sharma',
          email: 'aarav.cs2026@gmail.com',
          password: 'demo-student-pass'
        });
      }
      onLoginSuccess(session);
    } catch {
      onLoginSuccess({ loginId: 'BTP-2026-CS8899', name: 'Aarav Sharma', email: 'aarav.cs2026@gmail.com' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    onLoginSuccess({ loginId: 'admin', name: 'System Admin', email: 'admin@bytepath.edu' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05050f] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Animated Blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-pink-600/5 blur-[160px] pointer-events-none" />

      {/* Main Grid Container */}
      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Hero Section (Hidden on small screens) */}
        <div className="lg:col-span-6 space-y-6 hidden lg:block pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
            <Sparkles size={14} className="text-amber-400 animate-spin-slow" />
            <span>B.Tech CS & IT Curriculum Suite 2.0</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
              Master Your Degree. <br />
              <span className="gradient-text">Launch Your Career.</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Integrated 196-credit curriculum tracking, real-time CGPA estimation, AI study advice, and full-stack web dev roadmap.
            </p>
          </div>

          {/* Feature Highlight Pills */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl glass-card border border-indigo-500/20 bg-indigo-500/5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                <BookOpen size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">196 Credits Sync</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">8 Full Semesters Mapped</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl glass-card border border-purple-500/20 bg-purple-500/5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                <Brain size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ByteAI Advisor</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Personalized Study Advice</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl glass-card border border-pink-500/20 bg-pink-500/5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">CGPA Predictor</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Required Future SGPA Math</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl glass-card border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">75% Attendance Guard</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Class Ledger Safety Alert</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center gap-4 text-xs text-slate-400">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-[10px] text-white border-2 border-[#05050f]">AS</div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center font-bold text-[10px] text-white border-2 border-[#05050f]">RK</div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center font-bold text-[10px] text-white border-2 border-[#05050f]">PS</div>
            </div>
            <span>Trusted by 2,500+ B.Tech Computer Science & IT Scholars</span>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="glass-card border border-indigo-900/40 bg-[#0b0c1e]/90 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <GraduationCap size={26} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-2xl font-black gradient-text tracking-tight">BytePath</h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">v2.0</span>
                </div>
                <p className="text-xs text-slate-400">Scholar Portal Authentication</p>
              </div>
            </div>

            {/* Google Authentication Button */}
            <div className="mb-5 space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignInClick}
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]"
              >
                <GoogleIcon className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-800" />
                <span className="bg-[#0b0c1e] px-3 text-[11px] uppercase font-bold text-slate-500 tracking-wider relative z-10">
                  Or use BytePath ID / Email
                </span>
              </div>
            </div>

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900/80 border border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => switchAuthMode('signin')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'signin' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchAuthMode('signup')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'signup' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Main Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="full-name">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="full-name"
                      type="text"
                      required
                      placeholder="e.g. Anjali Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="app-input text-xs font-medium py-3 pl-10 pr-4 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 w-full"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="identity-field">
                  {authMode === 'signup' ? 'Google Account Email' : 'Unique BytePath ID or Google Email'}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="identity-field"
                    type="text"
                    required
                    placeholder={authMode === 'signup' ? 'name@gmail.com' : 'BTP-2026-AB12CD or name@gmail.com'}
                    value={authMode === 'signup' ? email : identity}
                    onChange={(e) => authMode === 'signup' ? setEmail(e.target.value) : setIdentity(e.target.value)}
                    className="app-input text-xs font-medium py-3 pl-10 pr-4 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="password-field">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password-field"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="app-input text-xs font-medium py-3 pl-10 pr-10 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password strength bar on signup */}
                {authMode === 'signup' && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-medium">Strength:</span>
                      <span className="font-bold text-slate-300">{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Verifying...' : authMode === 'signup' ? 'Create Account & Issue ID' : 'Sign In to Portal'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Issued unique ID card */}
            {issuedAccount && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 size={16} />
                  <span>Account Created Successfully!</span>
                </div>
                <p className="text-[11px] text-slate-300">Save your unique BytePath ID:</p>
                <div className="flex items-center justify-center gap-2 bg-slate-900/90 py-1.5 px-3 rounded-xl border border-emerald-500/40">
                  <code className="text-sm font-mono font-black text-emerald-300">{issuedAccount.loginId}</code>
                  <button
                    type="button"
                    onClick={copyUniqueId}
                    className="p-1 text-emerald-400 hover:text-white rounded"
                    aria-label="Copy ID"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onLoginSuccess(issuedAccount)}
                  className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1 pt-1"
                >
                  Enter Scholar Workspace <ArrowRight size={12} />
                </button>
              </div>
            )}

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold">Quick Demo Shortcuts:</span>
                <span className="text-[10px] text-indigo-400 font-bold">1-Click Test</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoStudent}
                  className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 text-[11px] font-bold text-indigo-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Zap size={13} className="text-amber-400" />
                  <span>Student Demo</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-[11px] font-bold text-purple-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ShieldCheck size={13} className="text-purple-400" />
                  <span>Admin Console</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Interactive Google Sign-In Account Selector Modal for Testing */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1126] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative space-y-5 animate-scale-in">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white flex items-center justify-center shadow-md">
                <GoogleIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Sign in with Google</h3>
                <p className="text-xs text-slate-400">Choose an account to continue to BytePath</p>
              </div>
            </div>

            {/* Preset Demo Google Accounts */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSimulatedGoogleLogin({
                  name: 'Anjali Sharma',
                  email: 'anjali.cs2026@gmail.com',
                  picture: ''
                })}
                className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 text-left transition"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  AS
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Anjali Sharma</p>
                  <p className="text-[11px] text-slate-400 truncate">anjali.cs2026@gmail.com</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Verified</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulatedGoogleLogin({
                  name: 'Rohan Verma',
                  email: 'rohan.it2026@gmail.com',
                  picture: ''
                })}
                className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 text-left transition"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                  RV
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Rohan Verma</p>
                  <p className="text-[11px] text-slate-400 truncate">rohan.it2026@gmail.com</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Verified</span>
              </button>
            </div>

            {/* Custom Google Account Input */}
            <form onSubmit={handleCustomGoogleSubmit} className="pt-3 border-t border-slate-800 space-y-3">
              <p className="text-xs font-bold text-slate-300">Or enter any Google account:</p>
              <input
                type="email"
                required
                placeholder="your.google.account@gmail.com"
                value={googleCustomEmail}
                onChange={(e) => setGoogleCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign in as Google Account</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
