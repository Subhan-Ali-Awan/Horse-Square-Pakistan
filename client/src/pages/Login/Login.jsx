import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const location = useLocation();
  const registeredMessage = location.state?.registeredMessage;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Server connection error. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">
      {/* Full screen split grid */}
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-12">

        {/* Left Side: Premium Brand Visuals (Desktop only) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#020B21] via-[#030F2D] to-[#010512] p-10 flex-col justify-between relative overflow-hidden text-white border-r border-[#D4AF37]/20 h-full">
          {/* Ambient Glow Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

          {/* Top: Logo & Brand Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#D4AF37]/60 p-0.5 bg-[#020B21] shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center shrink-0">
              <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase block leading-none mb-0.5">Platform</span>
              <span className="font-extrabold text-sm tracking-tight text-white leading-none">Horse-Square-Pakistan</span>
            </div>
          </div>

          {/* Center: Heading & Majestic Horse Image Card */}
          <div className="relative z-10 my-auto py-6">
            <h2 className="text-sm font-bold tracking-[0.15em] text-[#D4AF37] uppercase mb-1.5">
              Welcome back
            </h2>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3.5 leading-tight">
              Pakistan's Premier <span className="text-[#D4AF37] block mt-0.5">Equine Portal</span>
            </h1>

            {/* Majestic Clean Golden Stallion Emblem */}
            <div className="relative flex flex-col items-center justify-center py-2 my-2">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center group">
                <img
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(212,175,55,0.35)] transition-transform duration-700 group-hover:scale-105"
                  src="/login and registeration .png"
                  alt="Majestic Stallion"
                />
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-slate-400">
            © 2026 HorseSquare Pakistan. All rights reserved.
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="col-span-1 md:col-span-7 flex flex-col p-6 sm:p-8 lg:p-10 bg-slate-50/60 relative h-full overflow-x-hidden overflow-y-auto justify-center items-center">

          <div className="w-full max-w-md mx-auto my-auto py-2 relative z-10">
            {/* Emblem Badge */}
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37]/60 p-0.5 bg-[#020B21] shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center mb-6 mx-auto md:mx-0 shrink-0">
              <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden text-center mb-6">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Horse-Square-Pakistan
              </h1>
              <p className="text-slate-500 text-sm mt-3.5">Login to manage your account and marketplace listings</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block mb-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-600 text-sm mt-2">Please enter your credentials to access your account.</p>
            </div>

            {registeredMessage && (
              <div className="bg-emerald-50 text-emerald-900 p-4.5 rounded-2xl text-xs mb-6 border border-emerald-200 flex items-center gap-3 shadow-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{registeredMessage}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-4.5 rounded-2xl text-xs mb-6 border border-red-200 flex items-start gap-3.5 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold block">Authentication Error</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <div className="relative group focus-within:text-[#D4AF37]">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-2xl bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm transition-all duration-300"
                  />
                  <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative group focus-within:text-[#D4AF37]">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-11 py-3.5 border border-slate-300 rounded-2xl bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm transition-all duration-300"
                  />
                  <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none" />

                  {/* Password toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot options */}
              <div className="flex justify-between items-center text-xs pt-1">
                <label className="flex items-center text-slate-700 font-medium gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-[#D4AF37] focus:ring-amber-500/30 w-4 h-4 accent-[#D4AF37] cursor-pointer"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-[#D4AF37] font-bold hover:text-[#B8942A] transition-colors hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition transform disabled:opacity-75 disabled:pointer-events-none text-sm tracking-wide flex items-center justify-center gap-2 border-t border-white/10 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying details...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <div className="mt-6 pt-6 border-t border-slate-200/60 text-center text-xs text-slate-600">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-[#D4AF37] font-bold hover:text-[#B8942A] transition-colors hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
