import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck, Gavel, Stethoscope } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.token && data.user) {
          login(data.token, data.user);
          navigate('/');
        } else {
          navigate('/login', {
            state: { registeredMessage: '🎉 Account created successfully! Please log in to access your dashboard.' }
          });
        }
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
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
              JOIN THE PLATFORM
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

        {/* Right Side: Register Form */}
        <div className="col-span-1 md:col-span-7 flex flex-col p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative h-full overflow-x-hidden overflow-y-auto">
          {/* Subtle gold accent background glow */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full max-w-md mx-auto my-auto py-2">
            {/* Elegant Horse Badge Emblem at Top */}
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 bg-[#020B21] shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center mb-5 mx-auto md:mx-0 shrink-0">
              <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
            </div>

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

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs mb-5 border border-red-200 flex items-start gap-3 shadow-sm animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Registration Error</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="off">

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

              {/* Email field */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">Email Address</label>
                <div className="relative group focus-within:text-[#D4AF37]">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
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
                      // Basic: Left bar RED
                      return {
                        label: 'Basic / Weak',
                        textClass: 'text-rose-500 font-bold',
                        bars: ['bg-rose-500', 'bg-slate-200', 'bg-slate-200']
                      };
                    } else if (score === 2) {
                      // Medium: Left & Middle ORANGE
                      return {
                        label: 'Medium Strength',
                        textClass: 'text-amber-500 font-bold',
                        bars: ['bg-amber-500', 'bg-amber-500', 'bg-slate-200']
                      };
                    } else {
                      // Strong: All three bars GREEN
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register Now</span>
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
        </div>

      </div>
    </div>
  );
};
