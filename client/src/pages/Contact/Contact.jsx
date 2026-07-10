import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-up">
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white mb-8 shadow-xl gold-gradient-bar">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Mail className="w-8 h-8 text-[#D4AF37]" /> Contact HorseSquare Pakistan
        </h1>
        <p className="text-slate-300 text-sm mt-1">
          Have questions or inquiries? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-start gap-4">
            <MapPin className="w-6 h-6 text-[#D4AF37] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm">Headquarters</h3>
              <p className="text-xs text-slate-500 mt-1">Hafizabad, Punjab, Pakistan</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-start gap-4">
            <Phone className="w-6 h-6 text-[#D4AF37] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm">Direct Phone</h3>
              <p className="text-xs text-slate-500 mt-1">03059901997</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-start gap-4">
            <Mail className="w-6 h-6 text-[#D4AF37] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm">Email Support</h3>
              <p className="text-xs text-slate-500 mt-1">horsesquarepakistan@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">Send Us a Message</h2>

          {submitted ? (
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-xl text-center border border-emerald-200 py-12">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg">Message Delivered!</h3>
              <p className="text-xs text-slate-600 mt-1">Thank you for reaching out. We will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-3 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0F172A] text-white font-bold rounded-xl text-sm shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-400" /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
