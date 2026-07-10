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
  ShoppingBag
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

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
              Horse-Square <span className="text-[#D4AF37]">PK</span>
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
              <div className="flex items-center gap-4">
                <span className="text-xs text-amber-300 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" /> {user.name}
                </span>
                {user.role === 'admin' && (
                  <a
                    href="http://localhost:5000/admin"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-amber-500/20 text-[#D4AF37] border border-amber-500/30 px-3 py-1.5 rounded-lg hover:bg-amber-500/30 transition flex items-center gap-1.5 font-bold"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin Panel
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
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
                <div className="text-slate-400 text-sm font-medium">
                  Signed in as: <span className="text-amber-300 font-bold">{user.name}</span>
                </div>
                {user.role === 'admin' && (
                  <a
                    href="http://localhost:5000/admin"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-amber-500/20 text-[#D4AF37] border border-amber-500/30 py-2.5 rounded-lg hover:bg-amber-500/30 transition text-sm font-bold"
                  >
                    <Shield className="w-4 h-4" /> Admin Panel
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2.5 rounded-lg transition text-sm font-bold cursor-pointer"
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
