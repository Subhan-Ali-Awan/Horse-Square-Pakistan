import React, { useState, useEffect } from 'react';
import { Award, Dna, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
      name: 'Al-Burraq (Champion Stallion)',
      breed: 'Pure Arabian',
      studFee: 150000,
      location: 'Lahore Stud Farm',
      achievements: 'Multiple National Show Champion 2024',
      imageUrl: 'https://images.pexels.com/photos/29632852/pexels-photo-29632852.jpeg'
    },
    {
      id: 'b2',
      name: 'Bucephalus (Thoroughbred Stallion)',
      breed: 'Thoroughbred',
      studFee: 200000,
      location: 'Rawalpindi Club',
      achievements: 'Derby Winner & Speed Record Holder',
      imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'
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
            achievements: h.tag || 'Available for Stud service'
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
          requesterName: user ? user.name : 'Guest User',
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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up">
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white mb-8 shadow-xl gold-gradient-bar">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Dna className="w-8 h-8 text-[#D4AF37]" /> Equine Breeding Services
        </h1>
        <p className="text-slate-300 text-sm mt-1">
          Access verified stud stallions with proven lineage and exceptional genetics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {breedingHorses.map((horse) => (
          <div key={horse.id} className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between">
            <div>
              <img src={horse.imageUrl} alt={horse.name} className="w-full h-60 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#0F172A]">{horse.name}</h3>
                  <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full border border-amber-300">
                    {horse.breed}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" /> {horse.achievements}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Stud Booking Fee:</span>
                  <span className="font-bold text-[#0F172A] text-base">Rs. {horse.studFee.toLocaleString('en-PK')}</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setSelectedHorse(horse)}
                className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-sm transition shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-400" /> Book Breeding Request
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedHorse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-up">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative">
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">Breeding Request for {selectedHorse.name}</h2>
            <p className="text-xs text-slate-500 mb-6">Enter your mare details to request stud service approval.</p>

            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-xl text-center border border-emerald-200">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Request Sent Successfully!</h3>
                <p className="text-xs mt-1">The stud farm owner will contact you shortly.</p>
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
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm"
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
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm"
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHorse(null)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#0F172A] text-white font-bold rounded-xl text-sm shadow"
                  >
                    Confirm Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
