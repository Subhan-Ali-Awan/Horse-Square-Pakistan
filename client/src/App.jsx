import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home/Home';
import { Marketplace } from './pages/Marketplace/Marketplace';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { SellHorse } from './pages/SellHorse/SellHorse';
import { Auction } from './pages/Auction/Auction';
import { Breeding } from './pages/Breeding/Breeding';
import { VetDoctor } from './pages/VetDoctor/VetDoctor';
import { RidingSchool } from './pages/RidingSchool/RidingSchool';
import { Contact } from './pages/Contact/Contact';
import { Blog } from './pages/Blog/Blog';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { UserDashboard } from './pages/Dashboard/UserDashboard';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 text-center">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[#C9A227] flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Dashboard Session Update</h2>
            <p className="text-xs text-slate-500 font-medium">A temporary display update occurred. Click below to refresh your session dashboard.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-[#D4AF37] font-black text-xs rounded-2xl border border-[#D4AF37]/30 shadow-md transition-all cursor-pointer"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/register', '/forgot-password', '/admin', '/dashboard'].includes(location.pathname);

  if (hideHeaderFooter) {
    return (
      <div className="min-h-screen lg:h-screen w-full overflow-x-hidden bg-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC]">
      <div>
        <Navbar />
        <main className="pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/sell" element={<SellHorse />} />
            <Route path="/auction" element={<Auction />} />
            <Route path="/breeding" element={<Breeding />} />
            <Route path="/vet" element={<VetDoctor />} />
            <Route path="/riding-school" element={<RidingSchool />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
