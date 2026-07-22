import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Gavel,
  User,
  LogOut,
  Globe,
  CheckCircle,
  Clock,
  XCircle,
  Tag,
  AlertCircle,
  Edit3,
  Lock,
  Eye,
  EyeOff,
  Save,
  TrendingUp,
  Package,
  Trophy,
  MessageSquare,
  Trash2,
  Send,
  Plus
} from 'lucide-react';
import { Modal } from '../../components/Modal';
import { QueryChatModal } from '../../components/QueryChatModal';

export const UserDashboard = () => {
  const { user, token, logout, initializing, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [myHorses, setMyHorses] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [myQueries, setMyQueries] = useState([]);
  const [selectedQueryChat, setSelectedQueryChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Contact Queries Edit State
  const [editingQuery, setEditingQuery] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [queryMsg, setQueryMsg] = useState('');

  // Profile form state
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', city: '', userType: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [savingPw, setSavingPw] = useState(false);

  // ── Auth Guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initializing) return;
    if (!token || !user) { navigate('/login'); return; }
    if (user.role === 'admin') { navigate('/admin'); return; }
  }, [user, token, initializing, navigate]);

  // ── Pre-fill profile form ─────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        city: user.city || '',
        userType: user.userType || '',
      });
    }
  }, [user]);

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !token) return;
    
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [horsesData, bidsData, queriesData] = await Promise.all([
          fetchWithAuth('/horses/my'),
          fetchWithAuth('/auctions/my-bids'),
          fetchWithAuth('/contact/my'),
        ]);
        if (horsesData && horsesData.success) setMyHorses(horsesData.data);
        if (bidsData && bidsData.success) setMyBids(bidsData.data);
        if (queriesData && queriesData.success) setMyQueries(queriesData.data);
      } catch {
        setError('Could not connect to server.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, user, token]);

  const fetchWithAuth = async (path, options = {}) => {
    const res = await fetch(`/api${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 401 || res.status === 403) {
      logout();
      navigate('/login');
      return null;
    }
    return res.json();
  };

  const fetchMyHorses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWithAuth('/horses/my');
      if (data && data.success) setMyHorses(data.data);
      else setError(data?.message || 'Failed to load listings.');
    } catch { setError('Could not connect to server.'); }
    finally { setLoading(false); }
  };

  const fetchMyBids = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWithAuth('/auctions/my-bids');
      if (data && data.success) setMyBids(data.data);
      else setError(data?.message || 'Failed to load auction bids.');
    } catch { setError('Could not connect to server.'); }
    finally { setLoading(false); }
  };

  const fetchMyQueries = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWithAuth('/contact/my');
      if (data && data.success) setMyQueries(data.data);
    } catch { setError('Could not connect to server.'); }
    finally { setLoading(false); }
  };

  const handleUpdateQuery = async (e) => {
    e.preventDefault();
    if (!editingQuery) return;
    try {
      const data = await fetchWithAuth(`/contact/${editingQuery._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          subject: editSubject,
          phone: editPhone,
          message: editMessage
        })
      });
      if (data && data.success) {
        setMyQueries(myQueries.map(q => q._id === editingQuery._id ? data.data : q));
        setEditingQuery(null);
        setQueryMsg('🎉 Query updated successfully!');
        setTimeout(() => setQueryMsg(''), 3500);
      } else {
        alert(data?.message || 'Failed to update query.');
      }
    } catch (err) {
      alert('Server connection error.');
    }
  };

  const handleDeleteQuery = async (queryId) => {
    if (!window.confirm('Are you sure you want to delete this contact query?')) return;
    try {
      const data = await fetchWithAuth(`/contact/${queryId}`, {
        method: 'DELETE'
      });
      if (data && data.success) {
        setMyQueries(myQueries.filter(q => q._id !== queryId));
        setQueryMsg('🗑️ Query deleted successfully!');
        setTimeout(() => setQueryMsg(''), 3500);
      } else {
        alert(data?.message || 'Failed to delete query.');
      }
    } catch (err) {
      alert('Server connection error.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const data = await fetchWithAuth('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (data && data.success) {
        login(token, data.user); // update context + localStorage
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setProfileMsg({ type: 'error', text: data?.message || 'Update failed.' });
      }
    } catch { setProfileMsg({ type: 'error', text: 'Server error. Try again.' }); }
    finally { setSavingProfile(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setSavingPw(true);
    setPwMsg({ type: '', text: '' });
    try {
      const data = await fetchWithAuth('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      if (data && data.success) {
        setPwMsg({ type: 'success', text: 'Password changed successfully!' });
        setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setPwMsg({ type: 'error', text: data?.message || 'Failed to change password.' });
      }
    } catch { setPwMsg({ type: 'error', text: 'Server error. Try again.' }); }
    finally { setSavingPw(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getStatusBadge = (status) => {
    const map = {
      pending:  'bg-amber-50 text-amber-700 border border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      rejected: 'bg-rose-50 text-rose-600 border border-rose-200',
      sold:     'bg-blue-50 text-blue-600 border border-blue-200',
      live:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
      ended:    'bg-slate-100 text-slate-500 border border-slate-200',
      new:      'bg-amber-50 text-amber-800 border border-amber-200',
      read:     'bg-blue-50 text-blue-700 border border-blue-200',
      resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    };
    return `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] || map.ended}`;
  };

  const navItems = [
    { id: 'overview',  label: 'Overview',        icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'listings',  label: 'My Listings',     icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'auctions',  label: 'My Auctions',     icon: <Gavel className="w-4 h-4" /> },
    { id: 'contact',   label: 'Contact Queries', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'profile',   label: 'My Profile',      icon: <User className="w-4 h-4" /> },
  ];

  // Loading spinner while auth restores
  if (initializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#C9A227]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-slate-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen flex bg-[#F8FAFC] overflow-hidden text-slate-800 font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-gradient-to-b from-[#0B0F19] to-[#1E293B] flex flex-col border-r border-[#D4AF37]/10 shrink-0">

        {/* Brand */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B0F19] flex items-center justify-center border border-[#D4AF37]/30 shadow-md shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M55 130C62 133 72 131 82 125C92 118 97 106 97 92C97 85 91 80 87 71C84 62 86 52 86 52C86 52 92 56 95 62C98 67 101 72 106 78C110 83 118 88 128 90C138 92 146 90 152 86C145 92 135 96 126 98C117 100 109 105 104 113C99 121 95 132 93 145C91 138 88 132 82 127C76 122 66 122 55 130Z" fill="#D4AF37" />
            </svg>
          </div>
          <div>
            <h2 className="font-black text-sm tracking-tight text-white leading-none">HorseSquare</h2>
            <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase block mt-1">My Dashboard</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <Link
            to="/"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 border border-slate-800 bg-[#0B0F19]/40 mb-4"
          >
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <span>Go to Website</span>
          </Link>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-[3px] ${
                activeTab === item.id
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]'
                  : 'text-slate-400 border-transparent hover:bg-slate-800/40 hover:text-slate-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/5 bg-[#0B0F19]/40 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/30 text-xs font-extrabold uppercase text-[#D4AF37]">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-200 block truncate">{user.firstName} {user.lastName}</span>
              <span className="text-[10px] text-slate-500 block truncate">{user.userType}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition duration-300 shrink-0" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">

        {/* Topbar */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm">
          <h1 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2.5">
            {navItems.find(i => i.id === activeTab)?.icon && (
              <span className="text-[#C9A227]">{navItems.find(i => i.id === activeTab)?.icon}</span>
            )}
            <span>{navItems.find(i => i.id === activeTab)?.label}</span>
          </h1>
          <div className="flex items-center gap-3">
            {error && (
              <span className="text-xs text-rose-600 font-medium flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200/50">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </span>
            )}
            <Link
              to="/sell"
              className="text-xs font-bold px-4 py-2 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-[#D4AF37] rounded-xl transition duration-300 border border-[#D4AF37]/20 shadow-sm"
            >
              + Sell a Horse
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-grow p-8 overflow-y-auto">

          {/* ── OVERVIEW TAB ────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">

              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#0B0F19] to-[#1E293B] rounded-2xl p-7 flex items-center gap-6 shadow-lg border border-[#D4AF37]/15 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-2xl font-black text-[#D4AF37]">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="relative z-10">
                  <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-1">Welcome back</p>
                  <h2 className="text-white text-2xl font-black tracking-tight">{user.firstName} {user.lastName}</h2>
                  <p className="text-slate-400 text-xs mt-1.5 font-medium">{user.email} · <span className="text-slate-300 capitalize">{user.userType}</span></p>
                </div>
              </div>

              {/* Quick Stats Grid with Contact Queries Counter Widget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200/85 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 text-[#C9A227] border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-slate-800">
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></span>
                      ) : (
                        myHorses.filter(h => h.status === 'approved').length
                      )}
                    </span>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">My Listings</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/85 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-slate-800">
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></span>
                      ) : (
                        myBids.length
                      )}
                    </span>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">Auction Bids</p>
                  </div>
                </div>

                {/* Contact Queries Counter Widget */}
                <button
                  type="button"
                  onClick={() => setActiveTab('contact')}
                  className="bg-white border border-slate-200/85 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-[#D4AF37]/40 transition-all duration-300 text-left cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition duration-300">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-slate-800 flex items-center gap-1.5">
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></span>
                      ) : (
                        myQueries.length
                      )}
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Live</span>
                    </span>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">Contact Queries</p>
                  </div>
                </button>

                <div className="bg-white border border-slate-200/85 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-emerald-600 capitalize">{user.status}</span>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">Account Status</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Sell a Horse', icon: <Tag className="w-5 h-5" />, to: '/sell', color: 'bg-[#D4AF37]/10 text-[#C9A227] border-[#D4AF37]/20' },
                    { label: 'Marketplace', icon: <ShoppingBag className="w-5 h-5" />, to: '/marketplace', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                    { label: 'Live Auctions', icon: <Gavel className="w-5 h-5" />, to: '/auction', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                    { label: 'AI Vet', icon: <TrendingUp className="w-5 h-5" />, to: '/vet', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                  ].map(item => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-slate-300 transition-all duration-300 group text-center"
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.color}`}>
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Account Info Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-5">Account Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-8 text-sm">
                  {[
                    { label: 'First Name', value: user.firstName },
                    { label: 'Last Name', value: user.lastName },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: user.phone },
                    { label: 'City', value: user.city },
                    { label: 'Account Type', value: user.userType },
                  ].map(field => (
                    <div key={field.label}>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{field.label}</p>
                      <p className="font-semibold text-slate-800 text-sm">{field.value || '—'}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="mt-6 text-xs font-bold text-[#C9A227] hover:text-[#B8942A] flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* ── MY LISTINGS TAB ─────────────────────────────────────────── */}
          {activeTab === 'listings' && (
            <div className="animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="py-20 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-[#C9A227]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading your listings...
                  </div>
                ) : myHorses.length === 0 ? (
                  <div className="py-24 text-center">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-sm">No listings yet</p>
                    <p className="text-slate-400 text-xs mt-1.5 mb-6">Start selling by listing your first horse</p>
                    <Link to="/sell" className="px-5 py-2.5 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-[#D4AF37] text-xs font-bold rounded-xl border border-[#D4AF37]/20 hover:shadow-lg transition-all duration-300">
                      + Sell a Horse
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/75">
                          {['Horse', 'Breed', 'Price', 'Location', 'Status', 'Date Listed'].map(h => (
                            <th key={h} className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {myHorses.map(h => (
                          <tr key={h._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150 bg-white">
                            <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                              {h.images?.[0] ? (
                                <img src={h.images[0]} alt={h.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                                </div>
                              )}
                              {h.name}
                            </td>
                            <td className="px-6 py-4 text-slate-700 font-medium">{h.breed}</td>
                            <td className="px-6 py-4 text-[#C9A227] font-black">₨ {Number(h.price).toLocaleString()}</td>
                            <td className="px-6 py-4 text-slate-600">{h.location}</td>
                            <td className="px-6 py-4"><span className={getStatusBadge(h.status)}>{h.status}</span></td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                              {new Date(h.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MY AUCTIONS TAB ─────────────────────────────────────────── */}
          {activeTab === 'auctions' && (
            <div className="animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="py-20 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-[#C9A227]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading your auction bids...
                  </div>
                ) : myBids.length === 0 ? (
                  <div className="py-24 text-center">
                    <Gavel className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-sm">No auction bids yet</p>
                    <p className="text-slate-400 text-xs mt-1.5 mb-6">Browse live auctions and place your first bid</p>
                    <Link to="/auction" className="px-5 py-2.5 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-[#D4AF37] text-xs font-bold rounded-xl border border-[#D4AF37]/20 hover:shadow-lg transition-all duration-300">
                      View Live Auctions
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/75">
                          {['Horse', 'Breed', 'My Highest Bid', 'Current Bid', 'Status', 'Ends'].map(h => (
                            <th key={h} className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {myBids.map(a => {
                          const isWinning = a.highestBidder && a.myHighestBid >= a.currentBid;
                          return (
                            <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150 bg-white">
                              <td className="px-6 py-4 font-bold text-slate-900">{a.horseName}</td>
                              <td className="px-6 py-4 text-slate-700 font-medium">{a.breed}</td>
                              <td className="px-6 py-4">
                                <span className="text-[#C9A227] font-black">₨ {Number(a.myHighestBid).toLocaleString()}</span>
                                {isWinning && a.status === 'live' && (
                                  <span className="ml-2 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Winning</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-slate-700 font-semibold">₨ {Number(a.currentBid).toLocaleString()}</td>
                              <td className="px-6 py-4"><span className={getStatusBadge(a.status)}>{a.status}</span></td>
                              <td className="px-6 py-4 text-slate-500 font-medium">
                                {new Date(a.endTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── CONTACT QUERIES TAB ────────────────────────────────────────── */}
          {activeTab === 'contact' && (
            <div className="animate-fade-in space-y-6">
              {queryMsg && (
                <div className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 font-bold text-xs shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{queryMsg}</span>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> My Contact Queries
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">Manage and edit your submitted contact messages & helpdesk inquiries</p>
                  </div>
                  <Link
                    to="/contact"
                    className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" /> New Query
                  </Link>
                </div>

                {loading ? (
                  <div className="py-20 text-center text-slate-400 text-xs font-bold">
                    Loading contact queries...
                  </div>
                ) : myQueries.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-slate-500 font-bold text-sm">No contact queries submitted yet</p>
                    <p className="text-slate-400 text-xs">Need help or have questions? Submit your first message below.</p>
                    <Link
                      to="/contact"
                      className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-slate-950 text-xs font-black rounded-xl shadow"
                    >
                      Submit a Query
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {myQueries.map((q) => (
                      <div
                        key={q._id}
                        onClick={() => setSelectedQueryChat(q)}
                        className="p-6 hover:bg-amber-50/40 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer group"
                      >
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-sm text-slate-900 group-hover:text-[#D4AF37] transition">{q.subject || 'General Inquiry'}</span>
                            <span className={getStatusBadge(q.status)}>{q.status}</span>
                            {q.replies && q.replies.length > 0 && (
                              <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-bold">
                                {q.replies.length} {q.replies.length === 1 ? 'Reply' : 'Replies'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal">{q.message}</p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                            <span>📅 {new Date(q.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>📞 {q.phone || 'No Phone'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedQueryChat(q)}
                            className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Chat Thread
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingQuery(q);
                              setEditSubject(q.subject || '');
                              setEditPhone(q.phone || '');
                              setEditMessage(q.message || '');
                            }}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuery(q._id)}
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MY PROFILE TAB ──────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in space-y-6 max-w-2xl">

              {/* Profile Info Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#C9A227] border border-[#D4AF37]/20 flex items-center justify-center">
                    <Edit3 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-sm">Personal Information</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Update your profile details</p>
                  </div>
                </div>

                {profileMsg.text && (
                  <div className={`mb-5 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}>
                    {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4" autoComplete="off">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'First Name', key: 'firstName', placeholder: 'Muhammad' },
                      { label: 'Last Name', key: 'lastName', placeholder: 'Ali' },
                    ].map(f => (
                      <div key={f.key} className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">{f.label}</label>
                        <input
                          type="text"
                          value={profile[f.key]}
                          onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="03xx-xxxxxxx"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">City</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
                        placeholder="Lahore"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Account Type</label>
                    <select
                      value={profile.userType}
                      onChange={e => setProfile(p => ({ ...p, userType: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm transition-all"
                    >
                      {['Horse Buyer', 'Horse Seller', 'Breeder', 'Riding Student'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-400 cursor-not-allowed shadow-sm"
                    />
                    <p className="text-[10px] text-slate-400">Email cannot be changed</p>
                  </div>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-[#D4AF37] text-xs font-bold rounded-xl border border-[#D4AF37]/20 transition-all duration-300 shadow-sm disabled:opacity-60"
                  >
                    {savingProfile ? (
                      <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                    ) : (
                      <><Save className="w-4 h-4" />Save Changes</>
                    )}
                  </button>
                </form>
              </div>

              {/* Change Password Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-sm">Change Password</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Keep your account secure</p>
                  </div>
                </div>

                {pwMsg.text && (
                  <div className={`mb-5 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                    pwMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}>
                    {pwMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {pwMsg.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4" autoComplete="off">
                  {[
                    { label: 'Current Password', key: 'currentPassword', vis: 'current' },
                    { label: 'New Password', key: 'newPassword', vis: 'new' },
                    { label: 'Confirm New Password', key: 'confirmNewPassword', vis: 'confirm' },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">{f.label}</label>
                      <div className="relative">
                        <input
                          type={showPw[f.vis] ? 'text' : 'password'}
                          value={pwForm[f.key]}
                          onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder="••••••••"
                          required
                          autoComplete="new-password"
                          className="w-full pl-4 pr-11 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-amber-500/10 shadow-sm transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(p => ({ ...p, [f.vis]: !p[f.vis] }))}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPw[f.vis] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={savingPw}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-sm disabled:opacity-60"
                  >
                    {savingPw ? (
                      <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Changing...</>
                    ) : (
                      <><Lock className="w-4 h-4" />Change Password</>
                    )}
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Edit Contact Query Portal Modal */}
      <Modal
        isOpen={Boolean(editingQuery)}
        onClose={() => setEditingQuery(null)}
        title="Edit Contact Query"
        maxWidth="max-w-md"
      >
        {editingQuery && (
          <form onSubmit={handleUpdateQuery} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full p-3 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full p-3 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message Detail</label>
              <textarea
                rows="4"
                required
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                className="w-full p-3 border rounded-xl text-sm"
              ></textarea>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingQuery(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#0F172A] text-white font-bold rounded-xl text-xs shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" /> Update Query
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* 2-Way Interactive Query Chat Modal */}
      <QueryChatModal
        isOpen={Boolean(selectedQueryChat)}
        onClose={() => setSelectedQueryChat(null)}
        query={selectedQueryChat}
        currentUser={user}
        onQueryUpdated={(updatedQuery) => {
          setSelectedQueryChat(updatedQuery);
          setMyQueries(myQueries.map(q => q._id === updatedQuery._id ? updatedQuery : q));
        }}
      />
    </div>
  );
};
