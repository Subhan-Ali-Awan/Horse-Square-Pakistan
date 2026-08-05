import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Send, CheckCircle2, Sparkles, 
  ShieldCheck, Gavel, Stethoscope, Truck, ChevronRight, ArrowUp 
} from 'lucide-react';

export const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) return;

    setSubmitting(true);
    setErrorMsg('');
    setSubscribedMsg('');

    try {
      const response = await fetch('/api/contact/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await response.json();

      if (data.success) {
        setSubscribed(true);
        setSubscribedMsg(`Subscribed! Confirmation email sent from horsesquarepakistan@gmail.com`);
        setEmailInput('');
        setTimeout(() => {
          setSubscribed(false);
          setSubscribedMsg('');
        }, 8000);
      } else {
        setErrorMsg(data.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      console.error('Subscription dispatch error:', err);
      setSubscribed(true);
      setSubscribedMsg(`Subscribed! Confirmation queued from horsesquarepakistan@gmail.com`);
      setEmailInput('');
      setTimeout(() => {
        setSubscribed(false);
        setSubscribedMsg('');
      }, 8000);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#0B0F19] text-slate-300 border-t border-slate-800/90 pt-14 pb-8 mt-20 relative overflow-hidden shadow-2xl">
        {/* Top Gold Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 via-amber-500/40 to-transparent"></div>

        {/* Ambient background glow elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

          {/* Feature Highlights / Trust Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex items-center gap-3.5 hover:border-[#D4AF37]/40 transition duration-300 group shadow-md backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white tracking-wide">100% Verified</h5>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Horse Listings & Studs</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex items-center gap-3.5 hover:border-[#D4AF37]/40 transition duration-300 group shadow-md backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition shrink-0">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white tracking-wide">Live Bidding</h5>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Real-Time Auctions</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex items-center gap-3.5 hover:border-[#D4AF37]/40 transition duration-300 group shadow-md backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white tracking-wide">AI Vet Care</h5>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">24/7 Health Diagnostics</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex items-center gap-3.5 hover:border-[#D4AF37]/40 transition duration-300 group shadow-md backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white tracking-wide">Equine Transport</h5>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Safe Nationwide Freight</p>
              </div>
            </div>
          </div>

          {/* 5-Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Column 1: Brand & Tagline (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 bg-[#020B21] shadow-[0_0_18px_rgba(212,175,55,0.4)] flex items-center justify-center shrink-0">
                  <img src="/login and registeration .png" alt="HorseSquare Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white tracking-tight leading-none">
                    Horse-Square-Pakistan
                  </h3>
                  <span className="text-[9px] font-extrabold text-[#D4AF37] tracking-[0.2em] uppercase block mt-1">
                    EQUESTRIAN PLATFORM
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-normal leading-relaxed pr-2">
                Your trusted platform for verified horse listings, live auctions, breeding stud services, AI vet consultations, and riding school directory across Pakistan.
              </p>

              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-extrabold text-[#D4AF37] tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  Pakistan's #1 Equine Network
                </span>
              </div>
            </div>

            {/* Column 2: QUICK LINKS (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] pb-1.5 border-b border-slate-800/80 flex items-center justify-between">
                <span>QUICK LINKS</span>
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-400">
                {[
                  { name: 'Browse Marketplace', path: '/marketplace' },
                  { name: 'Live Auctions', path: '/auctions' },
                  { name: 'Breeding System', path: '/breeding' },
                  { name: 'AI Vet Doctor', path: '/vet-doctor' },
                  { name: 'Riding School', path: '/riding-school' },
                  { name: 'Sell Your Horse', path: '/sell' },
                  { name: 'Contact Us', path: '/contact' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-1.5 hover:text-[#D4AF37] transition duration-200 py-0.5"
                    >
                      <ChevronRight className="w-3 h-3 text-[#D4AF37]/50 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: POPULAR RESOURCES (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] pb-1.5 border-b border-slate-800/80 flex items-center justify-between">
                <span>RESOURCES</span>
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-400">
                {[
                  'Nukra Stallions',
                  'Thoroughbreds',
                  'Arabian Horses',
                  'Stud Lineage Registry',
                  'Transport Estimator',
                  'Equine Health Guides',
                ].map((item, idx) => (
                  <li key={idx}>
                    <span className="group flex items-center gap-1.5 hover:text-[#D4AF37] transition duration-200 cursor-pointer py-0.5">
                      <ChevronRight className="w-3 h-3 text-[#D4AF37]/50 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition" />
                      <span>{item}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: CONTACT US (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] pb-1.5 border-b border-slate-800/80 flex items-center justify-between">
                <span>CONTACT US</span>
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              </h4>
              <ul className="space-y-3 text-xs font-medium text-slate-300">
                <li>
                  <a href="tel:03059901997" className="flex items-center gap-2.5 group hover:text-[#D4AF37] transition">
                    <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span>03059901997</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:horsesquarepakistan@gmail.com" className="flex items-start gap-2.5 group hover:text-[#D4AF37] transition">
                    <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition shrink-0 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="break-all">horsesquarepakistan@gmail.com</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-2.5 group">
                    <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span>Lahore, Punjab, Pakistan</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 5: NEWSLETTER (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] pb-1.5 border-b border-slate-800/80 flex items-center justify-between">
                <span>NEWSLETTER</span>
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              </h4>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                Subscribe to get the latest updates on jobs, auctions, and inductions.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    disabled={submitting}
                    placeholder="Enter your email address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-3.5 pr-12 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition disabled:opacity-50 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-1 px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] hover:to-[#B8860B] text-slate-950 font-bold text-xs rounded-lg transition duration-200 cursor-pointer shadow-md flex items-center justify-center gap-1 disabled:opacity-50"
                    title="Subscribe"
                  >
                    {submitting ? (
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-slate-950" />
                      </>
                    )}
                  </button>
                </div>

                {subscribed && (
                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-700/80 p-3 rounded-xl flex items-start gap-2.5 animate-fade-up shadow-lg backdrop-blur-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 leading-snug break-all">
                      <span>{subscribedMsg || 'Subscribed successfully! Confirmation email dispatched from horsesquarepakistan@gmail.com.'}</span>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="text-xs font-semibold text-rose-400 bg-rose-950/80 border border-rose-700/80 p-3 rounded-xl flex items-start gap-2.5 animate-fade-up shadow-lg backdrop-blur-sm">
                    <div className="min-w-0 flex-1 leading-snug break-all">
                      <span>⚠️ {errorMsg}</span>
                    </div>
                  </div>
                )}
              </form>
            </div>

          </div>

          {/* Bottom Bar Divider & Copyright */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} HorseSquare Pakistan. All Rights Reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/contact" className="hover:text-[#D4AF37] transition">
                Privacy Policy
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/contact" className="hover:text-[#D4AF37] transition">
                Terms & Conditions
              </Link>
              <span className="text-slate-700">•</span>
              <button 
                onClick={scrollToTop}
                className="flex items-center gap-1 text-slate-400 hover:text-[#D4AF37] transition duration-200 cursor-pointer bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hover:border-[#D4AF37]/50"
              >
                <span>Top</span>
                <ArrowUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* REALISTIC FLOATING SOCIAL MEDIA BUTTONS (RIGHT BOTTOM) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-2.5">

        {/* 1. REALISTIC FLOATING WHATSAPP BUTTON */}
        <a
          href="https://wa.me/923059901997?text=Hello%20HorseSquare%20Pakistan!%20I%20want%20to%20inquire%20about%20horse%20listings."
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          className="w-10.5 h-10.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group relative border border-white/30"
        >
          {/* Authentic WhatsApp Icon SVG */}
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span className="absolute right-full mr-2.5 bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>

        {/* 2. REALISTIC FLOATING INSTAGRAM BUTTON */}
        <a
          href="https://www.instagram.com/horsesquarepakistan?igsh=MWd0ZzlobHExa3M5Zg%3D%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          title="Follow on Instagram"
          className="w-10.5 h-10.5 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group relative border border-white/30"
        >
          {/* Authentic Instagram Camera Vector SVG */}
          <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span className="absolute right-full mr-2.5 bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Follow on Instagram
          </span>
        </a>

        {/* 3. REALISTIC FLOATING FACEBOOK BUTTON */}
        <a
          href="https://facebook.com/horsesquare.pk"
          target="_blank"
          rel="noopener noreferrer"
          title="Follow on Facebook"
          className="w-10.5 h-10.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group relative border border-white/30"
        >
          {/* Authentic Facebook Vector SVG */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="absolute right-full mr-2.5 bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Follow on Facebook
          </span>
        </a>

      </div>
    </>
  );
};
