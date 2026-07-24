import React, { useState, useEffect } from 'react';
import { Award, Dna, Send, CheckCircle, ShieldCheck, Sparkles, Stethoscope, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/Modal';

export const Breeding = () => {
  const { user } = useAuth();
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [ownerPhone, setOwnerPhone] = useState(user ? user.phone || '' : '');
  const [mareDetails, setMareDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [breedingHorses, setBreedingHorses] = useState([]);
  const [loading, setLoading] = useState(true);

  const sampleBreedingHorses = [
    {
      id: 'b1',
      name: 'Sufi (Nukra Champion Stallion)',
      breed: 'Local / Desi',
      studFee: 250000,
      location: 'Sargodha Stud Farm',
      achievements: 'Pure White (Pink Skin) • Active Nezabazi & Dancing Champion',
      sire: 'Shah-Jahan',
      dam: 'White Beauty',
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'b2',
      name: 'Al-Burraq (Arabian Champion)',
      breed: 'Arabian',
      studFee: 180000,
      location: 'Lahore Stud Farm',
      achievements: 'Multiple National Show Champion 2024 • Pure Bloodline',
      sire: 'Al-Murtajiz',
      dam: 'Desert Rose',
      imageUrl: 'https://images.pexels.com/photos/29632852/pexels-photo-29632852.jpeg'
    },
    {
      id: 'b3',
      name: 'Bucephalus (Thoroughbred Stallion)',
      breed: 'Thoroughbred',
      studFee: 220000,
      location: 'Rawalpindi Turf Club',
      achievements: 'Derby Winner & Speed Record Holder at Lahore Turf Club',
      sire: 'Storm Cat II',
      dam: 'Lady Pearl',
      imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'b4',
      name: 'Rustam (Desi Stud Stallion)',
      breed: 'Local / Desi',
      studFee: 160000,
      location: 'Multan Stud Farms',
      achievements: 'High Resilient Bloodline • Tent Pegging Specialist',
      sire: 'Ghulam Muhammad',
      dam: 'Bella',
      imageUrl: 'https://images.unsplash.com/photo-1551887196-72e32fad773a?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const fetchBreedingHorses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/breeding/horses');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const formatted = data.data.map(h => ({
            ...h,
            id: h._id,
            studFee: Number(h.breedingFee),
            imageUrl: h.image || 'https://images.pexels.com/photos/29632852/pexels-photo-29632852.jpeg',
            achievements: h.tag || 'Available for Stud service',
            sire: h.sire || 'Verified Sire',
            dam: h.dam || 'Verified Dam'
          }));
          setBreedingHorses(formatted);
        } else {
          setBreedingHorses(sampleBreedingHorses);
        }
      } else {
        setBreedingHorses(sampleBreedingHorses);
      }
    } catch (err) {
      console.error("Failed to fetch breeding horses, using fallback:", err);
      setBreedingHorses(sampleBreedingHorses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreedingHorses();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/breeding/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name : 'Guest User',
          phone: ownerPhone,
          ownHorseName: 'Mare',
          preferredBreed: selectedHorse.breed,
          details: mareDetails,
          breedingHorseId: selectedHorse.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedHorse(null);
          setMareDetails('');
        }, 3000);
      } else {
        alert(data.message || 'Failed to submit breeding request.');
      }
    } catch (err) {
      alert('Network error. Failed to communicate with the breeding server.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up space-y-8">

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden gold-gradient-bar">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Verified Equine Genetics & Studs
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <Dna className="w-8 h-8 text-[#D4AF37]" /> Equine Breeding Services
            </h1>
            <p className="text-slate-300 text-sm font-light max-w-xl">
              Access Pakistan's premier stud stallions with certified pedigree bloodlines, championship trophies, and high fertility rates.
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-right shrink-0 hidden sm:block">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Genetic Verification</span>
            <span className="text-sm font-black text-[#D4AF37]">CNIC & Pedigree Checked</span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: SIDEBAR WIDGETS */}
        <div className="lg:col-span-4 space-y-6">

          {/* WIDGET 1: Stud Lineage Guarantee */}
          <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Certified Stud Lineage
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Every stud stallion listed in our directory is verified for genetic lineage, vaccination logs, and breeder registration across Pakistan.
            </p>
          </div>

          {/* WIDGET 2: Breeding Season Statistics */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b">
              <Award className="w-4.5 h-4.5 text-[#D4AF37]" /> Breeding Season Insights
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-600">Active Stud Bookings</span>
                <span className="font-extrabold text-[#0F172A] text-sm">185+ Matings</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="font-semibold text-emerald-800">Conception Rate</span>
                <span className="font-extrabold text-emerald-700 text-sm">98.4% Success</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="font-semibold text-amber-800">Top Breed Requested</span>
                <span className="font-extrabold text-amber-900 text-xs">Nukra & Arabian</span>
              </div>
            </div>
          </div>

          {/* WIDGET 3: Mare Pre-Breeding Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> Mare Pre-Breeding Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Ensure mare vaccinations & deworming are up-to-date.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Prepare mare lineage details (Sire/Dam) for registration.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Consult AI Vet Doctor for optimal estrus/ovulation timing.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 4: AI Vet Genetic Pairing Assistance */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-3">
            <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block">
              AI VET DOCTOR ASSISTANT
            </span>
            <h4 className="font-extrabold text-sm text-white">Need Genetic Pairing Consultation?</h4>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Use our AI Vet Assistant to analyze bloodline compatibility and health before booking.
            </p>
            <Link
              to="/vet"
              className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-2 mt-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Consult AI Vet Doctor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN: STUD STALLIONS GRID */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {breedingHorses.map((horse) => (
              <div key={horse.id} className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transition duration-300">
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img src={horse.imageUrl} alt={horse.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 left-3 bg-[#0F172A]/90 text-[#D4AF37] border border-amber-500/30 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md shadow">
                      {horse.breed}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-[#0F172A] leading-snug">{horse.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> {horse.achievements}
                      </p>
                    </div>

                    {/* Sire & Dam Info Pill */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Father (Sire)</span>
                        <span className="font-extrabold text-slate-800 truncate block">{horse.sire || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Mother (Dam)</span>
                        <span className="font-extrabold text-slate-800 truncate block">{horse.dam || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 flex justify-between items-center text-xs">
                      <span className="text-amber-900 font-bold">Stud Booking Fee:</span>
                      <span className="font-black text-[#0F172A] text-base">Rs. {horse.studFee.toLocaleString('en-PK')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedHorse(horse)}
                    className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-2xl text-xs transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" /> Book Breeding Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Booking Portal Modal */}
      <Modal
        isOpen={Boolean(selectedHorse)}
        onClose={() => setSelectedHorse(null)}
        title={selectedHorse ? `Breeding Request for ${selectedHorse.name}` : ''}
        maxWidth="max-w-lg"
      >
        {selectedHorse && (
          <div>
            <p className="text-xs text-slate-500 mb-6">Enter your mare details to request stud service approval.</p>

            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl text-center border border-emerald-200 space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-bold text-lg">Request Sent Successfully!</h3>
                <p className="text-xs text-emerald-700 font-medium">The stud farm owner will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Phone Number</label>
                  <input
                    type="text"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full p-3.5 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Mare Details (Breed, Age, Pedigree)</label>
                  <textarea
                    rows="3"
                    required
                    value={mareDetails}
                    onChange={(e) => setMareDetails(e.target.value)}
                    placeholder="Provide details about your mare..."
                    className="w-full p-3.5 border border-slate-300 rounded-xl text-sm"
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHorse(null)}
                    className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-[#0F172A] text-white font-bold rounded-xl text-xs shadow cursor-pointer"
                  >
                    Confirm Request
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
