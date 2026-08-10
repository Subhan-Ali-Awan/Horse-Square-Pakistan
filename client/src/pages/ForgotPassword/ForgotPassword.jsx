import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../../config/api';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Code & New Pass
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [devCode, setDevCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Reset code generated! Check below (dev mode).');
        if (data.devCode) setDevCode(data.devCode);
        setStep(2);
      } else {
        setError(data.message || 'Error requesting reset code.');
      }
    } catch (err) {
      setError('Connection failed. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Password reset successful! You can now log in.');
        setStep(3);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-up">
        <div className="h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#D4AF37]"></div>

        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-8 text-center text-white">
          <h1 className="text-2xl font-bold mb-1">
            Reset <span className="text-[#D4AF37]">Password</span>
          </h1>
          <p className="text-slate-300 text-sm">Recover your account credentials</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs mb-6 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs mb-6 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {message}
            </div>
          )}

          {devCode && step === 2 && (
            <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs mb-6 border border-amber-300 font-mono text-center">
              🔐 Dev Reset Code: <strong>{devCode}</strong>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Enter Registered Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-[#D4AF37] transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-white font-bold rounded-xl shadow-lg transition text-sm"
              >
                {loading ? 'Sending Request...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Reset Code</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm font-mono text-center focus:border-[#D4AF37] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] transition"
                />
                
                {/* Live 3-Bar Password Strength Calculator */}
                {newPassword.length > 0 && (() => {
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

                  const str = getStrength(newPassword);

                  return (
                    <div className="pt-2 space-y-1">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white font-bold rounded-xl shadow-lg transition text-sm"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-[#D4AF37] text-[#0F172A] font-bold rounded-xl shadow transition"
              >
                Go to Login
              </Link>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Remembered password?{' '}
            <Link to="/login" className="text-[#D4AF37] font-bold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
