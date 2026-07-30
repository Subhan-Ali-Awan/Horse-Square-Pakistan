import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckCircle, Award, ShieldCheck, Sparkles, BookOpen, Target, CheckCircle2, ChevronRight, UserCheck, Quote, Flame, Calendar, Clock, MapPin, Send, Check } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

export const RidingSchool = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Lahore',
    ridingLevel: 'Beginner',
    preferredSlot: 'Weekend Morning',
    experienceDetails: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [generatedWaUrl, setGeneratedWaUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(10);

  const programs = [
    {
      id: 'p1',
      title: 'Beginner Riding Foundation',
      duration: '4 Weeks (12 Sessions)',
      fee: 'Rs. 35,000',
      badge: 'Beginner Level',
      desc: 'Learn mount/dismount balance, basic reins control, posting trot, and grooming fundamentals with certified instructors.'
    },
    {
      id: 'p-inter',
      title: 'Intermediate Horsemanship & Canter Control',
      duration: '6 Weeks (18 Sessions)',
      fee: 'Rs. 52,000',
      badge: 'Intermediate Level',
      desc: 'Master smooth canter transitions, trail riding navigation, obstacle handling, saddle balance control, and equestrian safety techniques under professional guidance.'
    },
    {
      id: 'p2',
      title: 'Advanced Equestrian Tent Pegging',
      duration: '8 Weeks (24 Sessions)',
      fee: 'Rs. 75,000',
      badge: 'Advanced Level',
      desc: 'Tent Pegging Techniques, course navigation, canter lead changes, and competitive equestrian preparation.'
    }
  ];

  const pakistaniLegends = [
    {
      id: 'm1',
      name: 'Malik Sultan Khan Awan',
      title: 'National Nezabazi (Tent Pegging) Legend',
      experience: '40+ Years Mastery',
      location: 'Sargodha, Punjab',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      story: 'My horseback journey started at the age of 8 in the rural grounds of Sargodha. Mounting a horse is not about dominance; it is about building mutual trust. To fresh riders, I always advise: develop a quiet seat first. Once you respect your horse, the reins become an extension of your heart.',
      quote: '"A horse doesn’t care how much you know until he knows how much you care."'
    },
    {
      id: 'm2',
      name: 'Chaudhry Zafar Iqbal',
      title: 'Master Polo & Endurance Riding Coach',
      experience: '32 Years International Coach',
      location: 'Lahore Turf Club',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      story: 'When I began my polo training in Lahore, my first instructor made me spend 3 weeks just grooming and feeding the horses before mounting. That taught me patience. Beginners must understand that horsemanship is 80% ground relationship and 20% saddle technique.',
      quote: '"Patience on the ground creates perfection in the arena."'
    },
    {
      id: 'm3',
      name: 'Syed Shahzad Ali Shah',
      title: 'Senior Dressage & Jumping Instructor',
      experience: '28 Years Equestrian Mentor',
      location: 'Islamabad Riding Club',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      story: 'Over my 28 years of coaching riders in Islamabad, I have seen beginners fear the canter. The key is relaxed hips and breathing rhythmically. Every fall teaches you how to sit deeper. Never give up on your first 10 sessions.',
      quote: '"Fall 7 times, mount 8 times. The saddle is where resilience is born."'
    }
  ];

  const externalSchools = [
    {
      name: 'Islamabad Riding Club',
      location: 'Islamabad',
      focus: 'Riding lessons, boarding & trail rides in Chak Shahzad.',
      website: 'http://islamabadridingclub.com',
      phone: '+92 312 5162222'
    },
    {
      name: 'Equidome',
      location: 'Lahore',
      focus: 'Horsemanship training, tent pegging, and polo.',
      website: 'https://equidome.pk',
      phone: '+92 300 8443422'
    },
    {
      name: 'Islamabad Club Riding',
      location: 'Islamabad',
      focus: 'Prestigious riding arenas & specialized polo grounds.',
      website: 'https://islamabadclub.org.pk/riding',
      phone: '+92 51 9046000'
    },
    {
      name: 'Zacky Farms Polo Club',
      location: 'Lahore',
      focus: 'Beginner coaching and professional polo clinics.',
      website: 'https://zacky-farms.com',
      phone: '+92 321 4007014'
    },
    {
      name: 'Imperial Riding Club',
      location: 'Faisalabad',
      focus: 'Spacious training rings & certified instructors.',
      website: 'https://imperialridingclub.com',
      phone: '+92 300 6601122'
    }
  ];

  const handleOpenBookingModal = (prog) => {
    setSelectedProgram(prog);
    setFormData({
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      phone: user?.phone || '',
      email: user?.email || '',
      city: 'Hafizabad',
      ridingLevel: prog.badge.includes('Beginner') ? 'Beginner' : prog.badge.includes('Intermediate') ? 'Intermediate' : 'Advanced',
      preferredSlot: 'Weekend Morning',
      experienceDetails: ''
    });
    setSubmittedSuccess(false);
    setGeneratedWaUrl('');
    setErrorMessage('');
    setCountdown(10);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMessage('Please enter your full name, phone number, and email address.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const res = await fetch('/api/contact/riding-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          courseTitle: selectedProgram.title,
          userId: user?._id
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        setGeneratedWaUrl(data.whatsappUrl || '');
        setCountdown(10);

        // Immediately open WhatsApp with auto-generated curriculum payload
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }

        let currentCount = 10;
        const interval = setInterval(() => {
          currentCount -= 1;
          setCountdown(currentCount);
          if (currentCount <= 0) {
            clearInterval(interval);
            setSelectedProgram(null);
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Failed to submit booking request.');
      }
    } catch (err) {
      setErrorMessage('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-up">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border border-slate-800">
        <div className="space-y-4 max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Professional Riding Academy
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Master Equestrian Skills & Horsemanship
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Book a trial riding session with Pakistan's top certified equestrian instructors. Learn balance, canter control, and traditional Nezabazi (Tent Pegging) mastery.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Column (Tips & Safety) + Right Column (Courses) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: RIDING TIPS & SAFETY GEAR WIDGETS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Beginner Riding Tips
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded">Level 1</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Heels Down & Back Straight:</strong> Keep weight in stirrup heels for instant core balance.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Posting Trot Timing:</strong> Rise and sit smoothly with the horse's outside shoulder rhythm.</span></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" /> Intermediate Riding Tips
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded">Level 2</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> <span><strong>Canter Lead Aids:</strong> Apply inside leg at girth and outside leg behind girth to cue correct lead.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> <span><strong>Trail & Obstacle Navigation:</strong> Maintain steady seat contact and soft reins over uneven ground.</span></li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: RIDING COURSES */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg flex flex-col justify-between hover:border-[#D4AF37] transition duration-300">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-300">{prog.badge}</span>
                  <span className="font-black text-[#0F172A] text-sm bg-slate-100 px-3 py-1 rounded-xl border">{prog.fee}</span>
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mt-2 leading-snug">{prog.title}</h3>
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mt-1 mb-3">{prog.duration}</p>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{prog.desc}</p>
              </div>
              <button
                onClick={() => handleOpenBookingModal(prog)}
                className="w-full mt-6 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-2xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Trial Session</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PAKISTANI LEGENDS BLOG STORIES SECTION */}
      <div className="border-t border-slate-200 pt-12 space-y-8">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Equestrian Heritage & Wisdom
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Pakistani Legends & Mentors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pakistaniLegends.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg flex flex-col justify-between space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D4AF37] bg-slate-900"><img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" /></div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{mentor.name}</h3>
                  <p className="text-[11px] font-bold text-[#D4AF37]">{mentor.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">"{mentor.story}"</p>
              <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs font-semibold text-amber-900 bg-amber-50/60 p-3 rounded-2xl">
                <Quote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="italic">{mentor.quote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOK TRIAL SESSION MODAL */}
      {selectedProgram && (
        <Modal isOpen={!!selectedProgram} onClose={() => setSelectedProgram(null)} title="">
          <div className="space-y-5 p-2">
            <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-5 rounded-2xl border border-slate-800 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                {selectedProgram.badge}
              </span>
              <h3 className="text-lg font-black text-white mt-2">{selectedProgram.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-xs text-amber-200 font-bold">
                <span>⏱️ {selectedProgram.duration}</span>
                <span>•</span>
                <span>💳 Fee: {selectedProgram.fee}</span>
              </div>
            </div>

            {submittedSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse">
                  <Check className="w-9 h-9 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-emerald-500/20 text-emerald-800 rounded-full border border-emerald-500/30">
                    Booking Submitted & Approved
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 mt-2">Thanks For Interested!</h4>
                  <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center justify-center gap-1.5">
                    <span>Redirecting to your User Dashboard in</span>
                    <span className="inline-block px-2 py-0.5 bg-slate-900 text-amber-300 rounded font-black text-sm shadow">{countdown}s</span>
                  </p>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed max-w-md mx-auto bg-white/70 p-3 rounded-xl border border-slate-200">
                  Your trial request for <strong>{selectedProgram.title}</strong> is <strong>APPROVED</strong>! Your course curriculum, fee structure, and location map link have been automatically delivered to your Email and Dashboard Inbox.
                </p>

                {/* Hafizabad Stud Farm Location Box */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-left text-xs space-y-1.5 shadow-sm">
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    📍 <span className="text-[#0F172A]">Horse-Square Hafizabad Stud Farm & Riding Academy</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">Hafizabad Stud Farm Complex, Hafizabad, Punjab, Pakistan</p>
                  <a
                    href="https://maps.app.goo.gl/6RSSd7M6WTG8r6Qy6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 underline pt-0.5"
                  >
                    🗺️ Open Google Maps Location ↗
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {generatedWaUrl && (
                    <a
                      href={generatedWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Get Details via WhatsApp 💬</span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProgram(null);
                      navigate('/dashboard');
                    }}
                    className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Go to Dashboard Now →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                {errorMessage && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-700 font-bold">⚠️ {errorMessage}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phone / WhatsApp *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">City</label>
                    <select value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold">
                      <option value="Lahore">Lahore</option><option value="Islamabad">Islamabad</option><option value="Karachi">Karachi</option><option value="Other">Other City</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Preferred Slot</label>
                    <select value={formData.preferredSlot} onChange={(e) => setFormData({...formData, preferredSlot: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold">
                      <option value="Weekend Morning">Weekend Morning</option><option value="Weekend Afternoon">Weekend Afternoon</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-2">
                  {submitting ? 'Submitting...' : 'Submit Trial Booking'}
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
