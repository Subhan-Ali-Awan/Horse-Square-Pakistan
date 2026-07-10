import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        navigate('/');
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-up">
        {/* Top Gold Border */}
        <div className="h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#D4AF37]"></div>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-8 text-center text-white">
          <h1 className="text-2xl font-bold mb-1">
            HorseSquare <span className="text-[#D4AF37]">Pakistan</span>
          </h1>
          <p className="text-slate-300 text-sm">Welcome back! Please login to your account.</p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs mb-6 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-amber-500/15 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-amber-500/15 transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <label className="flex items-center text-slate-600 gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-[#D4AF37] focus:ring-amber-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-[#D4AF37] font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-white font-bold rounded-xl shadow-lg transition transform active:scale-95 text-sm"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#D4AF37] font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
