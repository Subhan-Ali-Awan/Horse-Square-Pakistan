import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, CheckCircle2, Sparkles } from 'lucide-react';

export const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <>
      <footer className="bg-[#0B0F19] text-slate-300 border-t border-slate-800/90 pt-14 pb-8 mt-20 relative overflow-hidden shadow-2xl">
        
        {/* Ambient background glow element */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

          {/* 5-Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Column 1: Brand & Tagline (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/60 p-0.5 bg-[#020B21] shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center shrink-0">
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
            </div>

            {/* Column 2: QUICK LINKS (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] pb-1 border-b border-slate-800/80">
                QUICK LINKS
              </h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
                <li>
                  <Link to="/marketplace" className="hover:text-amber-300 transition duration-200 block">
                    Browse Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/auctions" className="hover:text-amber-300 transition duration-200 block">
                    Live Auctions
                  </Link>
                </li>
                <li>
                  <Link to="/breeding" className="hover:text-amber-300 transition duration-200 block">
                    Breeding System
                  </Link>
                </li>
                <li>
                  <Link to="/vet-doctor" className="hover:text-amber-300 transition duration-200 block">
                    AI Vet Doctor
                  </Link>
                </li>
                <li>
                  <Link to="/riding-school" className="hover:text-amber-300 transition duration-200 block">
                    Riding School
                  </Link>
                </li>
                <li>
                  <Link to="/sell" className="hover:text-amber-300 transition duration-200 block">
                    Sell Your Horse
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-amber-300 transition duration-200 block">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: POPULAR RESOURCES (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] pb-1 border-b border-slate-800/80">
                POPULAR RESOURCES
              </h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
                <li>
                  <span className="hover:text-amber-300 transition duration-200 cursor-default block">Nukra Stallions</span>
                </li>
                <li>
                  <span className="hover:text-amber-300 transition duration-200 cursor-default block">Thoroughbreds</span>
                </li>
                <li>
                  <span className="hover:text-amber-300 transition duration-200 cursor-default block">Arabian Horses</span>
                </li>
                <li>
                  <span className="hover:text-amber-300 transition duration-200 cursor-default block">Stud Lineage Registry</span>
                </li>
                <li>
                  <span className="hover:text-amber-300 transition duration-200 cursor-default block">Transport Estimator</span>
                </li>
                <li>
                  <span className="hover:text-amber-300 transition duration-200 cursor-default block">Equine Health Guides</span>
                </li>
              </ul>
            </div>

            {/* Column 4: CONTACT US (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] pb-1 border-b border-slate-800/80">
                CONTACT US
              </h4>
              <ul className="space-y-3 text-xs font-medium text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>03059901997</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <a href="mailto:horsesquarepakistan@gmail.com" className="hover:text-amber-300 transition break-all">
                    horsesquarepakistan@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Hafizabad, Punjab, Pakistan</span>
                </li>
              </ul>
            </div>

            {/* Column 5: NEWSLETTER (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-[#D4AF37] pb-1 border-b border-slate-800/80">
                NEWSLETTER
              </h4>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                Subscribe to get the latest updates on jobs and inductions.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 px-2.5 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] hover:to-[#B8860B] text-slate-950 rounded-lg transition duration-200 cursor-pointer shadow flex items-center justify-center"
                    title="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
                {subscribed && (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Subscribed successfully!
                  </span>
                )}
              </form>
            </div>

          </div>

          {/* Bottom Bar Divider & Copyright */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div>
              © {new Date().getFullYear()} HorseSquare Pakistan. All Rights Reserved.
            </div>

            <div className="flex items-center gap-4">
              <Link to="/contact" className="hover:text-amber-400 transition">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link to="/contact" className="hover:text-amber-400 transition">
                Terms & Conditions
              </Link>
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
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="absolute right-full mr-2.5 bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>

        {/* 2. REALISTIC FLOATING INSTAGRAM BUTTON */}
        <a
          href="https://instagram.com/horsesquare.pk"
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
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="absolute right-full mr-2.5 bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Follow on Facebook
          </span>
        </a>

      </div>
    </>
  );
};
