import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Gavel,
  Dna,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  LayoutDashboard
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const marketplaceLinks = [
    {
      name: 'Browse Marketplace',
      path: '/marketplace',
      description: 'Buy premium horses directly',
      icon: <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
    },
    {
      name: 'Sell a Horse',
      path: '/sell',
      description: 'List your horse on marketplace',
      icon: <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
    },
    {
      name: 'Live Auction',
      path: '/auction',
      description: 'Bid on elite breeds in real-time',
      icon: <Gavel className="w-4 h-4 text-[#D4AF37]" />
    }
  ];

  const equineServices = [
    {
      name: 'Breeding System',
      path: '/breeding',
      description: 'Find stud matches and check lineage',
      icon: <Dna className="w-4 h-4 text-[#D4AF37]" />
    },
    {
      name: 'Riding School',
      path: '/riding-school',
      description: 'Locate local training and courses',
      icon: <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
    }
  ];

  const isMarketplaceActive = marketplaceLinks.some(link => isActive(link.path));
  const isEquineServicesActive = equineServices.some(service => isActive(service.path));

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-amber-100 to-[#D4AF37] bg-clip-text text-transparent group-hover:opacity-90 transition">
              Horse-Square <span className="text-[#D4AF37]">Pakistan</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold tracking-wide hover:text-[#D4AF37] transition ${isActive('/') ? 'text-[#D4AF37]' : 'text-slate-300'
                }`}
            >
              Home
            </Link>

            {/* Marketplace Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsMarketplaceOpen(true)}
              onMouseLeave={() => setIsMarketplaceOpen(false)}
            >
              <button
                onClick={() => setIsMarketplaceOpen(!isMarketplaceOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide hover:text-[#D4AF37] transition focus:outline-none cursor-pointer py-4 ${isMarketplaceActive ? 'text-[#D4AF37]' : 'text-slate-300'
                  }`}
              >
                Marketplace
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMarketplaceOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Marketplace Dropdown Menu */}
              <div
                className={`absolute left-0 mt-0 w-72 bg-[#0F172A] border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-top-left ${isMarketplaceOpen
                  ? 'opacity-100 scale-100 translate-y-0 visible'
                  : 'opacity-0 scale-95 -translate-y-2 invisible'
                  }`}
              >
                <div className="p-2 space-y-1">
                  {marketplaceLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMarketplaceOpen(false)}
                      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition ${isActive(link.path) ? 'bg-slate-800/40 text-[#D4AF37]' : 'text-slate-300 hover:text-white'
                        }`}
                    >
                      <div className="mt-0.5 p-1 bg-amber-500/10 rounded">
                        {link.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{link.name}</div>
                        <div className="text-slate-400 text-xs mt-0.5 font-normal leading-normal">
                          {link.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide hover:text-[#D4AF37] transition focus:outline-none cursor-pointer py-4 ${isEquineServicesActive ? 'text-[#D4AF37]' : 'text-slate-300'
                  }`}
              >
                Equine Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 mt-0 w-72 bg-[#0F172A] border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-top-left ${isServicesOpen
                  ? 'opacity-100 scale-100 translate-y-0 visible'
                  : 'opacity-0 scale-95 -translate-y-2 invisible'
                  }`}
              >
                <div className="p-2 space-y-1">
                  {equineServices.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      onClick={() => setIsServicesOpen(false)}
                      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition ${isActive(service.path) ? 'bg-slate-800/40 text-[#D4AF37]' : 'text-slate-300 hover:text-white'
                        }`}
                    >
                      <div className="mt-0.5 p-1 bg-amber-500/10 rounded">
                        {service.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{service.name}</div>
                        <div className="text-slate-400 text-xs mt-0.5 font-normal leading-normal">
                          {service.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/vet"
              className={`text-sm font-semibold tracking-wide hover:text-[#D4AF37] transition ${isActive('/vet') ? 'text-[#D4AF37]' : 'text-slate-300'
                }`}
            >
              AI Vet Doctor
            </Link>

            <Link
              to="/blog"
              className={`text-sm font-semibold tracking-wide hover:text-[#D4AF37] transition ${isActive('/blog') ? 'text-[#D4AF37]' : 'text-slate-300'
                }`}
            >
              Blog
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-semibold tracking-wide hover:text-[#D4AF37] transition ${isActive('/contact') ? 'text-[#D4AF37]' : 'text-slate-300'
                }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Desktop Authentication / User info */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {/* Profile Avatar Button Trigger */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-[#D4AF37]/60 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs flex items-center justify-center shadow-inner ring-2 ring-amber-500/20 group-hover:scale-105 transition duration-200">
                    {user.firstName ? user.firstName[0].toUpperCase() : user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-extrabold text-slate-200 group-hover:text-amber-300 transition max-w-[110px] truncate">
                    {user.firstName || user.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-64 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right z-50 ${
                    isProfileOpen
                      ? 'opacity-100 scale-100 translate-y-0 visible'
                      : 'opacity-0 scale-95 -translate-y-2 invisible'
                  }`}
                >
                  {/* User Profile Summary Header */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 to-[#1E293B] border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow">
                      {user.firstName ? user.firstName[0].toUpperCase() : user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-black text-white truncate">
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {user.role === 'admin' ? '🛡️ Super Admin' : '👤 Member'}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Navigation Links */}
                  <div className="p-2 space-y-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" /> My Dashboard
                    </Link>
                  </div>

                  {/* Logout Action */}
                  <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs text-[#0F172A] bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] hover:to-[#B8860B] font-bold px-4 py-2 rounded-lg transition shadow"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs text-white bg-slate-800 hover:bg-slate-700 font-semibold px-4 py-2 rounded-lg border border-slate-700/60 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div
        className={`md:hidden border-t border-slate-800 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[1000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-4 bg-[#0B0F19]">

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/') ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              Home
            </Link>

            {/* Mobile Marketplace Options */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Marketplace
              </div>
              <div className="pl-4 space-y-1 border-l border-slate-800">
                {marketplaceLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${isActive(link.path) ? 'text-[#D4AF37] bg-slate-800/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Services Options */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Equine Services
              </div>
              <div className="pl-4 space-y-1 border-l border-slate-800">
                {equineServices.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${isActive(service.path) ? 'text-[#D4AF37] bg-slate-800/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    {service.icon}
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/vet"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/vet') ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              AI Vet Doctor
            </Link>

            <Link
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/blog') ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              Blog
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/contact') ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-4 border-t border-slate-800">
            {user ? (
              <div className="space-y-3 px-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow">
                    {user.firstName ? user.firstName[0].toUpperCase() : user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 py-2.5 rounded-xl hover:bg-[#D4AF37]/20 transition text-xs font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" /> My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2.5 rounded-xl transition text-xs font-bold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] hover:to-[#B8860B] text-[#0F172A] font-bold py-2.5 rounded-lg transition shadow text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center text-white bg-slate-800 hover:bg-slate-700 font-semibold py-2.5 rounded-lg border border-slate-700 transition text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

    </header>
  );
};
