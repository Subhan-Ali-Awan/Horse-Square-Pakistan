import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckCircle, Award, ShieldCheck, Sparkles, BookOpen, Target, CheckCircle2, ChevronRight, UserCheck, Quote, Flame, Calendar, Clock, MapPin, Send, Check, Globe, Phone } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const RidingSchool = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Enable scroll reveal animations
  useScrollReveal('.reveal-on-scroll');
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
      fee: 'Rs. 24,000',
      badge: 'Beginner Level',
      desc: 'Learn mount/dismount balance, basic reins control, posting trot, and grooming fundamentals with certified instructors.'
    },
    {
      id: 'p-inter',
      title: 'Intermediate Horsemanship & Canter Control',
      duration: '6 Weeks (18 Sessions)',
      fee: 'Rs. 28,000',
      badge: 'Intermediate Level',
      desc: 'Master smooth canter transitions, trail riding navigation, obstacle handling, saddle balance control, and equestrian safety techniques under professional guidance.'
    },
    {
      id: 'p2',
      title: 'Advanced Equestrian Tent Pegging',
      duration: '8 Weeks (24 Sessions)',
      fee: 'Rs. 35,000',
      badge: 'Advanced Level',
      desc: 'Tent Pegging Techniques, course navigation, canter lead changes, and competitive equestrian preparation.'
    }
  ];

  const pakistaniLegends = [
    {
      id: 'm1',
      name: 'Malik Ata Muhammad Khan',
      title: 'First Elected President of Equestrian & Tent Pegging Federation',
      experience: 'Pioneer of Pakistani Tent Pegging & Bull Racing',
      location: 'Kot Fateh Khan, Attock, Punjab',
      avatar: '/malik_ata.jpg',
      story: 'Malik Ata was known for his equestrian hobbies. He was the first elected President of the Equestrian & Tent Pegging Federation of Pakistan. He was well known in Pakistan for his efforts to promote tent pegging and bull races.',
      quote: '"Mounting a horse is not about dominance; it is about honor, mutual respect, and keeping traditional equestrian sports alive."'
    },
    {
      id: 'm2',
      name: 'Sahibzada Sultan Muhammad Ali',
      title: 'President of Equestrian Federation of Pakistan (EFP)',
      experience: 'National & International Equestrian Leader',
      location: 'Equestrian Federation of Pakistan, Islamabad',
      avatar: '/sultan_muhammad_ali.jpg',
      story: 'Sahibzada Sultan Muhammad Ali is the President of the Equestrian Federation of Pakistan (EFP), leading national and international horse sports. He is a prominent figure dedicated to advancing traditional riding, tent pegging, and equestrian standards in Pakistan.',
      quote: '"Patience, discipline, and dedication to traditional horsemanship create perfection in the equestrian arena."'
    },
    {
      id: 'm3',
      name: 'Sahibzada Sultan Muhammad Bahadar Aziz',
      title: 'International Nezabazi Champion & M.H Sultania Awan Leader',
      experience: 'International Equestrian Legend & Judge',
      location: 'M.H Sultania Awan Horse Club, Punjab',
      avatar: '/sultan_bahadar.jpg',
      story: 'Sahibzada Sultan Muhammad Bahadar Aziz is an internationally acclaimed equestrian, tent-pegging (Neza Bazi) champion, and leading figure in traditional Pakistani horse sports, representing the lineage and heritage tied to Hazrat Sultan Bahoo. His journey covers international representation, leadership in the M.H Sultania Awan Horse Tent Pegging Club, and professional judging roles in equestrian events.',
      quote: '"Preserving our equestrian heritage, honoring Hazrat Sultan Bahoo\'s lineage, and mastering traditional Nezabazi on the world stage."'
    }
  ];

  const [selectedCityFilter, setSelectedCityFilter] = useState('All');

  const externalSchools = [
    {
      id: 's1',
      name: 'Islamabad Riding Club (IRC)',
      city: 'Islamabad',
      location: 'Chak Shahzad, Park Road, Islamabad',
      focus: 'Certified riding lessons, horse boarding, trail rides & show jumping arena.',
      website: 'http://islamabadridingclub.com',
      phone: '+92 312 5162222',
      badge: 'Certified Academy'
    },
    {
      id: 's2',
      name: 'Islamabad Club Riding Section',
      city: 'Islamabad',
      location: 'Murree Road, Near Rawal Lake, Islamabad',
      focus: 'International polo arenas, show jumping rings, dressage & youth coaching.',
      website: 'https://islamabadclub.org.pk/riding',
      phone: '+92 51 9046000',
      badge: 'Premier Polo Club'
    },
    {
      id: 's3',
      name: 'Equidome Equestrian Center',
      city: 'Lahore',
      location: 'Bedian Road, Near DHA Phase 6, Lahore',
      focus: 'Horsemanship clinics, tent pegging grounds, polo arena & horse care training.',
      website: 'https://equidome.pk',
      phone: '+92 300 8443422',
      badge: 'Popular Training Center'
    },
    {
      id: 's4',
      name: 'Zacky Farms & Polo Club',
      city: 'Lahore',
      location: 'Barki Road, Near Paragon City, Lahore',
      focus: 'Polo coaching clinics, riding academy, luxury stabling & stud breeding.',
      website: 'https://zacky-farms.com',
      phone: '+92 321 4007014',
      badge: 'Polo & Breeding'
    },
    {
      id: 's5',
      name: 'Lahore Garrison Polo & Riding Club (LGPRC)',
      city: 'Lahore',
      location: 'Abid Majid Road, Lahore Cantt, Lahore',
      focus: 'International polo grounds, army equestrian displays, show jumping & cavalry drill.',
      website: 'https://lgprc.com.pk',
      phone: '+92 42 99220556',
      badge: 'Historic Club'
    },
    {
      id: 's6',
      name: 'Manege Equestrian Club',
      city: 'Lahore',
      location: 'Main Bedian Road, Opposite Askari 11, Lahore',
      focus: 'Kids pony riding, adult dressage, outdoor trail rides & horse care workshops.',
      website: 'https://facebook.com/ManegeEquestrianClub',
      phone: '+92 300 4005990',
      badge: 'Family Friendly'
    },
    {
      id: 's7',
      name: 'Karachi Saddle Club',
      city: 'Karachi',
      location: 'Near Sea View, DHA Phase 8, Karachi',
      focus: 'Beach trail riding, show jumping arenas, youth riding programs & pony club.',
      website: 'https://facebook.com/KarachiSaddleClub',
      phone: '+92 300 2011456',
      badge: 'Coastal Riding'
    },
    {
      id: 's8',
      name: 'Rangers Riding & Polo Club',
      city: 'Karachi',
      location: 'HQ Sindh Rangers, North Nazimabad, Karachi',
      focus: 'Polo matches, traditional tent pegging, obstacle course & cavalry drill.',
      website: 'https://sindhrangers.gos.pk',
      phone: '+92 21 99260523',
      badge: 'Cavalry & Pegging'
    },
    {
      id: 's9',
      name: 'Rawalpindi Amateur Riding Club',
      city: 'Rawalpindi',
      location: 'Old Airport Road, Near Ayub National Park, Rawalpindi',
      focus: 'Beginner horsemanship, endurance riding, vaulting & weekend riding classes.',
      website: 'https://facebook.com/RawalpindiRidingClub',
      phone: '+92 333 5129988',
      badge: 'Amateur & Youth'
    },
    {
      id: 's10',
      name: 'Imperial Riding Club',
      city: 'Faisalabad',
      location: 'Canal Road, Near East Canal Interchange, Faisalabad',
      focus: 'Spacious indoor & outdoor training rings, tent pegging, horse boarding & breeding.',
      website: 'https://imperialridingclub.com',
      phone: '+92 300 6601122',
      badge: 'Top Regional Facility'
    },
    {
      id: 's11',
      name: 'Peshawar Garrison Riding Club',
      city: 'Peshawar',
      location: 'Mall Road, Peshawar Cantt, Peshawar',
      focus: 'Traditional Nezabazi (Tent Pegging), cavalry drill & youth riding academy.',
      website: 'https://peshawargarrison.com',
      phone: '+92 91 9212300',
      badge: 'Traditional Nezabazi'
    },
    {
      id: 's12',
      name: 'Multan Polo & Riding Club',
      city: 'Multan',
      location: 'Multan Cantt, Near Army Officers Mess, Multan',
      focus: 'Polo clinics, Desi & Thoroughbred riding, local equestrian tournaments.',
      website: 'https://facebook.com/MultanPoloClub',
      phone: '+92 301 7401122',
      badge: 'Polo & Desi Studs'
    },
    {
      id: 's13',
      name: 'Sargodha Nezabazi & Riding Academy',
      city: 'Sargodha',
      location: 'Stadium Road, Near Officers Colony, Sargodha',
      focus: 'Specialized Tent Pegging (Nezabazi), Desi stud horse handling & competition prep.',
      website: 'https://facebook.com/SargodhaRidingAcademy',
      phone: '+92 300 9665544',
      badge: 'Nezabazi Specialist'
    },
    {
      id: 's14',
      name: 'Quetta Garrison Equestrian Center',
      city: 'Quetta',
      location: 'Cantonment Board Complex, Quetta',
      focus: 'Mountain trail riding, endurance training, show jumping & military drill.',
      website: 'https://facebook.com/QuettaEquestrianCenter',
      phone: '+92 81 9201500',
      badge: 'Mountain Trail'
    },
    {
      id: 's15',
      name: 'Sialkot Royal Equestrian Club',
      city: 'Sialkot',
      location: 'Marala Road, Near Daska Interchange, Sialkot',
      focus: 'Outdoor arena riding, endurance clinics, horse care & beginner lessons.',
      website: 'https://facebook.com/SialkotRoyalEquestrian',
      phone: '+92 322 7889900',
      badge: 'Modern Riding Ring'
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

      const res = await fetch(getApiUrl('/api/contact/riding-trial'), {
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-up">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" /> Professional Riding Academy
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Master Equestrian Skills & Horsemanship
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-light">
            Book a trial riding session with Pakistan's top certified equestrian instructors. Learn balance, canter control, and traditional Nezabazi (Tent Pegging) mastery.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Column (Tips & Safety) + Right Column (Courses) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

        {/* LEFT COLUMN: RIDING TIPS & SAFETY GEAR WIDGETS (Order last on mobile so course cards are top priority) */}
        <div className="lg:col-span-4 space-y-6 order-last lg:order-none">
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-md space-y-3">
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

          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-md space-y-3">
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

          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Flame className="w-4 h-4 text-purple-600" /> Advanced Equestrian Tent Pegging
              </h3>
              <span className="text-[10px] bg-purple-100 text-purple-900 font-extrabold px-2 py-0.5 rounded">Level 3</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> <span><strong>Gallop & Target Lineage:</strong> Maintain full-speed galloping momentum while locking lance trajectory on ground peg.</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> <span><strong>Unseating & Wrist Lift:</strong> Extract target peg cleanly with swift wrist action without disrupting horse rhythm.</span></li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: RIDING COURSES */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-lg flex flex-col justify-between hover:border-[#D4AF37] transition duration-300">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-300">{prog.badge}</span>
                  <span className="font-black text-[#0F172A] text-xs sm:text-sm bg-slate-100 px-3 py-1 rounded-xl border">{prog.fee}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] mt-2 leading-snug">{prog.title}</h3>
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mt-1 mb-3">{prog.duration}</p>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{prog.desc}</p>
              </div>
              <button
                onClick={() => handleOpenBookingModal(prog)}
                className="w-full mt-6 py-3.5 sm:py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Trial Session</span>
                <ChevronRight className="w-4 h-4 text-amber-400 stroke-[2.5]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PAKISTANI LEGENDS BLOG STORIES SECTION */}
      <div className="border-t border-slate-200 pt-10 sm:pt-12 space-y-6 sm:space-y-8">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Equestrian Heritage & Wisdom
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#0F172A]">Pakistani Legends & Mentors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pakistaniLegends.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-lg flex flex-col justify-between space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37] bg-slate-900 shrink-0 shadow-md">
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">{mentor.name}</h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#D4AF37] mt-0.5">{mentor.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic bg-slate-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">"{mentor.story}"</p>
              <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs font-semibold text-amber-900 bg-amber-50/60 p-3 rounded-xl sm:rounded-2xl">
                <Quote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="italic">{mentor.quote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VERIFIED REAL RIDING SCHOOLS DIRECTORY ACROSS PAKISTAN */}
      <div className="border-t border-slate-200 pt-10 sm:pt-12 space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Nationwide Network
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#0F172A]">Real & Active Riding Schools in Pakistan</h2>
            <p className="text-xs text-slate-500 font-medium max-w-xl">
              Explore verified equestrian academies, polo clubs, and tent pegging schools with real locations and direct contact details across Pakistan.
            </p>
          </div>

          {/* City Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-full overflow-x-auto">
            {['All', 'Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Sargodha'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCityFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${selectedCityFilter === c
                    ? 'bg-[#0F172A] text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 15 School Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {externalSchools
            .filter((s) => selectedCityFilter === 'All' || s.city === selectedCityFilter)
            .map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#D4AF37] transition duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                      {school.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" /> {school.city}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-[#B8860B] transition-colors">
                    {school.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-start gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-semibold">{school.location}</span>
                    </p>
                    <p className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{school.focus}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${school.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold rounded-xl text-xs border border-emerald-200 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{school.phone}</span>
                  </a>

                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-amber-300 font-bold rounded-xl text-xs transition shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>Visit ↗</span>
                  </a>
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

                {/* Lahore Stud Farm Location Box */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-left text-xs space-y-1.5 shadow-sm">
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    📍 <span className="text-[#0F172A]">Horse-Square Lahore Stud Farm & Riding Academy</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">Lahore Stud Farm Complex, Lahore, Punjab, Pakistan</p>
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
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phone / WhatsApp *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">City</label>
                    <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold">
                      <option value="Lahore">Lahore</option><option value="Islamabad">Islamabad</option><option value="Karachi">Karachi</option><option value="Other">Other City</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Preferred Slot</label>
                    <select value={formData.preferredSlot} onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold">
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
