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
  Plus,
  Dna,
  Compass,
  Award,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ArrowRight,
  BookOpen,
  Target,
  CheckCircle2,
  Phone
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
  const [myVetInquiries, setMyVetInquiries] = useState([]);
  const [selectedQueryChat, setSelectedQueryChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Contact Queries Edit State
  const [editingQuery, setEditingQuery] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [queryMsg, setQueryMsg] = useState('');
  const [listingMsg, setListingMsg] = useState('');

  // Profile form state
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', city: '', userType: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Breeding system state
  const [breedingHorses, setBreedingHorses] = useState([]);
  const [myBreedingRequests, setMyBreedingRequests] = useState([]);
  const [breedingSubTab, setBreedingSubTab] = useState('services'); // 'services' | 'requests'
  const [selectedBreedingHorse, setSelectedBreedingHorse] = useState(null);
  const [showGeneralBreedingModal, setShowGeneralBreedingModal] = useState(false);
  const [breedingPhone, setBreedingPhone] = useState(user ? user.phone || '' : '');
  const [breedingMareDetails, setBreedingMareDetails] = useState('');
  const [breedingPreferredBreed, setBreedingPreferredBreed] = useState('Arabian');
  const [breedingSubmitSuccess, setBreedingSubmitSuccess] = useState('');

  const sampleBreedingHorses = [
    {
      id: 'b2',
      name: 'Al-Burraq (Arabian Champion)',
      breed: 'Arabian',
      breedingFee: 180000,
      location: 'Lahore Stud Farm',
      tag: 'Multiple National Show Champion 2024 • Pure Bloodline',
      sire: 'Al-Murtajiz',
      dam: 'Desert Rose',
      image: 'https://images.pexels.com/photos/29632852/pexels-photo-29632852.jpeg'
    },
    {
      id: 'b3',
      name: 'Bucephalus (Thoroughbred Stallion)',
      breed: 'Thoroughbred',
      breedingFee: 220000,
      location: 'Rawalpindi Turf Club',
      tag: 'Derby Winner & Speed Record Holder at Lahore Turf Club',
      sire: 'Storm Cat II',
      dam: 'Lady Pearl',
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'b4',
      name: 'Rustam (Desi Stud Stallion)',
      breed: 'Local / Desi',
      breedingFee: 160000,
      location: 'Multan Stud Farms',
      tag: 'High Resilient Bloodline • Tent Pegging Specialist',
      sire: 'Ghulam Muhammad',
      dam: 'Bella',
      image: 'https://images.unsplash.com/photo-1551887196-72e32fad773a?auto=format&fit=crop&q=80&w=600'
    }
  ];

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
        userType: (user.userType === 'Horse Seller' ? 'User' : user.userType) || '',
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
        const [horsesData, bidsData, queriesData, vetData] = await Promise.all([
          fetchWithAuth('/horses/my'),
          fetchWithAuth('/auctions/my-bids'),
          fetchWithAuth('/contact/my'),
          fetchWithAuth('/vet/my-inquiries'),
        ]);
        if (horsesData && horsesData.success) setMyHorses(horsesData.data);
        if (bidsData && bidsData.success) setMyBids(bidsData.data);
        if (queriesData && queriesData.success) setMyQueries(queriesData.data);
        if (vetData && vetData.success) setMyVetInquiries(vetData.data);

        fetchBreedingData();
      } catch {
        setError('Could not connect to server.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, user, token]);

  const fetchBreedingData = async () => {
    try {
      const horsesRes = await fetch('/api/breeding/horses');
      if (horsesRes.ok) {
        const data = await horsesRes.json();
        if (data.success && data.data && data.data.length > 0) {
          setBreedingHorses(data.data);
        } else {
          setBreedingHorses(sampleBreedingHorses);
        }
      } else {
        setBreedingHorses(sampleBreedingHorses);
      }

      const reqRes = await fetchWithAuth('/breeding/my-requests');
      if (reqRes && reqRes.success && reqRes.data) {
        setMyBreedingRequests(reqRes.data);
      }
    } catch {
      setBreedingHorses(sampleBreedingHorses);
    }
  };

  const handleCreateBreedingRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/breeding/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          requesterName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name : 'Guest User',
          phone: breedingPhone || user?.phone || '',
          ownHorseName: 'Mare',
          preferredBreed: selectedBreedingHorse ? selectedBreedingHorse.breed : breedingPreferredBreed,
          details: breedingMareDetails,
          breedingHorseId: selectedBreedingHorse ? (selectedBreedingHorse._id || (selectedBreedingHorse.id && selectedBreedingHorse.id.length === 24 ? selectedBreedingHorse.id : undefined)) : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setBreedingSubmitSuccess('🎉 Breeding request submitted successfully!');
        setSelectedBreedingHorse(null);
        setShowGeneralBreedingModal(false);
        setBreedingMareDetails('');
        fetchBreedingData();
        setTimeout(() => setBreedingSubmitSuccess(''), 4000);
      } else {
        alert(data.message || 'Failed to submit breeding request.');
      }
    } catch {
      alert('Network error. Failed to send breeding request.');
    }
  };

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

  const handleToggleSoldStatus = async (id, newStatus) => {
    try {
      const data = await fetchWithAuth(`/horses/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (data && data.success) {
        setListingMsg(data.message || `Listing marked as ${newStatus}`);
        setTimeout(() => setListingMsg(''), 3500);
        fetchMyHorses();
      } else {
        alert(data?.message || 'Failed to update listing status.');
      }
    } catch {
      alert('Could not connect to server.');
    }
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

  const handleDeleteBreedingRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this breeding request query?')) return;
    try {
      const data = await fetchWithAuth(`/breeding/requests/${requestId}`, {
        method: 'DELETE'
      });
      if (data && data.success) {
        setMyBreedingRequests(prev => prev.filter(r => r._id !== requestId));
        setQueryMsg('🗑️ Breeding request query deleted successfully!');
        setTimeout(() => setQueryMsg(''), 3500);
      } else {
        alert(data?.message || 'Failed to delete breeding request.');
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
      pending: 'bg-amber-50 text-amber-700 border border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      rejected: 'bg-rose-50 text-rose-600 border border-rose-200',
      sold: 'bg-blue-50 text-blue-600 border border-blue-200',
      live: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      ended: 'bg-slate-100 text-slate-500 border border-slate-200',
      new: 'bg-amber-50 text-amber-800 border border-amber-200',
      read: 'bg-blue-50 text-blue-700 border border-blue-200',
      resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    };
    return `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] || map.ended}`;
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'listings', label: 'My Listings', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'auctions', label: 'My Auctions', icon: <Gavel className="w-4 h-4" /> },
    { id: 'breeding', label: 'Breeding System', icon: <Dna className="w-4 h-4" /> },
    { id: 'riding', label: 'Riding School', icon: <Compass className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Queries', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
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

  const cleanFn = (user.firstName || '').replace(/\baccount\b/gi, '').trim();
  const cleanLn = (user.lastName || '').replace(/\baccount\b/gi, '').trim();
  const userDisplayName = `${cleanFn} ${cleanLn}`.trim() || cleanFn || 'User';
  const userAvatarInitials = cleanLn
    ? `${cleanFn[0] || ''}${cleanLn[0] || ''}`.toUpperCase()
    : (cleanFn.substring(0, 2).toUpperCase() || 'U');

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen flex bg-[#F8FAFC] overflow-hidden text-slate-800 font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-64 liquid-glass-sidebar flex flex-col shrink-0 z-20 shadow-2xl">

        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/60 p-0.5 bg-[#020B21] shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center shrink-0">
            <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h2 className="font-black text-sm tracking-tight text-white leading-none">Horse-Square-Pakistan</h2>
            <span className="text-[9px] font-extrabold text-[#D4AF37] tracking-[0.2em] uppercase block mt-1">My Dashboard</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3.5 py-6 space-y-2 overflow-y-auto relative z-10">
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.id === 'auctions' && (
                <Link
                  to="/sell"
                  className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-300 liquid-glass-nav-inactive cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-white" />
                  <span>Sell a Horse</span>
                </Link>
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === item.id
                  ? 'liquid-glass-nav-active font-black'
                  : 'liquid-glass-nav-inactive'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4.5 liquid-glass-sidebar-footer flex items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/40 text-xs font-extrabold uppercase text-[#D4AF37] shadow">
              {userAvatarInitials}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-200 block truncate">{userDisplayName}</span>
              <span className="text-[10px] text-amber-200/80 font-bold block truncate">{user.userType === 'Horse Seller' ? 'User' : (user.userType || 'Verified Member')}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 rounded-xl transition duration-300 shrink-0" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/20 overflow-hidden relative">
        {/* Ambient Glowing Background Liquid Blobs */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-12 right-12 w-[30rem] h-[30rem] bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Topbar */}
        <header className="h-16 border-b border-slate-200/80 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md shrink-0 shadow-sm z-10">
          <h1 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2.5">
            {navItems.find(i => i.id === activeTab)?.icon && (
              <span className="text-[#C9A227]">{navItems.find(i => i.id === activeTab)?.icon}</span>
            )}
            <span>{navItems.find(i => i.id === activeTab)?.label}</span>
          </h1>
          <div className="flex items-center gap-3">
            {error && (
              <span className="text-xs text-rose-600 font-medium flex items-center gap-1.5 bg-rose-50/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-200/50">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </span>
            )}
            <Link
              to="/"
              className="text-xs font-bold px-3.5 py-2 liquid-glass-action text-slate-700 rounded-xl transition duration-300 border border-slate-200/80 flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Go to Website</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-grow p-8 overflow-y-auto z-10">

          {/* ── OVERVIEW TAB ────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">

              {/* Welcome Banner - Dark Liquid Glass */}
              <div className="liquid-glass-dark rounded-3xl p-7 flex items-center gap-6 relative overflow-hidden liquid-glass-sheen">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-[#D4AF37]/60 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-[#D4AF37]/20 relative group overflow-hidden">
                  <img
                    src="/login and registeration .png"
                    alt="HorseSquare Logo"
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="relative z-10">
                  <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-1">Welcome back</p>
                  <h2 className="text-white text-2xl font-black tracking-tight">{userDisplayName}</h2>
                  <p className="text-slate-300 text-xs mt-1 font-medium">
                    <span className="text-amber-200 capitalize font-bold">{user.userType === 'Horse Seller' ? 'User' : (user.userType || 'Verified Member')}</span>
                  </p>
                </div>
              </div>

              {/* Quick Stats Grid with Liquid Glass Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <div className="liquid-glass-card rounded-3xl p-5 flex items-center gap-4 liquid-glass-sheen">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#C9A227] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 shadow-sm">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800">
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></span>
                      ) : (
                        myHorses.filter(h => h.status === 'approved').length
                      )}
                    </span>
                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider mt-0.5">My Listings</p>
                  </div>
                </div>

                <div className="liquid-glass-card rounded-3xl p-5 flex items-center gap-4 liquid-glass-sheen">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-sm">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800">
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></span>
                      ) : (
                        myBids.length
                      )}
                    </span>
                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider mt-0.5">Auction Bids</p>
                  </div>
                </div>

                {/* Breeding Requests Counter Widget with Pending & Approved live buttons */}
                <div className="liquid-glass-card rounded-3xl p-5 flex flex-col justify-between gap-3 liquid-glass-sheen relative overflow-hidden group">
                  <div
                    onClick={() => {
                      setActiveTab('breeding');
                      setBreedingSubTab('requests');
                    }}
                    className="flex items-center gap-3.5 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 border border-purple-400/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300 shadow-sm">
                      <Dna className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-2xl font-black text-slate-800 flex items-center gap-1.5">
                        {loading ? (
                          <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></span>
                        ) : (
                          myBreedingRequests.length
                        )}
                        <span className="text-[9px] bg-purple-500/20 text-purple-900 border border-purple-400/40 px-1.5 py-0.5 rounded-full font-extrabold">Live</span>
                      </span>
                      <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider mt-0.5">Breeding Requests</p>
                    </div>
                  </div>

                  {/* Sub buttons with live counts for Pending and Approved */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('breeding');
                        setBreedingSubTab('requests');
                      }}
                      className="flex-1 py-1 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl flex items-center justify-between transition cursor-pointer"
                      title="View Pending Requests"
                    >
                      <span className="text-[10px] font-extrabold text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Pending
                      </span>
                      <span className="text-[11px] font-black text-amber-900 bg-amber-200/60 px-1.5 py-0.2 rounded-md">
                        {myBreedingRequests.filter(r => r.status === 'pending' || !r.status).length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('breeding');
                        setBreedingSubTab('requests');
                      }}
                      className="flex-1 py-1 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl flex items-center justify-between transition cursor-pointer"
                      title="View Approved Requests"
                    >
                      <span className="text-[10px] font-extrabold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                      </span>
                      <span className="text-[11px] font-black text-emerald-900 bg-emerald-200/60 px-1.5 py-0.2 rounded-md">
                        {myBreedingRequests.filter(r => r.status === 'approved' || r.status === 'contacted').length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Contact Queries Counter Widget */}
                <button
                  type="button"
                  onClick={() => setActiveTab('contact')}
                  className="liquid-glass-card rounded-3xl p-5 flex items-center gap-4 text-left cursor-pointer group liquid-glass-sheen"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300 shadow-sm">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800 flex items-center gap-1.5">
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></span>
                      ) : (
                        myQueries.length
                      )}
                      <span className="text-[10px] bg-amber-500/20 text-amber-900 border border-amber-400/40 px-2 py-0.5 rounded-full font-extrabold">Live</span>
                    </span>
                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider mt-0.5">Contact Queries</p>
                  </div>
                </button>

                <div className="liquid-glass-card rounded-3xl p-5 flex items-center gap-4 liquid-glass-sheen">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-emerald-600 capitalize">{user.status}</span>
                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider mt-0.5">Account Status</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Liquid Glass Action Widgets */}
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Sell a Horse', icon: <Tag className="w-5 h-5" />, to: '/sell', color: 'bg-[#D4AF37]/15 text-[#C9A227] border-[#D4AF37]/30' },
                    { label: 'Marketplace', icon: <ShoppingBag className="w-5 h-5" />, to: '/marketplace', color: 'bg-blue-500/15 text-blue-600 border-blue-400/30' },
                    { label: 'Live Auctions', icon: <Gavel className="w-5 h-5" />, to: '/auction', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-400/30' },
                    { label: 'AI Vet', icon: <TrendingUp className="w-5 h-5" />, to: '/vet', color: 'bg-purple-500/15 text-purple-600 border-purple-400/30' },
                  ].map(item => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="liquid-glass-action rounded-3xl p-5 flex flex-col items-center gap-3 text-center group cursor-pointer liquid-glass-sheen"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-110 transition duration-300 ${item.color}`}>
                        {item.icon}
                      </div>
                      <span className="text-xs font-extrabold text-slate-700 group-hover:text-slate-900 transition-colors">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Account Info Card - Liquid Glass */}
              <div className="liquid-glass-card rounded-3xl p-7 shadow-lg">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Account Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8 text-sm">
                  {[
                    { label: 'First Name', value: user.firstName },
                    { label: 'Last Name', value: user.lastName },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: user.phone },
                    { label: 'City', value: user.city },
                    { label: 'Account Type', value: user.userType === 'Horse Seller' ? 'User' : user.userType },
                  ].map(field => (
                    <div key={field.label}>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{field.label}</p>
                      <p className="font-bold text-slate-800 text-sm">{field.value || '—'}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="mt-7 text-xs font-extrabold text-[#C9A227] hover:text-[#B8942A] flex items-center gap-1.5 transition-colors bg-[#D4AF37]/10 px-4 py-2 rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 w-max"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>

              {/* Featured Services & Widgets Hub */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Widget 1: Breeding Registry & Lineage Widget */}
                <div className="liquid-glass-card rounded-3xl p-7 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/25 via-amber-500/15 to-amber-300/20 border border-[#D4AF37]/50 text-[#C9A227] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition duration-300">
                          <Dna className="w-6 h-6 text-[#C9A227]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block">Pedigree & Stud Match</span>
                          <h4 className="font-extrabold text-slate-800 text-base">Breeding Registry Services</h4>
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-500/15 text-amber-900 border border-amber-400/40 px-2.5 py-1 rounded-full font-black uppercase">Active</span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed mb-5">
                      Find certified stud matches for your stallion or mare. Track lineage certificates and connect with top Pakistani stud owners.
                    </p>

                    {/* Featured Stud Preview Cards */}
                    <div className="space-y-2.5 mb-6">
                      <div className="p-3 bg-white/70 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                          <span className="text-slate-800 font-extrabold">Rustam (Desi Stud Stallion)</span>
                        </div>
                        <span className="text-[#C9A227] font-black">Fee: Rs. 160,000</span>
                      </div>
                      <div className="p-3 bg-white/70 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-slate-800 font-extrabold">Al-Burraq (Arabian Champion)</span>
                        </div>
                        <span className="text-blue-600 font-black">Fee: Rs. 180,000</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('breeding')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#D4AF37] text-white hover:text-[#0F172A] font-bold text-xs py-3 px-4 rounded-2xl transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <span>Browse Stud Registry</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Widget 2: AI Vet Diagnostics Assistant */}
                <div className="liquid-glass-card rounded-3xl p-7 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition duration-300">
                          <Stethoscope className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Instant Healthcare</span>
                          <h4 className="font-extrabold text-slate-800 text-base">AI Vet Diagnostics</h4>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-900 border border-emerald-400/40 px-2.5 py-1 rounded-full font-black uppercase">24/7 AI Online</span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed mb-5">
                      Get instant AI-driven diagnostic analysis for common horse symptoms, generate health reports, and locate verified local veterinarians.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Symptom Checker</span>
                        <span className="text-xs font-bold text-slate-700 mt-0.5">Colic, Lameness, Skin</span>
                      </div>
                      <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 flex flex-col justify-center">
                        <span className="text-[10px] font-extrabold text-amber-800 uppercase">Vaccine Tracker</span>
                        <span className="text-xs font-bold text-slate-700 mt-0.5">Tetanus & Influenza</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/vet"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-emerald-600 text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <span>Consult AI Vet Doctor</span> <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

              {/* Widget 3: Riding Schools & Live Auctions Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Riding School Banner */}
                <div className="liquid-glass-card rounded-3xl p-6 flex items-center justify-between gap-4 shadow-lg group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300">
                      <Compass className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Riding Schools & Academies</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Locate certified riding instructors and training arenas.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('riding')}
                    className="px-4 py-2.5 bg-[#0F172A] hover:bg-sky-600 text-white rounded-xl text-xs font-bold shrink-0 transition cursor-pointer"
                  >
                    Explore Schools
                  </button>
                </div>

                {/* Live Auction Banner */}
                <div className="liquid-glass-card rounded-3xl p-6 flex items-center justify-between gap-4 shadow-lg group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300">
                      <Gavel className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Live Equine Auctions</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Place real-time bids on verified champion breeds.</p>
                    </div>
                  </div>
                  <Link
                    to="/auction"
                    className="px-4 py-2.5 bg-[#0F172A] hover:bg-[#D4AF37] hover:text-[#0F172A] text-white rounded-xl text-xs font-bold shrink-0 transition cursor-pointer"
                  >
                    Join Auctions
                  </Link>
                </div>

              </div>
            </div>
          )}

          {/* ── MY LISTINGS TAB ─────────────────────────────────────────── */}
          {activeTab === 'listings' && (
            <div className="animate-fade-in space-y-4">
              {listingMsg && (
                <div className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 font-bold text-xs shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{listingMsg}</span>
                </div>
              )}
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
                          {['Horse', 'Breed', 'Price', 'Location', 'Status', 'Date Listed', 'Actions'].map(h => (
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
                            <td className="px-6 py-4">
                              {h.status === 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleSoldStatus(h._id, 'sold')}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
                                >
                                  Mark Sold
                                </button>
                              )}
                              {h.status === 'sold' && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleSoldStatus(h._id, 'approved')}
                                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold rounded-lg text-[10px] transition cursor-pointer"
                                >
                                  Mark Unsold
                                </button>
                              )}
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

          {/* ── BREEDING SYSTEM TAB ────────────────────────────────────────── */}
          {activeTab === 'breeding' && (
            <div className="animate-fade-in space-y-6">

              {breedingSubmitSuccess && (
                <div className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 font-bold text-xs shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{breedingSubmitSuccess}</span>
                </div>
              )}

              {/* 2 MAIN CARDS: BREEDING SERVICES & BREEDING REQUESTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                  onClick={() => setBreedingSubTab('services')}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex items-center justify-between shadow-sm ${breedingSubTab === 'services'
                    ? 'bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border-[#D4AF37]/50 ring-2 ring-[#D4AF37]/30 shadow-lg'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400 hover:shadow-md'
                    }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${breedingSubTab === 'services' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                      Verified Stallion Studs
                    </span>
                    <h3 className="text-xl font-black">Breeding Services</h3>
                    <p className={`text-xs font-light ${breedingSubTab === 'services' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Browse champion stallions & book genetic breeding stud services
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${breedingSubTab === 'services' ? 'bg-[#D4AF37] text-slate-950' : 'bg-amber-50 text-[#C9A227] border border-amber-200'
                    }`}>
                    <Dna className="w-6 h-6" />
                  </div>
                </div>

                <div
                  onClick={() => setBreedingSubTab('requests')}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex items-center justify-between shadow-sm ${breedingSubTab === 'requests'
                    ? 'bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border-[#D4AF37]/50 ring-2 ring-[#D4AF37]/30 shadow-lg'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400 hover:shadow-md'
                    }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${breedingSubTab === 'requests' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                      My Applications ({myBreedingRequests.length})
                    </span>
                    <h3 className="text-xl font-black">Breeding Requests</h3>
                    <p className={`text-xs font-light ${breedingSubTab === 'requests' ? 'text-slate-300' : 'text-slate-500'}`}>
                      View status updates & details for your submitted breeding applications
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${breedingSubTab === 'requests' ? 'bg-[#D4AF37] text-slate-950' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                    <MessageSquare className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* SUB-VIEW 1: BREEDING SERVICES */}
              {breedingSubTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Available Stud Stallions Directory
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">Select a stallion to submit your mare breeding request</p>
                    </div>
                    <button
                      onClick={() => { setSelectedBreedingHorse(null); setShowGeneralBreedingModal(true); }}
                      className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" /> Custom Breeding Request
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {breedingHorses.map((horse) => (
                      <div key={horse._id || horse.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-300">
                        <div>
                          <div className="relative h-48 overflow-hidden bg-slate-900">
                            <img
                              src={horse.image || horse.imageUrl || 'https://images.pexels.com/photos/29632852/pexels-photo-29632852.jpeg'}
                              alt={horse.name}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-3 left-3 bg-[#0F172A]/90 text-[#D4AF37] border border-amber-500/30 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md shadow">
                              {horse.breed}
                            </span>
                          </div>

                          <div className="p-5 space-y-3">
                            <div>
                              <h5 className="text-base font-black text-slate-900 leading-snug">{horse.name}</h5>
                              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> {horse.tag || horse.achievements || 'Champion Stud'}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                              <div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase block">Sire</span>
                                <span className="font-extrabold text-slate-800 truncate block">{horse.sire || 'Verified Sire'}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase block">Dam</span>
                                <span className="font-extrabold text-slate-800 truncate block">{horse.dam || 'Verified Dam'}</span>
                              </div>
                            </div>

                            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 flex justify-between items-center text-xs">
                              <span className="text-amber-900 font-bold">Stud Booking Fee:</span>
                              <span className="font-black text-slate-900 text-sm">Rs. {(Number(horse.breedingFee || horse.studFee || 0)).toLocaleString('en-PK')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0">
                          <button
                            onClick={() => { setSelectedBreedingHorse(horse); setShowGeneralBreedingModal(false); }}
                            className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-2xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-amber-400" /> Book Breeding Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: BREEDING REQUESTS */}
              {breedingSubTab === 'requests' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> My Submitted Breeding Requests
                        </h4>
                        <p className="text-slate-500 text-xs mt-0.5">Track approvals, stud contact status, and details of your breeding applications</p>
                      </div>
                      <button
                        onClick={() => { setSelectedBreedingHorse(null); setShowGeneralBreedingModal(true); }}
                        className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" /> New Request
                      </button>
                    </div>

                    {myBreedingRequests.length === 0 ? (
                      <div className="py-20 text-center space-y-3">
                        <Dna className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-slate-500 font-bold text-sm">No breeding requests submitted yet</p>
                        <p className="text-slate-400 text-xs">Browse our Breeding Services tab to apply for stallion stud service.</p>
                        <button
                          onClick={() => setBreedingSubTab('services')}
                          className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-slate-950 text-xs font-black rounded-xl shadow cursor-pointer"
                        >
                          Browse Breeding Services
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {myBreedingRequests.map((req) => (
                          <div key={req._id} className="p-6 hover:bg-amber-50/30 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1.5 max-w-xl">
                              <div className="flex items-center gap-2.5">
                                <span className="font-extrabold text-sm text-slate-900">
                                  {req.breedingHorse?.name ? `Target Stud: ${req.breedingHorse.name}` : `Preferred Breed: ${req.preferredBreed}`}
                                </span>
                                <span className={getStatusBadge(req.status)}>{req.status}</span>
                              </div>
                              {(() => {
                                const detailsStr = req.details || req.ownHorseName || '';
                                if (!detailsStr) return null;
                                if (detailsStr.includes('|')) {
                                  const parts = detailsStr.split('|').map(p => p.trim()).filter(Boolean);
                                  return (
                                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 my-1">
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Mare Details & Pedigree</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {parts.map((part, idx) => {
                                          const colonIdx = part.indexOf(':');
                                          if (colonIdx !== -1) {
                                            const key = part.slice(0, colonIdx).trim();
                                            const val = part.slice(colonIdx + 1).trim();
                                            return (
                                              <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-[11px] shadow-2xs"
                                              >
                                                <span className="font-extrabold text-slate-500 uppercase text-[9.5px] tracking-wider">{key}:</span>
                                                <span className="font-black text-slate-900">{val}</span>
                                              </span>
                                            );
                                          }
                                          return (
                                            <span key={idx} className="text-xs text-slate-700 font-medium">{part}</span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                    <strong>Mare Details:</strong> {detailsStr}
                                  </p>
                                );
                              })()}
                              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                                <span>📅 {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                <span>•</span>
                                <span>📞 Contact Phone: {req.phone}</span>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-right shrink-0 flex flex-col items-end gap-2">
                              <div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase block">Status Info</span>
                                <span className="text-xs font-extrabold text-slate-800">
                                  {req.status === 'pending' ? '⏳ Under Breeder Review' : req.status === 'contacted' ? '📞 Breeder Contacted' : '✅ Request Closed'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteBreedingRequest(req._id)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ── RIDING SCHOOL TAB ─────────────────────────────────────────── */}
          {activeTab === 'riding' && (
            <div className="animate-fade-in space-y-8">

              {/* Banner Header */}
              <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-7 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Equestrian Training Network
                  </span>
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
                    <Compass className="w-7 h-7 text-[#D4AF37]" /> Riding School & Equestrian Academies
                  </h3>
                  <p className="text-slate-300 text-xs font-light max-w-xl">
                    Connect with certified equestrian instructors, enroll in structured coaching programs, and train at elite arenas across Pakistan.
                  </p>
                </div>
                <Link
                  to="/riding-school"
                  className="px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] text-slate-950 font-black rounded-2xl text-xs transition shadow flex items-center gap-2 shrink-0"
                >
                  <span>Explore Full Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Riding Training Packages Grid */}
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" /> Featured Training Programs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Beginner Riding Foundation',
                      fee: 'Rs. 24,000 / month',
                      duration: '12 Sessions (3x per week)',
                      desc: 'Master mounting posture, rein control, trot rhythm, saddle balance, and essential horse safety fundamentals.',
                      level: 'Beginner'
                    },
                    {
                      title: 'Intermediate Canter & Jumping',
                      fee: 'Rs. 28,000 / month',
                      duration: '12 Sessions (3x per week)',
                      desc: 'Master smooth canter transitions, obstacle clearance, trail navigation, and arena control under certified coaches.',
                      level: 'Intermediate'
                    },
                    {
                      title: 'Master Polo & Endurance Riding',
                      fee: 'Rs. 35,000 / month',
                      duration: '16 Intensive Sessions',
                      desc: 'Specialized polo mallet maneuvers, high-speed gallop balance, and endurance trail conditioning for competitive events.',
                      level: 'Advanced'
                    }
                  ].map((course, idx) => (
                    <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {course.level}
                          </span>
                          <span className="text-xs font-black text-[#C9A227]">{course.fee}</span>
                        </div>
                        <h5 className="font-black text-slate-900 text-base">{course.title}</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{course.desc}</p>
                      </div>
                      <div className="pt-4 border-t mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">{course.duration}</span>
                        <Link
                          to="/riding-school"
                          className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-slate-800 transition"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Riding Academies */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Partner Riding Clubs in Pakistan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  {[
                    { name: 'Islamabad Riding Club', loc: 'Chak Shahzad, Islamabad', phone: '+92 300 5001234' },
                    { name: 'Lahore Polo & Riding Club', loc: 'Cantonment, Lahore', phone: '+92 321 4005678' },
                    { name: 'Multan Equestrian Academy', loc: 'BOSAN Road, Multan', phone: '+92 301 7009876' }
                  ].map((club, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <h6 className="font-black text-slate-900 text-xs">{club.name}</h6>
                      <p className="text-[11px] text-slate-500 font-medium">{club.loc}</p>
                      <p className="text-[10px] text-amber-700 font-bold">{club.phone}</p>
                    </div>
                  ))}
                </div>
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
                  <div className={`mb-5 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${profileMsg.type === 'success'
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
                      {['Horse Buyer', 'User', 'Breeder', 'Riding Student'].map(t => (
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
                  <div className={`mb-5 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${pwMsg.type === 'success'
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
      {/* Modal for Booking Breeding Request */}
      <Modal
        isOpen={Boolean(selectedBreedingHorse || showGeneralBreedingModal)}
        onClose={() => { setSelectedBreedingHorse(null); setShowGeneralBreedingModal(false); }}
        title={selectedBreedingHorse ? `Breeding Request for ${selectedBreedingHorse.name}` : 'Submit Horse Breeding Request'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateBreedingRequest} className="space-y-4">
          <p className="text-xs text-slate-500">Provide details about your mare to submit a stud service request.</p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Contact Phone Number</label>
            <input
              type="text"
              required
              value={breedingPhone}
              onChange={(e) => setBreedingPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full p-3 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          {!selectedBreedingHorse && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Breed Match</label>
              <select
                value={breedingPreferredBreed}
                onChange={(e) => setBreedingPreferredBreed(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-sm"
              >
                <option value="Arabian">Arabian</option>
                <option value="Thoroughbred">Thoroughbred</option>
                <option value="Local / Desi">Local / Desi</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Mare Details (Breed, Age, Pedigree)</label>
            <textarea
              rows="3"
              required
              value={breedingMareDetails}
              onChange={(e) => setBreedingMareDetails(e.target.value)}
              placeholder="Enter mare age, color, vaccinations, sire/dam lineage..."
              className="w-full p-3 border border-slate-300 rounded-xl text-sm"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setSelectedBreedingHorse(null); setShowGeneralBreedingModal(false); }}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#0F172A] text-white font-bold rounded-xl text-xs shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" /> Submit Breeding Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
