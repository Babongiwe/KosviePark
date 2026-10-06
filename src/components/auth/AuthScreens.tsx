import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Lock,
  UserPlus,
  HelpCircle,
  Car,
  Mail,
  Shield,
  Building2,
  GraduationCap,
  UserCheck,
} from 'lucide-react';

export const AuthScreens: React.FC = () => {
  const { login, registerUser, addToast, findUserForReset, resetPassword, sessionMessage, lastLoginRole } = useApp();

  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot' | 'reset_success'>('login');
  const [infoMessage, setInfoMessage] = useState('');
  const [forgotId, setForgotId] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');

  // Role tab state for sign in (Student, Staff, Security, Admin)
  const [selectedRoleTab, setSelectedRoleTab] = useState<'student' | 'staff' | 'visitor' | 'security' | 'admin'>(lastLoginRole as 'student');

  // Credentials
  const [identifierInput, setIdentifierInput] = useState('2024098124');
  const [password, setPassword] = useState('Kovsie2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Login lockout (3 tiers): 4 failures -> 30s, 8 -> 5 min, 12 -> suspended until password reset
  const [failedAttempts, setFailedAttempts] = useState<Record<string, number>>({});
  const [lockedUntil, setLockedUntil] = useState<Record<string, number>>({});
  const [suspended, setSuspended] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(Date.now());
  const lockKey = `${selectedRoleTab}:${identifierInput.trim().toLowerCase()}`;
  const secondsLeft = Math.max(0, Math.ceil(((lockedUntil[lockKey] || 0) - now) / 1000));
  const isLocked = secondsLeft > 0 || !!suspended[lockKey];

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regIdNum, setRegIdNum] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  const handleRoleTabChange = (role: 'student' | 'staff' | 'visitor' | 'security' | 'admin') => {
    setSelectedRoleTab(role);
    setErrorMessage('');
    if (role === 'student') {
      setIdentifierInput('2024098124');
    } else if (role === 'staff') {
      setIdentifierInput('STF-2024-889');
    } else if (role === 'visitor') {
      setIdentifierInput('9905125800083');
    } else if (role === 'security') {
      setIdentifierInput('SEC-2024-007');
    } else if (role === 'admin') {
      setIdentifierInput('ADM-2024-001');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifierInput.trim()) {
      setErrorMessage('Please enter your identifier / student / staff number.');
      return;
    }

    if (suspended[lockKey]) {
      setErrorMessage('Account locked. Reset your password or contact support.');
      return;
    }
    if (secondsLeft > 0) return;

    const cleanUser = identifierInput.trim();
    const result = login(cleanUser, password, selectedRoleTab);
    if (result === 'not_found') {
      const label = { student: 'student number', staff: 'staff number', security: 'Security Officer ID', admin: 'Administrator ID', visitor: 'Visitor ID number' }[selectedRoleTab];
      setErrorMessage(`This ${label} does not exist. Please check it and try again.`);
    } else if (result === 'wrong_password') {
      const count = (failedAttempts[lockKey] || 0) + 1;
      setFailedAttempts((prev) => ({ ...prev, [lockKey]: count }));
      if (count >= 12) {
        setSuspended((prev) => ({ ...prev, [lockKey]: true }));
        setErrorMessage('Account locked. Reset your password or contact support.');
      } else if (count % 4 === 0) {
        const secs = count === 4 ? 30 : 300;
        setNow(Date.now());
        setLockedUntil((prev) => ({ ...prev, [lockKey]: Date.now() + secs * 1000 }));
        setErrorMessage(
          count === 4
            ? 'Too many attempts. Try again in 30 seconds.'
            : 'Account locked. Try again in 5 minutes or reset your password.'
        );
      } else {
        setErrorMessage(`Incorrect password. ${4 - (count % 4)} attempt(s) left before a temporary lock.`);
      }
    } else {
      setFailedAttempts((prev) => ({ ...prev, [lockKey]: 0 }));
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regIdNum || !regPassword || !regConfirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (!/^\d{13}$/.test(regIdNum.trim())) {
      setErrorMessage('The ID number must have 13 digits.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('The passwords do not match. Please try again.');
      return;
    }
    setErrorMessage('');
    registerUser({
      id: `usr-reg-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: 'visitor',
      identifierNumber: regIdNum.trim(),
      departmentOrFaculty: 'Visitor Services',
      phoneNumber: regPhone.trim(),
    });
    addToast('Account Created', `Welcome to KovsiePark, ${regName}! Please sign in with your ID number and password.`, 'success');
    setIdentifierInput(regIdNum.trim());
    setPassword(regPassword);
    setSelectedRoleTab('visitor');
    setAuthView('login');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotId.trim() || !forgotEmail.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (!findUserForReset(forgotId, forgotEmail)) {
      setErrorMessage('We could not find an account with that ID and email address.');
      return;
    }
    setErrorMessage('');
    setAuthView('reset_success');
  };

  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw || !newPw2) return setErrorMessage('Please fill in all required fields.');
    if (newPw.length < 6) return setErrorMessage('Password must be at least 6 characters.');
    if (newPw !== newPw2) return setErrorMessage('The passwords do not match. Please try again.');
    resetPassword(forgotId, forgotEmail, newPw);
    setSuspended({});
    setLockedUntil({});
    setFailedAttempts({});
    setErrorMessage('');
    setIdentifierInput(forgotId.trim());
    setPassword('');
    setInfoMessage('Your password has been reset. Please sign in.');
    setNewPw(''); setNewPw2('');
    setAuthView('login');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#f3f6fb] overflow-x-hidden font-sans select-none p-6 sm:p-10 lg:p-16 relative">
      {/* Decorative blue background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#2672ec] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-[#005DB5] opacity-[0.08] rounded-full blur-3xl"></div>
      </div>
        <div className="max-w-md w-full mx-auto space-y-6 relative z-10">
          {/* VIEW 1: SIGN IN */}
          {authView === 'login' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101010] tracking-tight text-center">
                  Sign in to <span className="text-[#2672ec]">KovsiePark</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 text-center">
                  Use your UFS student or staff credentials.
                </p>
              </div>

              {/* Sign-in card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xl shadow-slate-900/10 space-y-5">

              {/* Role tabs: Student | Staff | Visitor | Security | Admin */}
              <div className="p-1 bg-slate-100 rounded-xl grid grid-cols-5 gap-1">
                {([
                  ['student', 'Student'],
                  ['staff', 'Staff'],
                  ['visitor', 'Visitor'],
                  ['security', 'Security'],
                  ['admin', 'Admin'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRoleTabChange(value)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all cursor-pointer truncate ${
                      selectedRoleTab === value
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {(infoMessage || sessionMessage) && !errorMessage && (
                <div className="p-3 bg-[#e8f0fe] border border-[#2672ec]/30 rounded-lg flex items-center gap-2 text-xs text-[#0067b8]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{infoMessage || sessionMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Identifier Input (Student / Staff / Visitor / ID Number) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {selectedRoleTab === 'student'
                      ? 'Student Number'
                      : selectedRoleTab === 'staff'
                      ? 'Staff Number'
                      : selectedRoleTab === 'visitor'
                      ? 'ID / Passport No.'
                      : selectedRoleTab === 'security'
                      ? 'Security Officer ID'
                      : 'Administrator ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    placeholder={
                      selectedRoleTab === 'student'
                        ? 'e.g. 2023057876'
                        : selectedRoleTab === 'staff'
                        ? 'e.g. STF-2024-889'
                        : selectedRoleTab === 'visitor'
                        ? 'e.g. 9905125800083 (13-digit ID)'
                        : selectedRoleTab === 'security'
                        ? 'e.g. SEC-2024-007'
                        : 'e.g. ADM-2024-001'
                    }

                    className="w-full px-3.5 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-sm text-[#101010] placeholder:text-slate-500 focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010] transition-all"
                  />
                </div>

                {/* Password Input with Show / Hide Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3.5 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-sm text-[#101010] placeholder:text-slate-500 focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010] transition-all pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* 
                  Remember me & Forgot Password Row (Placed BELOW password, ABOVE Sign In)
                */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#2672ec] focus:ring-[#2672ec] cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => { setErrorMessage(''); setInfoMessage(''); setAuthView('forgot'); }}
                    className="text-xs font-bold text-[#0067b8] hover:text-[#005DB5] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Blue Sign In Button (matching UFS portal) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLocked}
                    className="w-full py-3 bg-[#2672ec] hover:bg-[#005DB5] active:bg-[#002C8C] text-white font-bold text-sm rounded-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{suspended[lockKey] ? 'Account locked' : secondsLeft > 0 ? `Try again in ${secondsLeft}s` : 'Sign In'}</span>
                  </button>
                </div>

              </form>
              </div>

              {/* 
                NEED ACCESS? Section & Registration below Sign In button
                Only shown on the Visitor tab
              */}
              <div className="pt-2 text-center space-y-3">
                {selectedRoleTab === 'visitor' && (
                  <>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  NEED ACCESS?
                </span>

                <div className="p-3 bg-[#e8f0fe] border border-[#2672ec]/20 rounded-sm text-left">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong className="text-[#0067b8] font-bold">First-time visitors:</strong> click Create an Account below.

                  </p>
                </div>

                {/* Prominent Create an Account Button */}
                <button
                  type="button"
                  onClick={() => { setErrorMessage(''); setInfoMessage(''); setAuthView('register'); }}
                  className="w-full py-3 px-4 bg-white hover:bg-[#e8f0fe] border border-[#2672ec]/40 hover:border-[#2672ec] text-[#0067b8] font-bold text-xs rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <UserPlus className="w-4 h-4 text-[#2672ec] group-hover:scale-110 transition-transform" />
                  <span>Create an Account</span>
                </button>
                  </>
                )}

                <p className="text-[11px] text-slate-600 pt-1">
                  Trouble signing in?{' '}
                  <a
                    href="mailto:parking@ufs.ac.za"
                    className="font-bold text-[#0067b8] hover:underline"
                  >
                    Contact Support
                  </a>
                </p>
              </div>

            </div>
          )}

          {/* VIEW 2: REGISTER (For First-time users and Visitors) */}
          {authView === 'register' && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-[#101010] font-serif tracking-tight">
                  Create a Visitor Account
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Register to request KovsiePark parking clearance.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xl shadow-slate-900/10">
              <form noValidate onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#0067b8] mb-1">Full Name & Surname *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Babongiwe Magubane"
                    className="w-full px-3 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0067b8] mb-1">
                    ID / Passport No. *
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={13}
                    value={regIdNum}
                    onChange={(e) => setRegIdNum(e.target.value.replace(/\D/g, '').slice(0, 13))}
                    placeholder="13 digits e.g. 9901015000087"
                    className="w-full px-3 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs font-mono text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">{regIdNum.length}/13 digits</p>
                </div>

                <div>
                  <label className="block font-bold text-[#0067b8] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. student@ufs.ac.za or personal email"
                    className="w-full px-3 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0067b8] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. +27 82 555 1234"
                    className="w-full px-3 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0067b8] mb-1">Create Password *</label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0067b8] mb-1">Confirm Password *</label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRegPassword}
                    onChange={(e) => setShowRegPassword(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600 font-medium">Show passwords</span>
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#2672ec] hover:bg-[#005DB5] text-white font-bold text-xs rounded-sm shadow-sm transition-colors cursor-pointer"
                  >
                    Complete Registration & Sign In
                  </button>
                </div>
              </form>
              </div>

              <div className="text-center pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="font-bold text-[#0067b8] hover:underline cursor-pointer"
                >
                  ← Return to Sign In
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: FORGOT PASSWORD */}
          {authView === 'forgot' && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-[#101010] font-serif tracking-tight">Reset Password</h2>
                <p className="text-xs text-slate-600 mt-1">Enter your ID / number and the email address on your account.</p>
              </div>
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
                </div>
              )}
              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xl shadow-slate-900/10">
              <form noValidate onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">ID / Student / Staff Number *</label>
                  <input type="text" value={forgotId} onChange={(e) => setForgotId(e.target.value)} placeholder="e.g. 2024098124" className="w-full px-3.5 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Email Address *</label>
                  <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="e.g. student@ufs.ac.za" className="w-full px-3.5 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#2672ec] hover:bg-[#005DB5] text-white font-bold text-xs rounded-sm shadow-sm transition-colors cursor-pointer">Continue</button>
                <div className="text-center pt-2 text-xs">
                  <button type="button" onClick={() => { setErrorMessage(''); setAuthView('login'); }} className="font-bold text-[#0067b8] hover:underline cursor-pointer">← Back to Sign In</button>
                </div>
              </form>
              </div>
            </div>
          )}

          {/* VIEW 4: NEW PASSWORD */}
          {authView === 'reset_success' && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-[#101010] font-serif tracking-tight">Choose a New Password</h2>
                <p className="text-xs text-slate-600 mt-1">Account verified for <strong>{forgotEmail}</strong>.</p>
              </div>
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
                </div>
              )}
              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xl shadow-slate-900/10">
              <form noValidate onSubmit={handleNewPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">New Password *</label>
                  <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 6 characters" className="w-full px-3.5 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Confirm New Password *</label>
                  <input type="password" value={newPw2} onChange={(e) => setNewPw2(e.target.value)} placeholder="Re-enter password" className="w-full px-3.5 py-2.5 bg-[#e8f0fe] border border-slate-300 rounded-sm text-xs text-[#101010] focus:outline-none focus:border-[#101010] focus:ring-1 focus:ring-[#101010]" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#2672ec] hover:bg-[#005DB5] text-white font-bold text-xs rounded-sm shadow-sm transition-colors cursor-pointer">Reset Password</button>
              </form>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};


