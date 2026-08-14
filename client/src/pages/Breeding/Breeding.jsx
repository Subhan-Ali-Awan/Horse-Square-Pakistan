import React, { useState, useEffect } from 'react';
import { Award, Dna, Send, CheckCircle, ShieldCheck, Sparkles, Stethoscope, CheckCircle2, Info, ArrowRight, Phone, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Modal } from '../../components/Modal';
import { getApiUrl } from '../../config/api';

export const Breeding = () => {
  const { user } = useAuth();

  // Enable scroll reveal animations
  useScrollReveal('.reveal-on-scroll');
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [ownerName, setOwnerName] = useState(user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '' : '');
  const [cnic, setCnic] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [mareName, setMareName] = useState('');
  const [mareBreed, setMareBreed] = useState('');
  const [mareAge, setMareAge] = useState('');
  const [marePedigree, setMarePedigree] = useState('');
  const [mareDetails, setMareDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [breedingHorses, setBreedingHorses] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatImgUrl = (url) => {
    if (!url) return '/uploads/media__1785445045636.jpg';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return url;
    if (url.startsWith('uploads/')) return '/' + url;
    return '/uploads/' + url;
  };

  // Dynamic Breeding Horses state initialized from API
  const sampleBreedingHorses = [];

  const fetchBreedingHorses = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/breeding/horses'));
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map(h => ({
            ...h,
            id: h._id,
            studFee: Number(h.breedingFee),
            imageUrl: formatImgUrl(h.image),
            achievements: h.tag || 'Available for Stud service',
            sire: h.sire || 'Verified Sire',
            dam: h.dam || 'Verified Dam'
          }));
          setBreedingHorses(formatted);
          return;
        }
      }
      setBreedingHorses([]);
    } catch (err) {
      console.error("Failed to fetch breeding horses from API:", err);
      setBreedingHorses([]);
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
      const detailsCombined = `Owner: ${ownerName} | CNIC: ${cnic} | Mare: ${mareName || 'Mare'} | Breed: ${mareBreed || selectedHorse?.breed || 'N/A'} | Age: ${mareAge || 'N/A'} Yrs | Pedigree: ${marePedigree || 'N/A'} | Notes: ${mareDetails || 'None'}`;
      const res = await fetch(getApiUrl('/api/breeding/requests'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterName: ownerName || (user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name : 'Guest User'),
          phone: ownerPhone,
          ownHorseName: mareName || 'Mare',
          preferredBreed: mareBreed || selectedHorse?.breed || 'Local / Desi',
          details: detailsCombined,
          breedingHorseId: selectedHorse?.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedHorse(null);
          setOwnerName('');
          setCnic('');
          setOwnerPhone('');
          setMareName('');
          setMareBreed('');
          setMareAge('');
          setMarePedigree('');
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-up">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" /> Verified Equine Genetics & Stud Directory
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Equine Breeding Services
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-light">
            Access Pakistan's premier stud stallions with certified pedigree bloodlines, championship trophies, and verified fertility rates.
          </p>
        </div>
      </div>

      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

        {/* LEFT COLUMN: SIDEBAR WIDGETS (4 COLS - Order last on mobile so stud stallion cards are top priority) */}
        <div className="lg:col-span-4 space-y-6 order-last lg:order-none">

          {/* WIDGET 1: Stud Lineage Guarantee */}
          <div className="bg-gradient-to-br from-[#0B0F19] via-slate-900 to-[#0F172A] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#D4AF37]" /> Certified Stud Lineage
              </h3>
              <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Every stud stallion listed in our directory is verified for genetic lineage, vaccination logs, and breeder registration across Pakistan.
            </p>
          </div>

          {/* WIDGET: Verified Stud Fee Range Guidelines */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md space-y-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="w-4 h-4 text-[#D4AF37]" /> Official Stud Fee Guidelines
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70">
                <span className="font-bold text-amber-900">Local / Desi Stud Fee</span>
                <span className="font-black text-amber-950">Rs. 50k – 250k</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-purple-50/80 border border-purple-200/70">
                <span className="font-bold text-purple-900">Arabian Stud Fee</span>
                <span className="font-black text-purple-950">Rs. 180k – 500k</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/70">
                <span className="font-bold text-blue-900">Thoroughbred Stud Fee</span>
                <span className="font-black text-blue-950">Rs. 150k – 400k</span>
              </div>
            </div>
          </div>

          {/* WIDGET 2: Breeding Season Insights */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-4.5 h-4.5 text-[#D4AF37]" /> Breeding Season Insights
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-600">Active Stud Bookings</span>
                <span className="font-black text-[#0F172A] text-xs sm:text-sm">185+ Matings</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl sm:rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="font-bold text-emerald-800">Conception Rate</span>
                <span className="font-black text-emerald-700 text-xs sm:text-sm">98.4% Success</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="font-bold text-amber-800">Top Breed Requested</span>
                <span className="font-black text-amber-900 text-xs">Nukra & Arabian</span>
              </div>
            </div>
          </div>

          {/* WIDGET 3: Mare Pre-Breeding Checklist */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> Mare Pre-Breeding Checklist
            </h3>

            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Ensure mare vaccinations & deworming are up-to-date.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Prepare mare lineage details (Sire/Dam) for registration.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Consult AI Vet Doctor for optimal estrus/ovulation timing.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 4: AI Vet Genetic Pairing CTA */}
          <div className="bg-gradient-to-br from-[#0B0F19] via-slate-900 to-[#0F172A] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
            <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block">
              AI VET DOCTOR ASSISTANT
            </span>
            <h4 className="font-black text-sm sm:text-base text-white">Need Genetic Pairing Consultation?</h4>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Use our AI Vet Assistant to analyze bloodline compatibility and health before booking.
            </p>
            <Link
              to="/vet"
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8860B] hover:from-[#C9A227] text-slate-950 font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-slate-950" />
              <span>Consult AI Vet Doctor</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN: STUD STALLIONS GRID (8 COLS) */}
        <div className="lg:col-span-8 space-y-6 reveal-on-scroll">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-bold">Loading breeding stud directory...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {breedingHorses.map((horse) => {
                const mainImg = formatImgUrl(horse.imageUrl);
                return (
                  <div
                    key={horse.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden hover:border-[#D4AF37] transition duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-950">
                        <img
                          src={mainImg}
                          alt={horse.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/uploads/pasha_1.jpg'; }}
                        />
                        <span className="absolute top-3 left-3 bg-[#D4AF37] text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-lg sm:rounded-xl shadow">
                          {horse.breed || 'Verified Breed'}
                        </span>
                        <span className="absolute top-3 right-3 bg-slate-950 text-emerald-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg sm:rounded-xl border border-emerald-500/30">
                          Verified Stud
                        </span>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-[#0F172A] leading-snug line-clamp-1">{horse.name}</h3>
                          <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> {horse.achievements}
                          </p>
                        </div>

                        {/* Sire & Dam Pedigree Pill */}
                        <div className="grid grid-cols-2 gap-2 text-xs p-2.5 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                          <div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block">Father (Sire)</span>
                            <span className="font-extrabold text-slate-800 text-xs truncate block">{horse.sire || 'Verified Sire'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block">Mother (Dam)</span>
                            <span className="font-extrabold text-slate-800 text-xs truncate block">{horse.dam || 'Verified Dam'}</span>
                          </div>
                        </div>

                        {/* Stud Booking Fee Banner */}
                        <div className="bg-gradient-to-r from-slate-900 to-[#0F172A] text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 flex justify-between items-center shadow-inner">
                          <div>
                            <p className="text-[9px] sm:text-[10px] font-bold text-amber-300 uppercase tracking-wider">Stud Booking Fee</p>
                            <p className="text-lg sm:text-xl font-black text-[#D4AF37] mt-0.5">
                              Rs. {Number(horse.studFee).toLocaleString('en-PK')}
                            </p>
                          </div>
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 font-bold text-xs">
                            PKR
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Request Action */}
                    <div className="p-4 sm:p-6 pt-0 mt-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedHorse(horse)}
                        className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8860B] hover:from-[#C9A227] text-slate-950 font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                        <span>Book Breeding Request</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
            <p className="text-xs text-slate-500 mb-6 font-medium">Enter your mare details below to submit your stud service request.</p>

            {submitted ? (
              <div className="bg-emerald-50 text-emerald-900 p-6 rounded-2xl text-center border border-emerald-200 space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-extrabold text-lg">Request Sent Successfully!</h3>
                <p className="text-xs text-emerald-700 font-medium">The stud farm owner will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-4">
                {/* Owner Full Name & CNIC Number Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Owner Full Name */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Owner Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chaudhary Sajawal"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                    />
                  </div>

                  {/* CNIC Number */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      CNIC Number (13-Digit)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="35202-1234567-1"
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                    />
                  </div>
                </div>

                {/* Your Phone Number */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Phone Number (11-Digit Pak)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 03001234567"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                  />
                </div>

                {/* Mare Name / Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Mare Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pari (Nukra Mare)"
                    value={mareName}
                    onChange={(e) => setMareName(e.target.value)}
                    className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                  />
                </div>

                {/* 2-Column Grid for Breed & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mare Breed */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Mare Breed Category
                    </label>
                    <select
                      required
                      value={mareBreed}
                      onChange={(e) => setMareBreed(e.target.value)}
                      className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                    >
                      <option value="">Select Breed</option>
                      <option value="Local / Desi">Local / Desi (Nukra)</option>
                      <option value="Thoroughbred">Thoroughbred</option>
                      <option value="Arabian">Arabian</option>
                    </select>
                  </div>

                  {/* Mare Age */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Mare Age (Years)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="30"
                      placeholder="e.g. 4"
                      value={mareAge}
                      onChange={(e) => setMareAge(e.target.value)}
                      className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                    />
                  </div>
                </div>

                {/* Mare Pedigree / Lineage */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Mare Pedigree / Lineage (Sire & Dam)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sire: Shah-Jahan, Dam: Pink Rose"
                    value={marePedigree}
                    onChange={(e) => setMarePedigree(e.target.value)}
                    className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                  />
                </div>

                {/* Additional Notes / Health Logs */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Additional Notes & Health Logs
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Dewormed, fully vaccinated, ready for estrus mating..."
                    value={mareDetails}
                    onChange={(e) => setMareDetails(e.target.value)}
                    className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHorse(null)}
                    className="w-full sm:flex-1 py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3.5 sm:py-4 bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8860B] hover:from-[#C9A227] text-slate-950 font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer"
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
