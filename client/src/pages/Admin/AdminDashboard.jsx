import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Gavel,
  Dna,
  Stethoscope,
  Mail,
  LogOut,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Globe,
  Clock,
  Sparkles,
  Filter,
  Check,
  X,
  ArrowRight,
  Activity,
  UserPlus,
  Shield,
  Menu,
  LayoutGrid,
  List,
  BookOpen,
  Plus,
  Trash2
} from 'lucide-react';

import { QueryChatModal } from '../../components/QueryChatModal';

export const AdminDashboard = () => {
  const { user, token, logout, initializing } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data States
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [horsesList, setHorsesList] = useState([]);
  const [auctionsList, setAuctionsList] = useState([]);
  const [breedingList, setBreedingList] = useState([]);
  const [vetList, setVetList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [ridingTrialsList, setRidingTrialsList] = useState([]);
  const [selectedQueryChat, setSelectedQueryChat] = useState(null);
  const [contactViewMode, setContactViewMode] = useState('grid');
  const [horseViewMode, setHorseViewMode] = useState('grid');
  const [blogsList, setBlogsList] = useState([]);
  const [blogViewMode, setBlogViewMode] = useState('grid');
  const [createBlogModalOpen, setCreateBlogModalOpen] = useState(false);
  const [blogForm, setBlogForm] = useState({ title: '', category: 'Equine Care', author: 'Admin', readTime: '5 min read', summary: '', image: '', content: '' });
  const [submittingBlog, setSubmittingBlog] = useState(false);

  // Search & Filter States
  const [horseFilter, setHorseFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Loading & Toast States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Protect path: wait for auth to restore from localStorage before redirecting
  useEffect(() => {
    if (initializing) return;
    if (!token || !user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, token, initializing, navigate]);

  // Load data based on selected tab
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadTabData();
    }
  }, [activeTab, horseFilter, user]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const fetchWithAuth = async (path, options = {}) => {
    setError('');
    try {
      const res = await fetch(`/api${path}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 401 || res.status === 403) {
        logout();
        navigate('/login');
        return { success: false, message: 'Unauthorized session' };
      }
      return await res.json();
    } catch (err) {
      console.error('API call failed', err);
      setError('Could not connect to server. Check backend connection.');
      return { success: false, message: 'Server connection error' };
    }
  };

  const loadOverviewData = async () => {
    setLoading(true);
    // Fetch stats and all 5 entity lists so overview widgets have complete data
    const [resStats, resUsers, resHorses, resAuctions, resBreeding, resVet] = await Promise.all([
      fetchWithAuth('/admin/stats'),
      fetchWithAuth('/admin/users'),
      fetchWithAuth('/admin/horses'),
      fetchWithAuth('/admin/auctions'),
      fetchWithAuth('/admin/breeding-requests'),
      fetchWithAuth('/admin/vet-inquiries')
    ]);

    if (resStats.success) setStats(resStats.data);
    if (resUsers.success) setUsersList(resUsers.data);
    if (resHorses.success) setHorsesList(resHorses.data);
    if (resAuctions.success) setAuctionsList(resAuctions.data);
    if (resBreeding.success) setBreedingList(resBreeding.data);
    if (resVet.success) setVetList(resVet.data);
    setLoading(false);
  };

  const loadTabData = async () => {
    if (activeTab === 'overview') {
      await loadOverviewData();
      return;
    }

    setLoading(true);
    if (activeTab === 'users') {
      const res = await fetchWithAuth('/admin/users');
      if (res.success) setUsersList(res.data);
    } else if (activeTab === 'horses') {
      const query = horseFilter ? `?status=${horseFilter}` : '';
      const res = await fetchWithAuth(`/admin/horses${query}`);
      if (res.success) setHorsesList(res.data);
    } else if (activeTab === 'auctions') {
      const res = await fetchWithAuth('/admin/auctions');
      if (res.success) setAuctionsList(res.data);
    } else if (activeTab === 'breeding') {
      const res = await fetchWithAuth('/admin/breeding-requests');
      if (res.success) setBreedingList(res.data);
    } else if (activeTab === 'vet') {
      const res = await fetchWithAuth('/admin/vet-inquiries');
      if (res.success) setVetList(res.data);
    } else if (activeTab === 'contact') {
      const res = await fetchWithAuth('/contact');
      if (res.success) setContactList(res.data);
    } else if (activeTab === 'trials') {
      const res = await fetchWithAuth('/contact/riding-trial');
      if (res.success) setRidingTrialsList(res.data);
    } else if (activeTab === 'blogs') {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success) setBlogsList(data.data);
      } catch (err) {
        console.error("Failed to load blog articles", err);
      }
    }
    setLoading(false);
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.summary || !blogForm.image || !blogForm.content) {
      showToast("Please fill in all required blog fields.", "error");
      return;
    }
    setSubmittingBlog(true);
    try {
      const res = await fetchWithAuth('/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogForm)
      });
      if (res.success) {
        showToast("Blog article published successfully!");
        setCreateBlogModalOpen(false);
        setBlogForm({ title: '', category: 'Equine Care', author: 'Admin', readTime: '5 min read', summary: '', image: '', content: '' });
        loadTabData();
      } else {
        showToast(res.message || "Failed to publish blog article", "error");
      }
    } catch (err) {
      showToast("Server error while publishing blog", "error");
    } finally {
      setSubmittingBlog(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog article?")) return;
    try {
      const res = await fetchWithAuth(`/blogs/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast("Blog article deleted successfully");
        loadTabData();
      } else {
        showToast(res.message || "Failed to delete blog article", "error");
      }
    } catch (err) {
      showToast("Error deleting blog article", "error");
    }
  };

  // Action Handlers
  const handleBlockUser = async (id, currentStatus) => {
    const res = await fetchWithAuth(`/admin/users/${id}/block`, { method: 'PUT' });
    if (res.success) {
      showToast(`User status updated.`);
      loadTabData();
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Permanently delete this user account?')) return;
    const res = await fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' });
    if (res.success) {
      showToast(`User account deleted.`);
      loadTabData();
    }
  };

  const handleApproveHorse = async (id) => {
    const res = await fetchWithAuth(`/admin/horses/${id}/approve`, { method: 'PUT' });
    if (res.success) {
      showToast(`Listing approved & published to marketplace!`);
      loadTabData();
    }
  };

  const handleRejectHorse = async (id) => {
    const res = await fetchWithAuth(`/admin/horses/${id}/reject`, { method: 'PUT' });
    if (res.success) {
      showToast(`Listing rejected.`);
      loadTabData();
    }
  };

  const handleMarkSold = async (id) => {
    const res = await fetchWithAuth(`/admin/horses/${id}/mark-sold`, { method: 'PUT' });
    if (res.success) {
      showToast(`Listing marked as SOLD.`);
      loadTabData();
    }
  };

  const handleMarkUnsold = async (id) => {
    const res = await fetchWithAuth(`/admin/horses/${id}/mark-unsold`, { method: 'PUT' });
    if (res.success) {
      showToast(`Listing marked as UNSOLD (Available).`);
      loadTabData();
    }
  };

  const handleCloseAuction = async (id) => {
    const res = await fetchWithAuth(`/admin/auctions/${id}/close`, { method: 'PUT' });
    if (res.success) {
      showToast(`Auction closed & horse ownership transferred to highest bidder.`);
      loadTabData();
    }
  };

  const handleDeleteAuction = async (id) => {
    if (!confirm('Delete this auction listing?')) return;
    const res = await fetchWithAuth(`/admin/auctions/${id}`, { method: 'DELETE' });
    if (res.success) {
      showToast(`Auction deleted.`);
      loadTabData();
    }
  };

  const handleUpdateBreedingStatus = async (id, status) => {
    const res = await fetchWithAuth(`/admin/breeding-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    if (res.success) {
      showToast(`Breeding request updated to ${status}.`);
      loadTabData();
    }
  };

  const handleDeleteBreedingRequest = async (id) => {
    if (!confirm('Permanently delete this breeding request query?')) return;
    const res = await fetchWithAuth(`/admin/breeding-requests/${id}`, { method: 'DELETE' });
    if (res.success) {
      showToast('Breeding request deleted successfully.');
      loadTabData();
    }
  };

  const handleDeleteVetInquiry = async (id) => {
    if (!confirm('Permanently delete this AI Vet inquiry record?')) return;
    const res = await fetchWithAuth(`/admin/vet-inquiries/${id}`, { method: 'DELETE' });
    if (res.success) {
      showToast('AI Vet inquiry deleted successfully.');
      loadTabData();
    }
  };

  const handleResolveContact = async (id) => {
    const res = await fetchWithAuth(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'resolved' })
    });
    if (res.success) {
      showToast(`Message marked as resolved.`);
      loadTabData();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Navigation Items Array
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'horses', label: 'Horse Listings', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'auctions', label: 'Auctions', icon: <Gavel className="w-4 h-4" /> },
    { id: 'breeding', label: 'Breeding Requests', icon: <Dna className="w-4 h-4" /> },
    { id: 'trials', label: 'Riding School Trials', icon: <Award className="w-4 h-4" /> },
    { id: 'vet', label: 'AI Vet Inquiries', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Messages', icon: <Mail className="w-4 h-4" /> },
    { id: 'blogs', label: 'Blog Management', icon: <BookOpen className="w-4 h-4" /> }
  ];

  const getStatusBadgeClass = (status) => {
    const base = "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border flex items-center gap-1.5 w-max ";
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'warning':
      case 'new':
        return base + "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'approved':
      case 'active':
      case 'live':
      case 'resolved':
        return base + "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'rejected':
      case 'blocked':
        return base + "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case 'sold':
      case 'contacted':
      case 'read':
        return base + "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return base + "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const filterList = (list, keys) => {
    if (!Array.isArray(list)) return [];
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(item =>
      keys.some(key => {
        const val = item[key];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  };

  if (initializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#C9A227]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="flex flex-col items-center gap-4 p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-200/80 text-center max-w-sm w-full animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C9A227] flex items-center justify-center border border-amber-200/60 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900">Admin Access Required</h2>
            <p className="text-xs text-slate-500 font-medium">Log in with an administrator account to access the control panel.</p>
          </div>
          <Link to="/login" className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-slate-950 font-black text-xs rounded-2xl shadow-md hover:shadow-lg transition">
            Log in as Admin
          </Link>
        </div>
      </div>
    );
  }

  // Derived Metrics for Widgets safely guarded against null/undefined arrays
  const pendingHorses = (Array.isArray(horsesList) ? horsesList : []).filter(h => h?.status === 'pending');
  const approvedHorses = (Array.isArray(horsesList) ? horsesList : []).filter(h => h?.status === 'approved');
  const liveAuctions = (Array.isArray(auctionsList) ? auctionsList : []).filter(a => a?.status === 'live');
  const pendingBreeding = (Array.isArray(breedingList) ? breedingList : []).filter(b => b?.status === 'pending');
  const adminUsersCount = (Array.isArray(usersList) ? usersList : []).filter(u => u?.role === 'admin').length;

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] overflow-hidden text-slate-800 font-sans">

      {/* Mobile Slide-Out Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/85 z-50 transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Mobile Slide-Out Left Navigation Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 h-full w-80 max-w-[85vw] bg-[#0B0F19] border-r border-white/10 flex flex-col justify-between shrink-0 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand Header & Mobile Close Button */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/60 p-0.5 bg-[#020B21] shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center shrink-0">
              <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight text-white leading-none">Horse-Square-Pakistan</h2>
              <span className="text-[9px] font-extrabold text-[#D4AF37] tracking-[0.2em] uppercase block mt-1">Admin Panel</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto relative z-10">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery('');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-2xl text-xs font-black tracking-wide transition-all duration-300 cursor-pointer ${isActive
                  ? 'liquid-glass-nav-active'
                  : 'liquid-glass-nav-inactive'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.id === 'horses' && pendingHorses.length > 0 && (
                  <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-amber-500 text-slate-950 shadow animate-pulse">
                    {pendingHorses.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 liquid-glass-sidebar-footer flex items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/40 text-xs font-extrabold uppercase text-[#D4AF37] shadow">
              A
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-200 block truncate">
                {user?.firstName && user.firstName !== 'Super' ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin'}
              </span>
              <span className="text-[10px] text-amber-200/80 font-bold block truncate">{user?.email || 'admin@horsesquare.pk'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 rounded-xl transition duration-300 shrink-0 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Permanent Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 liquid-glass-sidebar flex-col shrink-0 shadow-2xl z-20">

        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/60 p-0.5 bg-[#020B21] shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center shrink-0">
            <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h2 className="font-black text-sm tracking-tight text-white leading-none">Horse-Square-Pakistan</h2>
            <span className="text-[9px] font-extrabold text-[#D4AF37] tracking-[0.2em] uppercase block mt-1">Admin Panel</span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3.5 py-6 space-y-2 overflow-y-auto relative z-10">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery('');
                }}
                className={`w-full flex items-center justify-between px-4.5 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${isActive
                  ? 'liquid-glass-nav-active font-black'
                  : 'liquid-glass-nav-inactive'
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.id === 'horses' && pendingHorses.length > 0 && (
                  <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-amber-500 text-slate-950 shadow animate-pulse">
                    {pendingHorses.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4.5 liquid-glass-sidebar-footer flex items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/40 text-xs font-extrabold uppercase text-[#D4AF37] shadow">
              A
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-200 block truncate">
                {user?.firstName && user.firstName !== 'Super' ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin'}
              </span>
              <span className="text-[10px] text-amber-200/80 font-bold block truncate">{user?.email || 'admin@horsesquare.pk'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 rounded-xl transition duration-300 shrink-0 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/20 overflow-hidden relative min-w-0 h-full">
        {/* Ambient Glowing Background Liquid Blobs */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-12 right-12 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Content Topbar Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white shrink-0 shadow-sm z-10 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden px-3 py-2 bg-[#020B21] text-[#D4AF37] border border-[#D4AF37]/50 rounded-2xl transition cursor-pointer flex items-center justify-center shrink-0 shadow-sm hover:border-[#D4AF37]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-[#D4AF37]" />
            </button>

            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-800 capitalize flex items-center gap-2 truncate min-w-0">
              {activeTab === 'overview' && <LayoutDashboard className="w-5 h-5 text-[#C9A227] shrink-0" />}
              {activeTab === 'users' && <Users className="w-5 h-5 text-[#C9A227] shrink-0" />}
              {activeTab === 'horses' && <ShoppingBag className="w-5 h-5 text-[#C9A227] shrink-0" />}
              {activeTab === 'auctions' && <Gavel className="w-5 h-5 text-[#C9A227] shrink-0" />}
              {activeTab === 'breeding' && <Dna className="w-5 h-5 text-[#C9A227] shrink-0" />}
              {activeTab === 'vet' && <Stethoscope className="w-5 h-5 text-[#C9A227] shrink-0" />}
              {activeTab === 'contact' && <Mail className="w-5 h-5 text-[#C9A227] shrink-0" />}
              <span className="truncate">{navItems.find(i => i.id === activeTab)?.label}</span>
            </h1>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {toastMsg && (
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-fade-in shadow-sm max-w-[150px] sm:max-w-none truncate">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{toastMsg}</span>
              </span>
            )}
            {error && (
              <span className="text-xs text-rose-600 font-medium flex items-center gap-1.5 bg-rose-50 px-2.5 sm:px-3 py-1.5 rounded-full border border-rose-200 max-w-[150px] sm:max-w-none truncate">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{error}</span>
              </span>
            )}
            <Link
              to="/"
              className="text-xs font-bold px-3 sm:px-4 py-2 liquid-glass-action text-[#C9A227] rounded-xl transition duration-300 border border-[#D4AF37]/30 shadow-sm flex items-center gap-2 shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="hidden sm:inline">Go to Website</span>
              <span className="sm:hidden text-[10px]">Website</span>
            </Link>
          </div>
        </header>

        {/* Content Pane */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 z-10 max-w-[1600px] w-full mx-auto min-w-0">

          {/* OVERVIEW PANEL WITH 5 DEDICATED DOMAIN WIDGETS */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">

              {/* Top Banner Header - Dark Liquid Glass */}
              <div className="liquid-glass-dark rounded-3xl p-7 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden liquid-glass-sheen">
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-[#D4AF37]/60 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-[#D4AF37]/20 relative group overflow-hidden">
                    <img
                      src="/login and registeration .png"
                      alt="HorseSquare Logo"
                      className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Executive Overview
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                      Welcome back, {user?.firstName && user.firstName !== 'Super' && !user.firstName.toLowerCase().includes('account') ? user.firstName : 'Admin'}!
                    </h2>
                    <p className="text-slate-300 text-xs font-medium">
                      Direct controls and live domain metrics for Users, Horse Listings, Auctions, Breeding, and AI Vet services.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5 DEDICATED DOMAIN WIDGETS GRID WITH LIQUID GLASS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* WIDGET 1: USERS DIRECTORY */}
                <div className="liquid-glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition space-y-5 flex flex-col justify-between liquid-glass-sheen">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-600 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-sm">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">Users Directory</h3>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Platform Accounts</span>
                        </div>
                      </div>
                      <span className="text-3xl font-black text-slate-900">{usersList.length}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3.5 bg-white/60 rounded-2xl border border-white/80 shadow-sm">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Admins</span>
                        <h4 className="text-xl font-black text-amber-600 mt-0.5">{adminUsersCount}</h4>
                      </div>
                      <div className="p-3.5 bg-white/60 rounded-2xl border border-white/80 shadow-sm">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Members</span>
                        <h4 className="text-xl font-black text-slate-800 mt-0.5">{usersList.length - adminUsersCount}</h4>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full py-3 liquid-glass-action text-slate-800 font-extrabold rounded-2xl text-xs border border-slate-300/80 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Manage All Users</span> <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                  </button>
                </div>

                {/* WIDGET 2: HORSE LISTINGS & MODERATION */}
                <div className="liquid-glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition space-y-5 flex flex-col justify-between liquid-glass-sheen">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/15 text-[#C9A227] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 shadow-sm">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">Horse Listings</h3>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Marketplace Ads</span>
                        </div>
                      </div>
                      <span className="text-3xl font-black text-slate-900">{horsesList.length}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-400/20 shadow-sm">
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wide">Approved</span>
                        <h4 className="text-base font-black text-emerald-800 mt-0.5">{approvedHorses.length}</h4>
                      </div>
                      <div className="p-3 bg-amber-500/15 rounded-2xl border border-amber-400/30 shadow-sm">
                        <span className="text-[9px] font-black text-amber-700 uppercase tracking-wide">Pending</span>
                        <h4 className="text-base font-black text-amber-800 mt-0.5">{pendingHorses.length}</h4>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-400/20 shadow-sm">
                        <span className="text-[9px] font-black text-blue-700 uppercase tracking-wide">Sold</span>
                        <h4 className="text-base font-black text-blue-800 mt-0.5">{horsesList.filter(h => h.status === 'sold').length}</h4>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('horses')}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                  >
                    <span>Moderate Listings ({pendingHorses.length})</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* WIDGET 3: LIVE AUCTIONS */}
                <div className="liquid-glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition space-y-5 flex flex-col justify-between liquid-glass-sheen">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-sm">
                          <Gavel className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">Live Auctions</h3>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bidding Events</span>
                        </div>
                      </div>
                      <span className="text-3xl font-black text-[#C9A227]">{liveAuctions.length}</span>
                    </div>

                    {liveAuctions.length > 0 ? (
                      <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-400/30 space-y-1 shadow-sm">
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">Active Leading Auction</span>
                        <h4 className="text-xs font-black text-slate-900 truncate">{liveAuctions[0].horseName}</h4>
                        <div className="flex justify-between text-[11px] font-bold text-amber-800 pt-1">
                          <span>Highest Bid:</span>
                          <span>Rs. {Number(liveAuctions[0].currentBid || liveAuctions[0].startingBid).toLocaleString('en-PK')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-white/60 rounded-2xl border border-white/80 text-center text-xs text-slate-500 font-semibold shadow-sm">
                        No active live auctions right now.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTab('auctions')}
                    className="w-full py-3 liquid-glass-action text-slate-800 font-extrabold rounded-2xl text-xs border border-slate-300/80 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>View All Auctions</span> <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                  </button>
                </div>

                {/* WIDGET 4: BREEDING STUD REQUESTS */}
                <div className="liquid-glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition space-y-5 flex flex-col justify-between liquid-glass-sheen">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-purple-500/15 text-purple-600 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-sm">
                          <Dna className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">Breeding Requests</h3>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stud Services</span>
                        </div>
                      </div>
                      <span className="text-3xl font-black text-slate-900">{breedingList.length}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-400/20 shadow-sm">
                        <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Pending Review</span>
                        <h4 className="text-xl font-black text-purple-800 mt-0.5">{pendingBreeding.length}</h4>
                      </div>
                      <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-400/20 shadow-sm">
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Approved Matches</span>
                        <h4 className="text-xl font-black text-emerald-800 mt-0.5">{breedingList.filter(b => b.status === 'approved').length}</h4>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('breeding')}
                    className="w-full py-3 liquid-glass-action text-slate-800 font-extrabold rounded-2xl text-xs border border-slate-300/80 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Manage Breeding</span> <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                  </button>
                </div>

                {/* WIDGET 5: AI VET DOCTOR INQUIRIES */}
                <div className="liquid-glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition space-y-5 flex flex-col justify-between liquid-glass-sheen">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-sm">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">AI Vet Doctor</h3>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Health Diagnoses</span>
                        </div>
                      </div>
                      <span className="text-3xl font-black text-emerald-600">{vetList.length}</span>
                    </div>

                    {vetList.length > 0 ? (
                      <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-400/20 space-y-1 shadow-sm">
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">Latest Medical Inquiry</span>
                        <p className="text-xs font-bold text-slate-800 truncate">{vetList[0].symptoms}</p>
                        <span className="text-[10px] text-slate-500 font-semibold block truncate">Diagnosis: {vetList[0].diagnosis}</span>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-white/60 rounded-2xl border border-white/80 text-center text-xs text-slate-500 font-semibold shadow-sm">
                        No AI Vet diagnoses logged yet.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTab('vet')}
                    className="w-full py-3 liquid-glass-action text-slate-800 font-extrabold rounded-2xl text-xs border border-slate-300/80 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>View AI Vet Logs</span> <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                  </button>
                </div>

              </div>

              {/* QUICK MODERATION QUEUE CARDS SECTION */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> Quick Seller Approval Queue
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">Moderate seller ads directly from the overview dashboard</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('horses')}
                    className="text-xs text-[#C9A227] hover:underline font-bold"
                  >
                    View All Listings →
                  </button>
                </div>

                {pendingHorses.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs font-medium">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    All seller horse listings are verified and active! No pending approvals.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingHorses.slice(0, 3).map((horse) => (
                      <div key={horse._id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4 hover:border-amber-400 transition">
                        <div className="relative h-40 rounded-xl overflow-hidden bg-slate-200">
                          <img
                            src={horse.images && horse.images.length > 0 ? horse.images[0] : 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'}
                            alt={horse.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-amber-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">
                            Pending
                          </span>
                          <span className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-300 font-black text-xs px-2.5 py-1 rounded shadow">
                            Rs. {Number(horse.price).toLocaleString('en-PK')}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{horse.name}</h4>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{horse.breed} • {horse.location}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">Seller: {horse.sellerName} ({horse.phone})</span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => handleApproveHorse(horse._id)}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectHorse(horse._id)}
                            className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl text-xs transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: USERS LIST */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <span className="text-xs text-slate-500 font-semibold">Total Accounts: {usersList.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filterList(usersList, ['firstName', 'lastName', 'email', 'role']).map((u) => {
                      const isUserAdmin = u.role === 'admin';
                      const rawName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                      const displayName = isUserAdmin || rawName.toLowerCase().includes('admin')
                        ? 'Admin'
                        : rawName || 'User';

                      return (
                        <tr key={u._id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-bold text-slate-900">{displayName}</td>
                          <td className="p-3 text-slate-600">{u.email}</td>
                          <td className="p-3 font-bold uppercase text-[10px]">
                            <span className={isUserAdmin ? 'text-[#C9A227] font-black' : 'text-slate-600'}>{u.role}</span>
                          </td>
                          <td className="p-3">
                            <span className={getStatusBadgeClass(u.isBlocked ? 'blocked' : 'active')}>
                              {u.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {isUserAdmin ? (
                              <span className="text-[10px] text-amber-600 font-extrabold px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20 shadow-sm">
                                Protected Admin
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleBlockUser(u._id, u.isBlocked)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                >
                                  {u.isBlocked ? 'Unblock' : 'Block'}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: HORSE LISTINGS */}
          {activeTab === 'horses' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6 animate-fade-in min-w-0">
              {/* Header Filter & View Mode Controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                  <Filter className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-bold text-slate-700 uppercase shrink-0">Filter Status:</span>
                  {['', 'pending', 'approved', 'rejected', 'sold'].map(st => (
                    <button
                      key={st}
                      onClick={() => setHorseFilter(st)}
                      className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${horseFilter === st ? 'bg-[#0F172A] text-amber-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {st || 'All'}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
                  <div className="relative w-full sm:w-56 shrink-0">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search title, seller..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* View Switcher Controls (Grid Cards vs Table List) */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                    <button
                      onClick={() => setHorseViewMode('grid')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                        horseViewMode === 'grid'
                          ? 'bg-[#0F172A] text-amber-300 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" /> Grid
                    </button>
                    <button
                      onClick={() => setHorseViewMode('list')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                        horseViewMode === 'list'
                          ? 'bg-[#0F172A] text-amber-300 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" /> List
                    </button>
                  </div>
                </div>
              </div>

              {/* GRID VIEW (CARDS) */}
              {horseViewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterList(horsesList, ['name', 'sellerName', 'breed', 'location']).map((h) => (
                    <div
                      key={h._id}
                      className="bg-slate-50/70 hover:bg-amber-50/30 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Horse Image with Price & Status Overlay */}
                        <div className="relative h-48 overflow-hidden bg-slate-900">
                          <img
                            src={h.images && h.images.length > 0 ? h.images[0] : 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'}
                            alt={h.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <span className="absolute top-3 left-3 shrink-0">
                            <span className={getStatusBadgeClass(h.status)}>
                              {h.status}
                            </span>
                          </span>
                          <span className="absolute bottom-3 right-3 bg-[#0F172A] text-amber-300 font-black text-xs px-3 py-1 rounded-full border border-amber-500/30 shadow">
                            Rs. {Number(h.price).toLocaleString('en-PK')}
                          </span>
                        </div>

                        {/* Horse Card Body Info */}
                        <div className="p-5 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-extrabold text-base text-slate-900 leading-snug">{h.name}</h4>
                              <p className="text-xs text-slate-500 font-semibold mt-0.5">{h.breed} • {h.location}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
                            <p className="font-medium text-slate-700">Seller: <strong className="text-slate-900">{h.sellerName || 'Seller'}</strong></p>
                            <p className="text-[11px] text-slate-500">📞 {h.phone}</p>
                          </div>

                          {h.autoApproved && (
                            <span className="inline-block px-2.5 py-0.5 text-[9.5px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full mt-1">
                              ⚡ Auto-Approved
                            </span>
                          )}
                          {h.status === 'rejected' && h.rejectionReason && (
                            <p className="text-[10px] text-rose-600 font-semibold mt-1">
                              Reason: {h.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-5 pt-0">
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-200/70">
                          {h.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveHorse(h._id)}
                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow flex items-center justify-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleRejectHorse(h._id)}
                                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl text-xs transition cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {h.status === 'approved' && (
                            <button
                              onClick={() => handleMarkSold(h._id)}
                              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                            >
                              Mark Sold
                            </button>
                          )}
                          {h.status === 'sold' && (
                            <button
                              onClick={() => handleMarkUnsold(h._id)}
                              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold rounded-xl text-xs transition cursor-pointer"
                            >
                              Mark Unsold
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* LIST VIEW (TABLE) */}
              {horseViewMode === 'list' && (
                <div className="overflow-x-auto min-w-0 rounded-2xl border border-slate-200/80">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[650px]">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b">
                      <tr>
                        <th className="p-3 w-16">Image</th>
                        <th className="p-3">Horse & Breed</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Seller Contact</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filterList(horsesList, ['name', 'sellerName', 'breed', 'location']).map((h) => (
                        <tr key={h._id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 w-16">
                            <img
                              src={h.images && h.images.length > 0 ? h.images[0] : 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'}
                              alt={h.name}
                              className="w-12 h-12 rounded-xl object-cover border shrink-0"
                            />
                          </td>
                          <td className="p-3 min-w-[140px]">
                            <h4 className="font-bold text-slate-900 text-sm">{h.name}</h4>
                            <span className="text-[10px] text-slate-500 block">{h.breed} • {h.location}</span>
                          </td>
                          <td className="p-3 font-black text-amber-600 whitespace-nowrap">Rs. {Number(h.price).toLocaleString('en-PK')}</td>
                          <td className="p-3 text-slate-600 min-w-[140px]">{h.sellerName || 'Seller'} <span className="block text-[10px] text-slate-400">{h.phone}</span></td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="space-y-1">
                              <span className={getStatusBadgeClass(h.status)}>
                                {h.status}
                              </span>
                              {h.autoApproved && (
                                <span className="block px-2 py-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded w-fit">
                                  ⚡ Auto-Approved
                                </span>
                              )}
                              {h.status === 'rejected' && h.rejectionReason && (
                                <span className="block text-[9px] text-rose-600 max-w-xs font-semibold">
                                  {h.rejectionReason}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                            {h.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveHorse(h._id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectHorse(h._id)}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-[10px] transition cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {h.status === 'approved' && (
                              <button
                                onClick={() => handleMarkSold(h._id)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
                              >
                                Mark Sold
                              </button>
                            )}
                            {h.status === 'sold' && (
                              <button
                                onClick={() => handleMarkUnsold(h._id)}
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
          )}

          {/* TAB 4: AUCTIONS */}
          {activeTab === 'auctions' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6 animate-fade-in min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 min-w-0">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase">Live & Past Auctions</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage real-time bidding events and close active auctions</p>
                </div>
                <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-full border shrink-0">
                  Active Auctions: {auctionsList.filter(a => a.status === 'live').length}
                </span>
              </div>

              <div className="overflow-x-auto min-w-0 rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs text-slate-700 min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b">
                    <tr>
                      <th className="p-3">Horse</th>
                      <th className="p-3">Current Bid</th>
                      <th className="p-3">Highest Bidder</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auctionsList.map((a) => (
                      <tr key={a._id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900 min-w-[140px]">{a.horseName}</td>
                        <td className="p-3 font-black text-amber-600 whitespace-nowrap">Rs. {Number(a.currentBid || a.startingBid).toLocaleString('en-PK')}</td>
                        <td className="p-3 text-slate-600 min-w-[140px]">{a.highestBidder || 'No bids yet'}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={getStatusBadgeClass(a.status)}>
                            {a.status}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap space-x-2">
                          {a.status === 'live' && (
                            <button
                              onClick={() => handleCloseAuction(a._id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] transition cursor-pointer shadow"
                            >
                              Close Auction
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAuction(a._id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-[10px] transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BREEDING REQUESTS */}
          {activeTab === 'breeding' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6 animate-fade-in min-w-0">
              <div className="border-b pb-4 flex justify-between items-center min-w-0">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase">Breeding Stud Requests</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Review & match mare owner applications with approved studs</p>
                </div>
              </div>

              <div className="overflow-x-auto min-w-0 rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b">
                    <tr>
                      <th className="p-3">Mare Owner Name</th>
                      <th className="p-3">Stud Name</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Mare Details / Pedigree</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {breedingList.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{b.requesterName || b.mareOwnerName || 'Owner'}</td>
                        <td className="p-3 font-semibold text-slate-700 min-w-[130px]">{b.breedingHorse?.name || b.studName || b.preferredBreed || 'Selected Stud'}</td>
                        <td className="p-3 text-slate-600 whitespace-nowrap">{b.phone}</td>
                        <td className="p-3 text-slate-600 min-w-[280px]">
                          {(() => {
                            const detailsStr = b.details || b.ownHorseName || '';
                            if (!detailsStr) return <span className="text-slate-400 font-medium">-</span>;
                            if (detailsStr.includes('|')) {
                              const parts = detailsStr.split('|').map(p => p.trim()).filter(Boolean);
                              return (
                                <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-200/80 space-y-1 max-w-xs sm:max-w-md">
                                  <div className="flex flex-wrap gap-1">
                                    {parts.map((part, idx) => {
                                      const colonIdx = part.indexOf(':');
                                      if (colonIdx !== -1) {
                                        const key = part.slice(0, colonIdx).trim();
                                        const val = part.slice(colonIdx + 1).trim();
                                        return (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border text-[10px]"
                                          >
                                            <span className="font-extrabold text-slate-500 uppercase text-[9px]">{key}:</span>
                                            <span className="font-bold text-slate-900">{val}</span>
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
                              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium whitespace-normal leading-relaxed">
                                {detailsStr}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={getStatusBadgeClass(b.status)}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap space-x-1">
                          <button
                            onClick={() => handleUpdateBreedingStatus(b._id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateBreedingStatus(b._id, 'rejected')}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDeleteBreedingRequest(b._id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: VET INQUIRIES */}
          {activeTab === 'vet' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6 animate-fade-in min-w-0">
              <div className="border-b pb-4 flex justify-between items-center min-w-0">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase">AI Vet Doctor Inquiries</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Automated equine health assessments and diagnostic records</p>
                </div>
              </div>

              <div className="overflow-x-auto min-w-0 rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs text-slate-700 min-w-[650px]">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b">
                    <tr>
                      <th className="p-3 w-28">Date</th>
                      <th className="p-3 w-48">Horse / Symptoms</th>
                      <th className="p-3">AI Diagnosis & Advice</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vetList.map((v) => (
                      <tr key={v._id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-semibold text-slate-500 whitespace-nowrap">{new Date(v.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-bold text-slate-900 min-w-[160px]">
                          <div>{v.horseName || 'My Horse'}</div>
                          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mt-0.5">{v.symptoms || v.symptom || v.details}</div>
                        </td>
                        <td className="p-3 text-slate-600 min-w-[220px] text-xs leading-relaxed font-normal">{v.diagnosis || v.aiResult}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteVetInquiry(v._id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT MESSAGES */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6 animate-fade-in min-w-0">
              {/* Header with Title and Grid / List View Toggle */}
              <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 min-w-0">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D4AF37]" /> Contact Us & Support Inquiries
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Click any inquiry card or row to open 2-way chat & respond to user</p>
                </div>

                {/* View Switcher Controls (Grid Cards vs Table List) */}
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => setContactViewMode('grid')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                      contactViewMode === 'grid'
                        ? 'bg-[#0F172A] text-amber-300 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Grid Cards
                  </button>
                  <button
                    onClick={() => setContactViewMode('list')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                      contactViewMode === 'list'
                        ? 'bg-[#0F172A] text-amber-300 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" /> Table List
                  </button>
                </div>
              </div>

              {/* GRID VIEW (CARDS) */}
              {contactViewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {contactList.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => setSelectedQueryChat(c)}
                      className="bg-slate-50/70 hover:bg-amber-50/40 rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-2xl bg-[#0F172A] text-amber-400 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                              {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-[#C9A227] transition">
                                {c.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate">{c.email || c.phone || 'No Contact'}</p>
                            </div>
                          </div>
                          <span className={getStatusBadgeClass(c.status) + ' shrink-0'}>
                            {c.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Subject</span>
                          <h5 className="font-extrabold text-xs text-slate-800 line-clamp-1">{c.subject || 'General Inquiry'}</h5>
                        </div>

                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                          {c.message}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedQueryChat(c)}
                            className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-[10px] transition cursor-pointer shadow flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-amber-400" /> Open Chat
                          </button>
                          {c.status !== 'resolved' && (
                            <button
                              onClick={async () => {
                                await handleResolveContact(c._id);
                                loadTabData();
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] transition cursor-pointer shadow"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* LIST VIEW (TABLE) */}
              {contactViewMode === 'list' && (
                <div className="overflow-x-auto min-w-0 rounded-2xl border border-slate-200/80">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b">
                      <tr>
                        <th className="p-3">User / Name</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Contact Detail</th>
                        <th className="p-3">Latest Message</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {contactList.map((c) => (
                        <tr
                          key={c._id}
                          onClick={() => setSelectedQueryChat(c)}
                          className="hover:bg-amber-50/50 transition cursor-pointer group"
                        >
                          <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{c.name}</td>
                          <td className="p-3 font-semibold text-slate-700 min-w-[120px]">{c.subject || 'General Inquiry'}</td>
                          <td className="p-3 text-slate-600 whitespace-nowrap">{c.email || c.phone}</td>
                          <td className="p-3 text-slate-600 min-w-[180px] max-w-xs truncate">{c.message}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={getStatusBadgeClass(c.status)}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap space-x-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedQueryChat(c)}
                              className="px-3 py-1 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
                            >
                              Open Chat
                            </button>
                            {c.status !== 'resolved' && (
                              <button
                                onClick={async () => {
                                  await handleResolveContact(c._id);
                                  loadTabData();
                                }}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
                              >
                                Resolve
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
          )}

          {/* TAB 8: RIDING SCHOOL TRIALS */}
          {activeTab === 'trials' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6 animate-fade-in min-w-0">
              <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 min-w-0">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase">Riding School Trial Session Requests</h3>
                  <p className="text-emerald-700 text-xs font-bold mt-0.5 flex items-center gap-1.5">
                    <span>⚡ Trial bookings are automatically approved & dispatched to user's WhatsApp & Email (horsesquarepakistan@gmail.com)</span>
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto min-w-0 rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs text-slate-700 min-w-[800px]">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b">
                    <tr>
                      <th className="p-3">Applicant Name</th>
                      <th className="p-3">Contact (Phone / Email)</th>
                      <th className="p-3">Course & Level</th>
                      <th className="p-3">City & Preferred Slot</th>
                      <th className="p-3">Experience / Goals</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ridingTrialsList.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{t.name}</td>
                        <td className="p-3 whitespace-nowrap">
                          <p className="font-bold text-slate-800">📞 {t.phone}</p>
                          <p className="text-slate-500 text-[11px]">✉️ {t.email}</p>
                        </td>
                        <td className="p-3 min-w-[140px]">
                          <p className="font-black text-[#0F172A]">{t.courseTitle}</p>
                          <span className="inline-block mt-0.5 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                            {t.ridingLevel}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 min-w-[130px]">
                          <p className="font-bold text-slate-800">📍 {t.city}</p>
                          <p className="text-slate-500 text-[11px]">⏱️ {t.preferredSlot}</p>
                        </td>
                        <td className="p-3 text-slate-600 min-w-[160px] max-w-xs truncate">{t.experienceDetails || 'None specified'}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={getStatusBadgeClass(t.status)}>
                              {t.status}
                            </span>
                            <span className="block px-2 py-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded w-fit">
                              ⚡ Auto-Dispatched
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                          {t.status !== 'approved' ? (
                            <button
                              onClick={async () => {
                                const res = await fetchWithAuth(`/contact/riding-trial/${t._id}/approve`, { method: 'PUT' });
                                if (res.success) {
                                  showToast(`Trial Approved! Message auto-dispatched to Email & WhatsApp`);
                                  if (res.whatsappUrl) {
                                    window.open(res.whatsappUrl, '_blank');
                                  }
                                  loadTabData();
                                }
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition cursor-pointer shadow inline-flex items-center gap-1.5"
                            >
                              <span>Approve & Dispatch 💬</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  const cleanPhone = t.phone.replace(/[^0-9]/g, "");
                                  const formattedPhone = cleanPhone.startsWith("0") ? `92${cleanPhone.slice(1)}` : cleanPhone;
                                  const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(t.whatsappMsg || 'Approved Riding Trial Course Curriculum')}`;
                                  window.open(url, '_blank');
                                  showToast(`Opening WhatsApp message for ${t.name}...`);
                                }}
                                className="px-2.5 py-1 bg-[#0F172A] hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold rounded-lg text-[10px] transition cursor-pointer"
                              >
                                Resend WhatsApp 💬
                              </button>
                              <button
                                onClick={async () => {
                                  const res = await fetchWithAuth(`/contact/riding-trial/${t._id}/resend-email`, { method: 'POST' });
                                  if (res.success) {
                                    showToast(`Email resent from horsesquarepakistan@gmail.com to ${t.email}`);
                                  }
                                }}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-lg text-[10px] transition cursor-pointer"
                              >
                                Resend Email 📧
                              </button>
                            </>
                          )}
                          <button
                            onClick={async () => {
                              if (!confirm('Delete this trial booking request?')) return;
                              const res = await fetchWithAuth(`/contact/riding-trial/${t._id}`, { method: 'DELETE' });
                              if (res.success) {
                                showToast(`Trial request deleted.`);
                                loadTabData();
                              }
                            }}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-lg text-[10px] transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: BLOG MANAGEMENT */}
          {activeTab === 'blogs' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6 animate-fade-in min-w-0">
              <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" /> Blog & Equine Article Management
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Publish new horse articles & manage live blog content for site visitors</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* View Switcher Controls (Grid Cards vs Table List) */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                    <button
                      onClick={() => setBlogViewMode('grid')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                        blogViewMode === 'grid'
                          ? 'bg-[#0F172A] text-amber-300 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" /> Grid
                    </button>
                    <button
                      onClick={() => setBlogViewMode('list')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                        blogViewMode === 'list'
                          ? 'bg-[#0F172A] text-amber-300 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" /> List
                    </button>
                  </div>

                  <button
                    onClick={() => setCreateBlogModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-[#D4AF37] text-xs font-bold rounded-xl border border-[#D4AF37]/30 shadow hover:shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-amber-400" /> Publish New Article
                  </button>
                </div>
              </div>

              {/* GRID VIEW (CARDS) */}
              {blogViewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterList(blogsList, ['title', 'category', 'author', 'summary']).map((b) => (
                    <div
                      key={b._id}
                      className="bg-slate-50/70 hover:bg-amber-50/30 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-44 overflow-hidden bg-slate-900">
                          <img
                            src={b.image || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-[#0F172A] text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-500/30 shadow">
                            {b.category}
                          </span>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">{b.author} • {b.readTime || '5 min read'}</span>
                            <h4 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2 mt-1">{b.title}</h4>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-white p-3 rounded-2xl border border-slate-200/70">
                            {b.summary}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteBlog(b._id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete Article
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* LIST VIEW (TABLE) */}
              {blogViewMode === 'list' && (
                <div className="overflow-x-auto min-w-0 rounded-2xl border border-slate-200/80">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b">
                      <tr>
                        <th className="p-3 w-16">Cover</th>
                        <th className="p-3">Title & Category</th>
                        <th className="p-3">Author</th>
                        <th className="p-3">Summary</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filterList(blogsList, ['title', 'category', 'author', 'summary']).map((b) => (
                        <tr key={b._id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 w-16">
                            <img
                              src={b.image || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'}
                              alt={b.title}
                              className="w-12 h-12 rounded-xl object-cover border shrink-0"
                            />
                          </td>
                          <td className="p-3 min-w-[160px]">
                            <h4 className="font-bold text-slate-900 text-xs">{b.title}</h4>
                            <span className="text-[10px] text-amber-600 font-bold block">{b.category}</span>
                          </td>
                          <td className="p-3 text-slate-600 whitespace-nowrap">{b.author}</td>
                          <td className="p-3 text-slate-600 max-w-xs truncate">{b.summary}</td>
                          <td className="p-3 whitespace-nowrap text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteBlog(b._id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-[10px] transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* CREATE NEW BLOG ARTICLE MODAL */}
      {createBlogModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" /> Publish New Blog Article
              </h3>
              <button
                onClick={() => setCreateBlogModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Nezabazi Training & Horse Care"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Breeds">Breeds</option>
                    <option value="Equine Care">Equine Care</option>
                    <option value="Events">Events</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Tariq Mahmood"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  value={blogForm.image}
                  onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Summary *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief summary snippet displayed on cards..."
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Full Content (Paragraphs) *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write the full article content here. Separate paragraphs with line breaks."
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateBlogModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBlog}
                  className="px-5 py-2 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-[#D4AF37] text-xs font-bold rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                  {submittingBlog ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive 2-Way Query Chat Modal */}
      <QueryChatModal
        isOpen={Boolean(selectedQueryChat)}
        onClose={() => setSelectedQueryChat(null)}
        query={selectedQueryChat}
        currentUser={user}
        onQueryUpdated={(updatedQuery) => {
          setSelectedQueryChat(updatedQuery);
          setContactList(contactList.map(q => q._id === updatedQuery._id ? updatedQuery : q));
        }}
      />
    </div>
  );
};
