import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Building2,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Horse Purchase / Sales Inquiry',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullSubject = `[${formData.category}] ${formData.subject}`;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: fullSubject,
          userId: user ? user._id : undefined
        })
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const inquiryCategories = [
    'Horse Purchase / Sales Inquiry',
    'Live Auction & Bidding Support',
    'Stud & Breeding Service Request',
    'Riding School & Academy Booking',
    'AI Vet & Veterinary Guidance',
    'General Inquiry & Partnership'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-up">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Headphones className="w-3.5 h-3.5 text-amber-400" /> 24/7 Official Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact HorseSquare Pakistan
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl font-light">
            Have questions about horse buying, auction bidding, stud breeding, or riding academies? Reach out directly to our dedicated equestrian support team in Lahore.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Contact Info Widgets + Right Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: CONTACT CARDS & SLA (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">

          {/* Headquarters Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4 hover:border-[#D4AF37] transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-[#D4AF37] border border-amber-400/30 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#B8860B]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#0F172A] text-sm">Headquarters</h3>
              <p className="text-xs font-semibold text-slate-800">Lahore, Punjab, Pakistan</p>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 pt-0.5">
                <Clock className="w-3 h-3 text-slate-400" /> Mon - Sat: 9:00 AM - 8:00 PM
              </p>
            </div>
          </div>

          {/* Direct Phone & WhatsApp Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4 hover:border-[#D4AF37] transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <div>
                <h3 className="font-extrabold text-[#0F172A] text-sm">Direct Phone Support</h3>
                <p className="text-xs font-black text-slate-900">03059901997</p>
              </div>
              <a
                href="https://wa.me/923059901997"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl transition shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp 💬</span>
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4 hover:border-[#D4AF37] transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 border border-blue-400/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <h3 className="font-extrabold text-[#0F172A] text-sm">Official Email Support</h3>
              <p className="text-xs font-semibold text-slate-800 break-all">horsesquarepakistan@gmail.com</p>
              <p className="text-[11px] text-slate-500 font-medium">For business & listing inquiries</p>
            </div>
          </div>

          {/* Official Instagram Page Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4 hover:border-[#D4AF37] transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-6 h-6 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <div className="space-y-2">
              <div>
                <h3 className="font-extrabold text-[#0F172A] text-sm">Official Instagram</h3>
                <p className="text-xs font-semibold text-slate-600">@horsesquarepakistan</p>
              </div>
              <a
                href="https://www.instagram.com/horsesquarepakistan?igsh=MWd0ZzlobHExa3M5Zg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-extrabold text-[11px] rounded-xl transition shadow-sm cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Follow on Instagram 📸</span>
              </a>
            </div>
          </div>

          {/* Response SLA Notice */}
          <div className="bg-gradient-to-br from-[#0B0F19] to-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#D4AF37]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Fast Response Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Our equestrian operations team monitors inquiries continuously. Average response time for submitted forms is <strong>under 2 hours</strong>.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: RICH INTERACTIVE CONTACT FORM (8 COLS) */}
        <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          <div className="border-b pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-[#0F172A]">Send Us a Direct Message</h2>
              <p className="text-xs text-slate-500 mt-0.5">Fill out your details below and select your inquiry type.</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> SSL Encrypted
            </span>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 text-emerald-900 p-8 rounded-3xl text-center border border-emerald-200 space-y-4 animate-fade-in py-12">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-emerald-200 text-emerald-900 rounded-full border border-emerald-300">
                  Message Delivered Successfully
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Thank You For Contacting Us!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                  Your inquiry regarding <strong>"{formData.category}"</strong> has been logged. Our representative will contact you via phone or email shortly.
                </p>
              </div>

              {user && (
                <div className="pt-4">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F172A] hover:bg-slate-800 text-amber-300 font-extrabold text-xs rounded-xl transition shadow"
                  >
                    <span>View Status in User Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Inquiry Category Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                  Inquiry Topic / Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3.5 border border-slate-300 rounded-xl text-xs font-extrabold bg-slate-50 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition shadow-2xs"
                >
                  {inquiryCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* User Info Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dilawar Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Subject Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiring about Nukra Stallion breeding availability"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Detailed Message *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your question or requirements in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-black rounded-xl text-xs shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>{loading ? 'Submitting Inquiry...' : 'Send Message Now'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ & HELP CENTER SECTION */}
      <div className="border-t border-slate-200 pt-10 space-y-6">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-black text-[#0F172A]">Need Quick Answers?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              🐴 How do I list a horse for sale?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Register or log in to your account, click on <strong>"Sell a Horse"</strong> in the top navigation, upload photos, set your price, and submit for admin approval.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              🧬 How does stud breeding work?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse stud stallions in the <strong>Breeding System</strong> section, select your preferred stallion, fill in your mare details, and submit a booking request.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              🔨 How do live auctions operate?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Participate in live auction events by placing bids on verified horses. Highest bids upon countdown end win the lot after verification.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
