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
          {/* Animated Glow Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Top: Logo & Brand Header */}
          <div className="relative z-10 flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#020B21]/80 to-[#1E293B]/80 flex items-center justify-center shadow-lg border border-[#D4AF37]/30">
              <svg className="w-6 h-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M55 130C62 133 72 131 82 125C92 118 97 106 97 92C97 85 91 80 87 71C84 62 86 52 86 52C86 52 92 56 95 62C98 67 101 72 106 78C110 83 118 88 128 90C138 92 146 90 152 86C145 92 135 96 126 98C117 100 109 105 104 113C99 121 95 132 93 145C91 138 88 132 82 127C76 122 66 122 55 130Z" fill="#D4AF37" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase block leading-none mb-0.5">Platform</span>
              <span className="font-extrabold text-sm tracking-tight text-white leading-none">HorseSquare</span>
            </div>
          </div>

          {/* Center: Heading & Majestic Horse Image Card */}
          <div className="relative z-10 my-auto py-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <h2 className="text-sm font-bold tracking-[0.15em] text-[#D4AF37] uppercase mb-1.5">
              Welcome back
            </h2>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3.5 leading-tight">
              Pakistan's Premier <span className="text-[#D4AF37] block mt-0.5">Equine Portal</span>
            </h1>


            {/* Majestic Framed Horse Photo Card */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-2xl relative group bg-[#020B21]">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="/login and registeration .png"
                alt="Majestic Stallion"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020B21]/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4.5 left-4.5 text-[10px] font-bold text-white tracking-wide uppercase flex items-center gap-2 bg-[#020B21]/70 backdrop-blur-md py-2 px-3.5 rounded-full border border-[#D4AF37]/20 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span>Verified breeds & active auctions</span>
              </div>
            </div>
          </div>

          {/* Bottom: Premium Footer Checklist */}

        </div>

        {/* Right Side: Login Form */}
        <div className="col-span-1 md:col-span-7 flex flex-col p-6 sm:p-8 lg:p-10 bg-slate-50/50 backdrop-blur-sm relative h-full overflow-x-hidden overflow-y-auto md:overflow-y-hidden">
          {/* Subtle gold accent background glow */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Elegant Stallion Watermark in Background */}
          <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 pointer-events-none select-none">
            <svg className="w-full h-full opacity-[0.035] text-[#D4AF37] fill-current transform rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M55 130C62 133 72 131 82 125C92 118 97 106 97 92C97 85 91 80 87 71C84 62 86 52 86 52C86 52 92 56 95 62C98 67 101 72 106 78C110 83 118 88 128 90C138 92 146 90 152 86C145 92 135 96 126 98C117 100 109 105 104 113C99 121 95 132 93 145C91 138 88 132 82 127C76 122 66 122 55 130Z" />
            </svg>
          </div>

          <div className="w-full max-w-md mx-auto my-auto py-2">
            {/* Elegant Horse Badge Emblem at Top */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center mb-6 shadow-lg border border-[#D4AF37]/35 mx-auto md:mx-0 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M55 130C62 133 72 131 82 125C92 118 97 106 97 92C97 85 91 80 87 71C84 62 86 52 86 52C86 52 92 56 95 62C98 67 101 72 106 78C110 83 118 88 128 90C138 92 146 90 152 86C145 92 135 96 126 98C117 100 109 105 104 113C99 121 95 132 93 145C91 138 88 132 82 127C76 122 66 122 55 130Z" fill="#D4AF37" />
                <path d="M78 55C76 50 78 45 80 40C82 35 85 32 85 32C85 32 83 38 82 43C81 48 80 52 78 55Z" fill="#D4AF37" opacity="0.8" />
              </svg>
            </div>

            {/* Logo header (only visible on mobile) */}
            <div className="md:hidden text-center mb-6">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                HorseSquare <span className="text-[#D4AF37]">Pakistan</span>
              </h1>
              <p className="text-slate-500 text-sm mt-3.5">Login to manage your account and marketplace listings</p>
            </div>

            {/* Desktop header */}
            <div className="hidden md:block mb-6">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 text-sm mt-2">Please enter your credentials to access your account.</p>
            </div>

            {registeredMessage && (
              <div className="bg-emerald-50 text-emerald-900 p-4.5 rounded-2xl text-xs mb-6 border border-emerald-200 flex items-center gap-3 shadow-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{registeredMessage}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm text-red-700 p-4.5 rounded-2xl text-xs mb-6 border border-red-200/50 flex items-start gap-3.5 shadow-sm animate-shake">
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
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
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm focus:shadow-md transition-all duration-300"
                  />
                  <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
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
                    className="w-full pl-11 pr-11 py-3.5 border border-slate-200 rounded-2xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm focus:shadow-md transition-all duration-300"
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
                <label className="flex items-center text-slate-600 gap-2.5 cursor-pointer select-none">
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
            <div className="mt-6 pt-6 border-t border-slate-200/60 text-center text-xs text-slate-500">
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
