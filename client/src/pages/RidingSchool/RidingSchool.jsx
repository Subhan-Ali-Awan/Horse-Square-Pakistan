import React, { useState } from 'react';
import { Compass, CheckCircle, Award, ShieldCheck, Sparkles, BookOpen, Target, CheckCircle2, ChevronRight, UserCheck, Quote, Flame } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const RidingSchool = () => {
  const [booked, setBooked] = useState(false);
  const [session, setSession] = useState('');

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
      focus: 'Premium equestrian training at TUF campus.',
      website: 'https://tuf.edu.pk',
      phone: '+92 300 8669803'
    },
    {
      name: 'Ashal Horse & Saddle',
      location: 'Multan',
      focus: 'Professional coaching and stables in DHA Multan.',
      website: 'https://dhamultan.org',
      phone: '+92 309 8476144'
    },
    {
      name: 'Coral Horse Riding Club',
      location: 'Faisalabad',
      focus: 'Group horseback sessions and tent pegging.',
      website: 'https://facebook.com/Coralriding/',
      phone: '+92 320 0000228'
    },
    {
      name: 'Garrison Polo & Saddle',
      location: 'Gujranwala',
      focus: 'Military-managed professional equestrian facilities.',
      website: 'https://efp.com.pk',
      phone: '+92 300 8476144'
    }
  ];

  const handleBook = (e) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setSession('');
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up space-y-12">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden gold-gradient-bar">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Certified Equestrian Coaching
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <Compass className="w-8 h-8 text-[#D4AF37]" /> HS Riding Academy ♞
            </h1>
            <p className="text-slate-300 text-sm font-light max-w-xl">
              Structured riding courses from beginner mounting balance to intermediate canter control and advanced championship tent pegging.
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-right shrink-0 hidden sm:block">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Academy Accreditation</span>
            <span className="text-sm font-black text-[#D4AF37]">EFI & EFP Certified Trainers</span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: TECHNIQUE SUGGESTIONS SIDEBAR WIDGETS */}
        <div className="lg:col-span-4 space-y-6">

          {/* WIDGET 1: Beginner Techniques */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Beginner Riding Tips
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                Level 1
              </span>
            </div>
            
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Heels Down & Back Straight:</strong> Keep weight in stirrup heels for instant core balance.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Posting Trot Timing:</strong> Rise and sit smoothly with the horse's outside shoulder rhythm.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 2: Intermediate Techniques */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" /> Intermediate Riding Tips
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded">
                Level 2
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Canter Lead Aids:</strong> Apply inside leg at girth and outside leg behind girth to cue correct lead.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Trail & Obstacle Navigation:</strong> Maintain steady seat contact and soft reins over uneven ground.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 3: Advanced Techniques */}
          <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Advanced & Tent Pegging
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded border border-amber-500/30">
                Level 3
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 font-normal">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Full Gallop Lance Stability:</strong> Secure lower leg grip while locking eyes on the target peg.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Flying Lead Changes:</strong> Shift seat weight effortlessly during high-speed arena turns.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 4: Safety & Gear Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" /> Required Safety Gear
            </h3>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span>Riding Helmet</span>
                <span className="font-bold text-emerald-700">ASTM / SEI Certified</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span>Footwear</span>
                <span className="font-bold text-slate-800">Heel Riding Boots</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50">
                <span>Safety Vest</span>
                <span className="font-bold text-amber-700">Protective Body Armor</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RIDING COURSES & SESSIONS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {programs.map((prog) => (
              <div key={prog.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg flex flex-col justify-between hover:border-[#D4AF37] transition duration-300">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-300">
                      {prog.badge}
                    </span>
                    <span className="font-black text-[#0F172A] text-sm bg-slate-100 px-3 py-1 rounded-xl border">
                      {prog.fee}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0F172A] mt-2 leading-snug">{prog.title}</h3>
                  <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mt-1 mb-3">{prog.duration}</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{prog.desc}</p>
                </div>

                <button
                  onClick={() => setSession(prog.title)}
                  className="w-full mt-6 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-2xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Trial Session</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Pakistan Riding Schools Finder Section */}
      <div className="border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
          📍 Find Riding Schools & Academies Near You
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Explore other popular equestrian clubs and riding academies across Pakistan to start your journey.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {externalSchools.map((school, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {school.location}
                </span>
                <h4 className="text-base font-bold text-[#0F172A] mt-2.5 mb-1">{school.name}</h4>
                <p className="text-xs text-slate-500 mb-2 leading-normal">{school.focus}</p>
                {school.phone && (
                  <p className="text-[11px] font-semibold text-slate-600 mb-4 flex items-center gap-1">
                    📞 {school.phone}
                  </p>
                )}
              </div>
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0F172A] text-xs font-bold rounded-xl transition"
              >
                Visit Website ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* PAKISTANI LEGENDS & MENTORS BLOG STORIES SECTION (READ-ONLY, NO ACTIONS) */}
      <div className="border-t border-slate-200 pt-12 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Equestrian Heritage & Wisdom
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Pakistani Legends & Mentors for Fresh Riders
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-normal">
              Read inspiring horseback journeys and horsemanship lessons directly from Pakistan's most respected veteran mentors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pakistaniLegends.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg flex flex-col justify-between space-y-5 hover:border-[#D4AF37] transition duration-300 relative overflow-hidden">
              <div className="space-y-4">
                
                {/* Header Profile Info */}
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-md shrink-0 bg-slate-900">
                    <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">{mentor.name}</h3>
                    <p className="text-[11px] font-bold text-[#D4AF37] mt-0.5">{mentor.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                      <span>📍 {mentor.location}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">{mentor.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Mentor Journey Blog Text */}
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed font-normal italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    "{mentor.story}"
                  </p>
                </div>

              </div>

              {/* Quote Footer (Read-Only Blog Highlight) */}
              <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs font-semibold text-amber-900 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60">
                <Quote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="italic">{mentor.quote}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
