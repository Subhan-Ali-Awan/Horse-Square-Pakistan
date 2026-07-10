import React, { useState } from 'react';
import { Compass, CheckCircle } from 'lucide-react';

export const RidingSchool = () => {
  const [booked, setBooked] = useState(false);
  const [session, setSession] = useState('');

  const programs = [
    {
      id: 'p1',
      title: 'Beginner Riding Foundation',
      duration: '4 Weeks (12 Sessions)',
      fee: 'Rs. 35,000',
      desc: 'Learn mount/dismount balance, basic reins control, posting trot, and grooming fundamentals with certified instructors.'
    },
    {
      id: 'p2',
      title: 'Advanced Equestrian Tent Pegging',
      duration: '8 Weeks (24 Sessions)',
      fee: 'Rs. 75,000',
      desc: 'Tent Pegging Techniques, course navigation, canter lead changes, and competitive equestrian preparation.'
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
    },
    {
      name: 'Rachna Polo Club',
      location: 'Sialkot',
      focus: 'Equestrian training & polo in Sialkot Cantonment.',
      website: 'https://efp.com.pk',
      phone: '+92 322 7088940'
    },
    {
      name: 'Wazirabad Equestrian Club',
      location: 'Wazirabad',
      focus: 'Local tent pegging coordination & riding group.',
      website: 'https://efp.com.pk',
      phone: '+92 313 7212599'
    }
  ];

  const handleBook = (e) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-up">
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white mb-8 shadow-xl gold-gradient-bar">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Compass className="w-8 h-8 text-[#D4AF37]" /> HS Riders ♞
        </h1>
        <p className="text-slate-300 text-sm mt-1">
          Professional horseback riding lessons, Tent Pegging, and dressage courses in Lahore, Islamabad, Faisalabad, Multan, Gujranwala, Sialkot & Wazirabad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col justify-between hover:border-[#D4AF37] transition">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-[#0F172A]">{prog.title}</h3>
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full border border-amber-300">
                  {prog.fee}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-3">{prog.duration}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{prog.desc}</p>
            </div>

            <button
              onClick={() => setSession(prog.title)}
              className="w-full mt-6 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-sm transition shadow"
            >
              Book Trial Session
            </button>
          </div>
        ))}
      </div>

      {session && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl max-w-lg mx-auto mb-12">
          <h2 className="text-lg font-bold text-[#0F172A] mb-2">Book Session: {session}</h2>
          {booked ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> Session booking submitted! Our trainer will contact you.
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-4">
              <input type="text" required placeholder="Full Name" className="w-full p-3 border rounded-xl text-sm" />
              <input type="text" required placeholder="Phone Number" className="w-full p-3 border rounded-xl text-sm" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setSession('')} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#0F172A] text-white font-bold rounded-xl text-sm shadow">Confirm</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Pakistan Riding Schools Finder Section */}
      <div className="mt-16 border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
          📍 Find Riding Schools Near You
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Explore other popular equestrian clubs and riding academies across Pakistan to start your journey.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {externalSchools.map((school, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-50 px-2 py-1 rounded">
                  {school.location}
                </span>
                <h4 className="text-base font-bold text-[#0F172A] mt-2 mb-1">{school.name}</h4>
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
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0F172A] text-xs font-bold rounded-lg transition"
              >
                Visit Website ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
