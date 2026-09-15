import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  Gavel, 
  Stethoscope, 
  KeyRound, 
  RotateCcw, 
  ArrowLeft 
} from 'lucide-react';
import { getApiUrl } from '../../config/api';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const otpInputsRef = useRef([]);

  const navigate = useNavigate();

  // Resend Timer Countdown
  useEffect(() => {
    let timer;
    if (isOtpStep && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, resendCooldown]);

  // Strict email regex validation helper
  const validateEmailFormat = (inputEmail) => {
    const trimmed = inputEmail.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
    if (!emailRegex.test(trimmed)) return false;
    const parts = trimmed.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) {
      return false;
    }
    const tld = domain.split('.').pop();
    return tld && tld.length >= 2 && /^[a-z]+$/.test(tld);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmailFormat(cleanEmail)) {
      setError('Please enter a valid official email address (e.g. name@gmail.com, name@domain.com).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: cleanEmail, phone: phone.trim(), password }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.requireOtp) {
          setOtpEmail(data.email || cleanEmail);
          setIsOtpStep(true);
          setResendCooldown(60);
          setSuccessMessage(data.message || `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox.`);
          setOtpDigits(['', '', '', '', '', '']);
          setTimeout(() => {
            if (otpInputsRef.current[0]) {
              otpInputsRef.current[0].focus();
            }
          }, 100);
        } else {
          navigate('/login', {
            state: { registeredMessage: '🎉 Account created successfully! Please log in to access your dashboard.' }
          });
        }
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Server connection error. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Input handlers
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...otpDigits];
    
    // Support pasting full 6 digit OTP from email
    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      if (otpInputsRef.current[nextIndex]) {
        otpInputsRef.current[nextIndex].focus();
      }
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance to next input box
    if (cleanVal && index < 5) {
      if (otpInputsRef.current[index + 1]) {
        otpInputsRef.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (otpInputsRef.current[index - 1]) {
        otpInputsRef.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMessage('');

    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code received on your email.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/auth/verify-email-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: otpCode }),
      });

      const data = await res.json();
      if (data.success) {
        // Redirect user to Login page with success toast
        navigate('/login', {
          state: { registeredMessage: '🎉 Email verified successfully! Please log in to access your account.' }
        });
      } else {
        setError(data.message || 'Invalid or expired verification code. Please check your email.');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch(getApiUrl('/api/auth/resend-email-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message || `A fresh 6-digit code has been dispatched to ${otpEmail}. Please check your inbox.`);
        setResendCooldown(60);
        setOtpDigits(['', '', '', '', '', '']);
        if (otpInputsRef.current[0]) {
          otpInputsRef.current[0].focus();
        }
      } else {
        setError(data.message || 'Failed to resend verification code.');
      }
    } catch (err) {
      setError('Server error while resending verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">
      {/* Full screen split grid */}
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-12">

        {/* Left Side: Premium Brand Visuals (Desktop only) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#020B21] via-[#0F172A] to-[#0B0F19] p-8 lg:p-10 flex-col justify-between relative overflow-hidden text-white border-r border-[#D4AF37]/20 h-full">
          {/* Animated Glow Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Top: Logo & Brand Header */}
          <div className="relative z-10 flex items-center gap-3 animate-fade-in">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 bg-[#020B21] shadow-[0_0_18px_rgba(212,175,55,0.4)] flex items-center justify-center shrink-0">
              <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold tracking-[0.25em] text-[#D4AF37] uppercase block leading-none mb-1">EQUESTRIAN PLATFORM</span>
              <span className="font-black text-sm tracking-tight text-white leading-none">Horse-Square-Pakistan</span>
            </div>
          </div>

          {/* Center: Heading & Seamless Golden Stallion Circular Medallion */}
          <div className="relative z-10 my-auto py-4 text-center animate-fade-in space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest">
              {isOtpStep ? 'EMAIL VERIFICATION' : 'JOIN THE PLATFORM'}
            </span>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Pakistan's Premier <span className="text-[#D4AF37] block mt-1">Equine Portal</span>
            </h1>

            {/* Seamless Circular Gold Stallion Medallion */}
            <div className="pt-2 pb-1">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#D4AF37] p-1 bg-[#020B21] shadow-[0_0_40px_rgba(212,175,55,0.45)] flex items-center justify-center mx-auto relative group">
                <img
                  src="/login and registeration .png"
                  alt="Majestic Stallion"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Bottom Trust Feature Bar & Footer */}
          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[9px] font-bold text-slate-300 leading-tight">Verified Listings</span>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center">
                <Gavel className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[9px] font-bold text-slate-300 leading-tight">Live Auctions</span>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center">
                <Stethoscope className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[9px] font-bold text-slate-300 leading-tight">24/7 AI Vet</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center font-medium">
              © {new Date().getFullYear()} HorseSquare Pakistan. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Form (Registration Form OR 6-Digit OTP Form) */}
        <div className="col-span-1 md:col-span-7 flex flex-col p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative h-full overflow-x-hidden overflow-y-auto">
          {/* Subtle gold accent background glow */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full max-w-md mx-auto my-auto py-2">
            
            {/* Emblem Badge */}
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 bg-[#020B21] shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center mb-5 mx-auto md:mx-0 shrink-0">
              <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs mb-5 border border-red-200 flex items-start gap-3 shadow-sm animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Notice</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* SUCCESS / OTP SENT ALERT */}
            {successMessage && (
              <div className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl text-xs mb-5 border border-emerald-200 flex items-start gap-3 shadow-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Verification Code Dispatched</span>
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {/* -------------------- STEP 2: OTP VERIFICATION UI (STRICTLY FROM EMAIL) -------------------- */}
            {isOtpStep ? (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider mb-2">
                    <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Email Verification Step
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Verify Your Email</h2>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-medium">
                    We sent a secure 6-digit verification code to <strong className="text-slate-800 font-bold">{otpEmail}</strong> from <span className="text-[#D4AF37] font-bold">horsesquarepakistan@gmail.com</span>. Please check your inbox and enter the code below.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  {/* 6 Digit Inputs */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Enter 6-Digit Code
                    </label>
                    <div className="flex justify-between gap-2 sm:gap-3">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputsRef.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black text-slate-900 bg-white border-2 border-slate-200 rounded-2xl focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 focus:outline-none shadow-sm transition-all duration-200"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length !== 6}
                    className="w-full py-3.5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#020B21] hover:from-[#1E293B] hover:to-[#0F172A] text-white font-black rounded-2xl shadow-xl border-t border-[#D4AF37]/30 hover:border-[#D4AF37] active:scale-[0.99] transition duration-300 cursor-pointer disabled:opacity-50 text-sm tracking-wide flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                        <span>Verify & Activate Account</span>
                      </>
                    )}
                  </button>

                  {/* Resend OTP & Back to form */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpStep(false);
                        setError('');
                        setSuccessMessage('');
                      }}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Change Email</span>
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || resending}
                      onClick={handleResendOtp}
                      className={`flex items-center gap-1.5 transition-colors ${
                        resendCooldown > 0
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-[#D4AF37] hover:text-[#B8942A] font-black cursor-pointer'
                      }`}
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                      {resendCooldown > 0
                        ? `Resend code in ${resendCooldown}s`
                        : 'Resend Verification Code'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* -------------------- STEP 1: REGISTRATION INPUT FORM -------------------- */
              <div>
                {/* Mobile Header */}
                <div className="md:hidden text-center mb-6">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Create <span className="text-[#D4AF37]">Account</span>
                  </h1>
                  <p className="text-slate-500 text-xs mt-2">Join HorseSquare Pakistan today</p>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:block mb-6">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                  <p className="text-slate-500 text-xs mt-1.5 font-medium">Sign up today and get started in the marketplace.</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5" autoComplete="off">

                  {/* Full Name field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">Full Name</label>
                    <div className="relative group focus-within:text-[#D4AF37]">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ali Khan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off"
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 shadow-sm transition-all duration-300"
                      />
                      <User className="w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Email field with official validation */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">Official Email Address</label>
                      <span className="text-[10px] text-slate-400 font-semibold">OTP sent to inbox</span>
                    </div>
                    <div className="relative group focus-within:text-[#D4AF37]">
                      <input
                        type="email"
                        required
                        placeholder="name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 shadow-sm transition-all duration-300"
                      />
                      <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Phone Number field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">Phone Number</label>
                    <div className="relative group focus-within:text-[#D4AF37]">
                      <input
                        type="text"
                        required
                        placeholder="+92 300 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="off"
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 shadow-sm transition-all duration-300"
                      />
                      <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">Password</label>
                    <div className="relative group focus-within:text-[#D4AF37]">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        className="w-full pl-11 pr-11 py-2.5 border border-slate-200 rounded-2xl bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 shadow-sm transition-all duration-300"
                      />
                      <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none" />

                      {/* Password visibility toggler */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">Confirm Password</label>
                    <div className="relative group focus-within:text-[#D4AF37]">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        className="w-full pl-11 pr-11 py-2.5 border border-slate-200 rounded-2xl bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 shadow-sm transition-all duration-300"
                      />
                      <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none" />

                      {/* Confirm password visibility toggler */}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Live 3-Bar Password Strength Calculator */}
                    {password.length > 0 && (() => {
                      const getStrength = (pass) => {
                        if (pass.length < 6) {
                          return {
                            label: 'Basic / Weak',
                            textClass: 'text-rose-500 font-bold',
                            bars: ['bg-rose-500', 'bg-slate-200', 'bg-slate-200']
                          };
                        }
                        const hasUpper = /[A-Z]/.test(pass);
                        const hasNum = /[0-9]/.test(pass);
                        const hasSpecial = /[^A-Za-z0-9]/.test(pass);

                        let score = 0;
                        if (pass.length >= 6) score += 1;
                        if (pass.length >= 8 && (hasUpper || hasNum)) score += 1;
                        if (pass.length >= 10 && hasUpper && hasNum && hasSpecial) score += 1;

                        if (score <= 1) {
                          return {
                            label: 'Basic / Weak',
                            textClass: 'text-rose-500 font-bold',
                            bars: ['bg-rose-500', 'bg-slate-200', 'bg-slate-200']
                          };
                        } else if (score === 2) {
                          return {
                            label: 'Medium Strength',
                            textClass: 'text-amber-500 font-bold',
                            bars: ['bg-amber-500', 'bg-amber-500', 'bg-slate-200']
                          };
                        } else {
                          return {
                            label: 'Strong Password',
                            textClass: 'text-emerald-500 font-bold',
                            bars: ['bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500']
                          };
                        }
                      };

                      const str = getStrength(password);

                      return (
                        <div className="pt-1.5 space-y-1 animate-fade-in">
                          <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                            <div className={`h-full rounded-full transition-all duration-300 ${str.bars[0]}`}></div>
                            <div className={`h-full rounded-full transition-all duration-300 ${str.bars[1]}`}></div>
                            <div className={`h-full rounded-full transition-all duration-300 ${str.bars[2]}`}></div>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400 font-medium">Strength Meter</span>
                            <span className={str.textClass}>{str.label}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#020B21] hover:from-[#1E293B] hover:to-[#0F172A] text-white font-black rounded-2xl shadow-xl border-t border-[#D4AF37]/30 hover:border-[#D4AF37] active:scale-[0.99] transition duration-300 cursor-pointer disabled:opacity-75 text-sm tracking-wide flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Register & Get Verification Code</span>
                        <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Bottom link */}
                <div className="mt-5 pt-5 border-t border-slate-200/60 text-center text-xs text-slate-600 font-medium">
                  Already registered?{' '}
                  <Link to="/login" className="text-[#D4AF37] font-black hover:text-[#B8942A] transition-colors hover:underline">
                    Login here
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
