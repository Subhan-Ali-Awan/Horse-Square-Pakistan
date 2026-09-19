import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getApiUrl } from '../../config/api';
import {
  PlusCircle,
  Upload,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Dna,
  FileText,
  Lightbulb,
  Award,
  Phone,
  DollarSign,
  MapPin,
  Tag,
  Info,
  CheckSquare,
  ChevronRight,
  Store,
  Gavel,
  Video,
  VolumeX,
  Play,
  Film
} from 'lucide-react';

export const SellHorse = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Enable scroll reveal animations
  useScrollReveal('.reveal-on-scroll');

  const [formData, setFormData] = useState({
    name: '',
    breed: 'Local / Desi',
    age: '',
    color: '',
    height: '',
    location: '',
    price: '',
    sire: '',
    dam: '',
    description: '',
    sellerName: '',
    sellerPhone: '',
  });
  const [listingType, setListingType] = useState('marketplace'); // 'marketplace' or 'auction'
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoError, setVideoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [policyFailures, setPolicyFailures] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setImageFiles(prev => {
        const combined = [...prev, ...selected];
        return combined.slice(0, 3); // Maximum 3 photos limit
      });
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleVideoChange = (e) => {
    setVideoError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check duration <= 20 seconds using in-memory HTML5 Video element
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);

      tempVideo.onloadedmetadata = () => {
        const duration = tempVideo.duration;

        if (duration > 20.5) {
          setVideoError(`Selected video is ${Math.round(duration)} seconds. Maximum allowed duration is 20 seconds (Muted). Please choose or trim a shorter clip.`);
          setVideoFile(null);
          setVideoPreviewUrl('');
          setVideoDuration(0);
          e.target.value = '';
        } else {
          setVideoFile(file);
          setVideoPreviewUrl(objectUrl);
          setVideoDuration(Math.round(duration * 10) / 10);
          setVideoError('');
        }
      };

      tempVideo.onerror = () => {
        // Fallback if metadata isn't readable
        setVideoFile(file);
        setVideoPreviewUrl(objectUrl);
        setVideoDuration(0);
      };

      tempVideo.src = objectUrl;
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoFile(null);
    setVideoPreviewUrl('');
    setVideoDuration(0);
    setVideoError('');
  };

  // Real-time Policy Validation Indicators
  const numPrice = Number(formData.price);
  const isPriceValid = !isNaN(numPrice) && numPrice > 0;

  let heightInches = 0;
  const hMatch = String(formData.height).match(/\d+/);
  if (hMatch) heightInches = parseInt(hMatch[0], 10);
  const isHeightValid = heightInches >= 58 && heightInches <= 66;

  const cleanPhone = String(formData.sellerPhone).replace(/[- ]/g, "");
  const isPhoneValid = /^03\d{9}$/.test(cleanPhone);

  const hasPhoto = imageFiles.length > 0;

  // Calculate live quality completion progress percentage
  const completedChecks = (isHeightValid ? 1 : 0) + (isPhoneValid ? 1 : 0) + (hasPhoto ? 1 : 0);
  const checkProgressPct = Math.round((completedChecks / 3) * 100);

  // Quick Description Suggestions
  const descriptionSuggestions = [
    { label: 'Professional Neza Bazi Horse', text: 'Professional Neza Bazi horse active in tent-pegging tournaments across Pakistan.' },
    { label: 'Pure Nukra Pink Skin', text: 'Elite Nukra bloodline with clear pink skin (phulkari) and elegant posture.' },
    { label: 'Fully Vaccinated', text: 'Fully vaccinated, medically certified by AI Vet, and in prime athletic condition.' },
    { label: 'Calm Temperament', text: 'Extremely calm temperament, safe for riders, and easy to manage.' },
    { label: 'Aggressive Temperament', text: 'High-spirited, energetic, and aggressive temperament, best suited for experienced equestrians.' }
  ];

  const handleAddSuggestion = (text) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description ? `${prev.description} ${text}`.trim() : text
    }));
  };

  const handleGeneratePedigreeDesc = () => {
    let text = '';
    if (formData.sire) text += `Father (Sire): ${formData.sire}. `;
    if (formData.dam) text += `Mother (Dam): ${formData.dam}. `;
    if (text) {
      setFormData(prev => ({
        ...prev,
        description: prev.description ? `${text}${prev.description}` : text
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setPolicyFailures([]);

    if (!token) {
      setError('Please login first to list a horse.');
      return;
    }

    setLoading(true);

    try {
      if (listingType === 'auction') {
        // --- Submit to Live Auctions (/api/auctions) ---
        const data = new FormData();
        data.append('horseName', formData.name);
        data.append('breed', formData.breed);
        data.append('location', formData.location);
        data.append('sellerName', formData.sellerName || 'Verified Seller');
        data.append('startingBid', formData.price);
        data.append('durationHours', '24');
        imageFiles.forEach((file) => {
          data.append('image', file);
          data.append('images', file);
        });

        const res = await fetch(getApiUrl('/api/auctions'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        });

        const resData = await res.json();
        if (resData.success) {
          setMessage('🔨 Success! Your horse has been listed exclusively in LIVE AUCTIONS for active bidding!');
          setTimeout(() => navigate('/auction'), 2000);
        } else {
          setError(resData.message || 'Auction creation failed.');
        }
      } else if (listingType === 'breeding') {
        // --- Submit to Breeding Directory (/api/breeding/horses) ---
        const data = new FormData();
        data.append('name', formData.name);
        data.append('breed', formData.breed);
        data.append('breedingFee', formData.price);
        data.append('price', formData.price);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('tag', formData.description || 'Available for Stud service • Verified Genetics');
        data.append('age', formData.age || '5');
        data.append('sire', formData.sire);
        data.append('dam', formData.dam);
        data.append('ownerPhone', formData.sellerPhone);
        data.append('phone', formData.sellerPhone);
        data.append('ownerName', formData.sellerName || 'Verified Breeder');

        imageFiles.forEach((file) => {
          data.append('images', file);
        });

        const res = await fetch(getApiUrl('/api/breeding/horses'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        });

        const resData = await res.json();
        if (resData.success) {
          setMessage('🐎 Success! Your horse has been published exclusively in the BREEDING DIRECTORY for stud services!');
          setTimeout(() => navigate('/breeding'), 2000);
        } else {
          setError(resData.message || 'Breeding listing creation failed.');
        }
      } else {
        // --- Submit to Marketplace (/api/horses) ---
        const data = new FormData();
        data.append('name', formData.name);
        data.append('breed', formData.breed);
        data.append('price', formData.price);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('age', formData.age);
        data.append('color', formData.color);
        data.append('height', formData.height);
        data.append('sire', formData.sire);
        data.append('dam', formData.dam);
        data.append('phone', formData.sellerPhone);
        data.append('sellerName', formData.sellerName || 'Guest Seller');

        imageFiles.forEach((file) => {
          data.append('images', file);
        });

        if (videoFile) {
          data.append('video', videoFile);
        }

        const res = await fetch(getApiUrl('/api/horses'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        });

        const resData = await res.json();
        if (resData.success) {
          setMessage('🎉 Success! Your horse has been auto-approved & published exclusively in the MARKETPLACE!');
          setTimeout(() => navigate('/marketplace'), 2000);
        } else {
          if (resData.policyFailures && resData.policyFailures.length > 0) {
            setPolicyFailures(resData.policyFailures);
            setError(resData.message || 'Submission failed policy checks.');
          } else {
            setError(resData.message || 'Submission failed.');
          }
        }
      }
    } catch (err) {
      setError('Connection error. Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-up">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" /> Equestrian Listing Studio
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Sell Your Horse
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-light">
            Fill in your horse details below to publish your verified listing on Pakistan's premier equestrian marketplace!
          </p>
        </div>
      </div>

      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start reveal-on-scroll">

        {/* LEFT COLUMN: SIDEBAR WIDGETS & SUGGESTION ASSISTANT (5 COLS - Order last on mobile so main form is top priority) */}
        <div className="lg:col-span-5 space-y-6 order-last lg:order-none">

          {/* WIDGET 1: Real-time Auto-Approval Policy Checklist */}
          <div className="bg-gradient-to-br from-[#0B0F19] via-slate-900 to-[#0F172A] text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#D4AF37]" /> Listing Quality Checks
              </h3>
              <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {completedChecks}/3 Done ({checkProgressPct}%)
              </span>
            </div>

            {/* Quality Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${checkProgressPct}%` }}
              ></div>
            </div>

            <div className="space-y-2.5 text-xs font-semibold pt-1">
              <div className={`flex items-center gap-3 p-3 rounded-2xl border transition duration-200 ${isHeightValid ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isHeightValid ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}>
                  {isHeightValid ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                </div>
                <span>Height: 58 inches - 66 inches</span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-2xl border transition duration-200 ${isPhoneValid ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPhoneValid ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}>
                  {isPhoneValid ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                </div>
                <span>Seller Phone: Valid Mobile Number (03XXXXXXXXX)</span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-2xl border transition duration-200 ${hasPhoto ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${hasPhoto ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}>
                  {hasPhoto ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                </div>
                <span>Media: At least 1 Horse Photo attached</span>
              </div>
            </div>
          </div>

          {/* WIDGET 2: Seller Best Practices & Guidelines */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-4.5 h-4.5 text-[#D4AF37]" /> Tips to Sell 3x Faster
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Upload a bright side-profile photo showing full stance and coat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Enter father (sire) and mother (dam) names for buyer trust.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Keep price competitive within standard Pakistan market rates.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 4: Market Price Valuation Guide */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <DollarSign className="w-4.5 h-4.5 text-emerald-600" /> Market Price Reference
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-700">Nukra / Desi Stallion</span>
                <span className="font-black text-amber-600">Rs. 1.0M - 4.5M</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-700">Thoroughbred Mare</span>
                <span className="font-black text-indigo-600">Rs. 1.5M - 6.0M</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-700">Purebred Arabian</span>
                <span className="font-black text-emerald-600">Rs. 2.0M - 8.5M</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: MAIN FORM BODY (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-2xl border border-slate-200/90 space-y-6 sm:space-y-8">

            {error && (
              <div className="bg-rose-50 text-rose-900 p-4 sm:p-5 rounded-2xl border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" /> {error}
                </div>
                {policyFailures.length > 0 && (
                  <ul className="list-disc pl-8 text-xs text-rose-800 space-y-1 font-semibold">
                    {policyFailures.map((pf, idx) => (
                      <li key={idx}>{pf}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {message && (
              <div className="bg-emerald-50 text-emerald-900 p-4 sm:p-5 rounded-2xl border border-emerald-200 flex items-center gap-3 shadow-sm font-extrabold text-xs sm:text-sm">
                <CheckCircle className="w-6 h-6 shrink-0 text-emerald-600" /> {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

              {/* SELECT LISTING DESTINATION: MARKETPLACE vs LIVE AUCTION */}
              <div className="space-y-3 p-4 sm:p-6 bg-gradient-to-br from-[#0B0F19] via-slate-900 to-[#0F172A] text-white rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#D4AF37]" /> Select Listing Destination
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold border border-amber-500/30">
                    Required Choice
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Option 1: Marketplace Direct Sale */}
                  <button
                    type="button"
                    onClick={() => setListingType('marketplace')}
                    className={`p-4 rounded-2xl border text-left transition duration-300 cursor-pointer ${listingType === 'marketplace'
                      ? 'bg-amber-500/20 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 text-white shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-sm text-white flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-[#D4AF37]" /> Marketplace
                      </span>
                      {listingType === 'marketplace' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Fixed price direct sale. Published **exclusively in Marketplace (`/marketplace`)**.
                    </p>
                  </button>

                  {/* Option 2: Live Auction Listing */}
                  <button
                    type="button"
                    onClick={() => setListingType('auction')}
                    className={`p-4 rounded-2xl border text-left transition duration-300 cursor-pointer ${listingType === 'auction'
                      ? 'bg-amber-500/20 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 text-white shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-sm text-white flex items-center gap-1.5">
                        <Gavel className="w-4 h-4 text-[#D4AF37]" /> Live Auction
                      </span>
                      {listingType === 'auction' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      High-stakes bidding. Published **exclusively in Live Auctions (`/auction`)**.
                    </p>
                  </button>

                  {/* Option 3: Horse For Breeding */}
                  <button
                    type="button"
                    onClick={() => setListingType('breeding')}
                    className={`p-4 rounded-2xl border text-left transition duration-300 cursor-pointer ${listingType === 'breeding'
                      ? 'bg-amber-500/20 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 text-white shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-sm text-white flex items-center gap-1.5">
                        <Dna className="w-4 h-4 text-[#D4AF37]" /> Horse For Breeding
                      </span>
                      {listingType === 'breeding' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Available for stud service. Published **exclusively in Breeding Directory (`/breeding`)**.
                    </p>
                  </button>
                </div>
              </div>

              {/* Section 1: Basic Horse Info */}
              <div className="space-y-5 pt-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-black text-xs shrink-0">
                    1
                  </div>
                  <span>Horse Basic Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Horse Name / Title</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Sufi (Nukra Stallion)"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Breed Category</label>
                    <select
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    >
                      <option value="Local / Desi">Local / Desi (Nukra)</option>
                      <option value="Thoroughbred">Thoroughbred</option>
                      <option value="Arabian">Arabian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                      {listingType === 'breeding'
                        ? 'Stud Booking Fee (PKR)'
                        : listingType === 'auction'
                          ? 'Starting Bid (PKR)'
                          : 'Price (PKR)'}
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="1"
                      placeholder={listingType === 'breeding' ? "e.g. 160000" : listingType === 'auction' ? "e.g. 2500000" : "e.g. 1500000"}
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full p-3.5 border rounded-xl text-sm font-bold transition focus:bg-white focus:outline-none ${formData.price && !isPriceValid
                        ? 'border-rose-400 bg-rose-50 text-rose-900'
                        : 'border-slate-300 bg-slate-50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-slate-900'
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Location / City</label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. Sargodha, Lahore, Sahiwal"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Age (Years)</label>
                    <input
                      type="number"
                      name="age"
                      required
                      placeholder="e.g. 4"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Color / Coat</label>
                    <input
                      type="text"
                      name="color"
                      required
                      placeholder="e.g. Pure White (Pink Skin), Chestnut"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Height */}
              <div className="space-y-5 pt-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-black text-xs shrink-0">
                    2
                  </div>
                  <span>Physical & Seller Contact</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
                  <div className="flex flex-col justify-end">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                      Height (58 - 66 inches)
                    </label>
                    <select
                      name="height"
                      required
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    >
                      <option value="">Select Height (Inches)</option>
                      <option value="58 inches">58 inches</option>
                      <option value="59 inches">59 inches</option>
                      <option value="60 inches">60 inches</option>
                      <option value="61 inches">61 inches</option>
                      <option value="62 inches">62 inches</option>
                      <option value="63 inches">63 inches</option>
                      <option value="64 inches">64 inches</option>
                      <option value="65 inches">65 inches</option>
                      <option value="66 inches">66 inches</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Seller Full Name</label>
                    <input
                      type="text"
                      name="sellerName"
                      required
                      placeholder="e.g. Chaudhary Sajawal"
                      value={formData.sellerName}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                      Seller Phone
                    </label>
                    <input
                      type="text"
                      name="sellerPhone"
                      required
                      placeholder="03001234567"
                      value={formData.sellerPhone}
                      onChange={handleChange}
                      className={`w-full p-3.5 border rounded-xl text-sm font-bold transition focus:bg-white focus:outline-none ${formData.sellerPhone && !isPhoneValid
                        ? 'border-rose-400 bg-rose-50 text-rose-900'
                        : 'border-slate-300 bg-slate-50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-slate-900'
                        }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Pedigree / Parents Info */}
              <div className="space-y-5 pt-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-black text-xs shrink-0">
                    3
                  </div>
                  <span>Pedigree & Lineage (Parents Name)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                      Father Name (Sire)
                    </label>
                    <input
                      type="text"
                      name="sire"
                      placeholder="e.g. Ghulam Murtaza, Shah-Jahan"
                      value={formData.sire}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                      Mother Name (Dam)
                    </label>
                    <input
                      type="text"
                      name="dam"
                      placeholder="e.g. Bella, White Beauty"
                      value={formData.dam}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition"
                    />
                  </div>
                </div>

                {(formData.sire || formData.dam) && (
                  <button
                    type="button"
                    onClick={handleGeneratePedigreeDesc}
                    className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl border border-amber-300 flex items-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Insert Parents Name into Description
                  </button>
                )}
              </div>

              {/* DESCRIPTION ASSISTANT (Smart Suggestions Box) */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Lightbulb className="w-4.5 h-4.5 text-[#D4AF37]" /> DESCRIPTION ASSISTANT
                  </h3>
                  <span className="text-[10px] sm:text-xs text-amber-700 bg-amber-50/90 px-3 py-1 rounded-full font-bold border border-amber-200 shadow-xs">
                    Click to Insert
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                  Tap any performance chip below to append directly into your horse description:
                </p>

                <div className="space-y-2.5 pt-1">
                  {descriptionSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSuggestion(sug.text)}
                      className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-amber-50/90 text-slate-800 hover:text-amber-950 border border-slate-200/80 hover:border-[#D4AF37] rounded-2xl text-xs sm:text-sm font-semibold transition duration-200 cursor-pointer flex items-center justify-between group shadow-xs"
                    >
                      <span className="font-bold text-slate-800 group-hover:text-amber-950">{sug.label}</span>
                      <PlusCircle className="w-4.5 h-4.5 text-[#D4AF37] group-hover:scale-110 transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 4: Full Description */}
              <div className="space-y-5 pt-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-black text-xs shrink-0">
                    4
                  </div>
                  <span>Full Description</span>
                </h3>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Detailed Performance & History</label>
                  <textarea
                    name="description"
                    rows="5"
                    required
                    placeholder="Describe lineage, active dancer status, Nezabazi (tent-pegging) championships, temperament, vaccinations, and health..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-4 border border-slate-300 rounded-2xl bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition leading-relaxed"
                  ></textarea>
                </div>
              </div>

              {/* Section 5: Photo Upload (Max 3 Photos) */}
              <div className="space-y-5 pt-2">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-black text-xs shrink-0">
                      5
                    </div>
                    <span>Horse Photos (Max 3 - Required)</span>
                  </h3>
                  <span className="text-xs font-extrabold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
                    {imageFiles.length} / 3 Selected
                  </span>
                </div>

                {imageFiles.length < 3 && (
                  <div className="border-2 border-dashed border-slate-300 hover:border-[#D4AF37] rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center bg-slate-50/80 hover:bg-amber-50/30 transition duration-300 cursor-pointer relative shadow-inner group">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      required={imageFiles.length === 0}
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto mb-2 sm:mb-3 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition duration-300 shadow-sm">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-black text-slate-800">
                      Click or drag up to 3 horse photos here to upload
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">PNG, JPG, JPEG up to 10MB per file (Maximum 3 photos)</p>
                  </div>
                )}

                {/* Selected Images Grid / Preview */}
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 group shadow-md aspect-square">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Horse photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-2 sm:p-2.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition shadow-xl cursor-pointer"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-slate-950 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/20">
                          Photo #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 6: Video Upload (Max 20s, Muted, Optional) */}
              <div className="space-y-5 pt-2">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-black text-xs shrink-0">
                      6
                    </div>
                    <span>Horse Video Showcase (Optional • Max 20s, Muted)</span>
                  </h3>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    videoFile 
                      ? 'text-emerald-900 bg-emerald-50 border-emerald-300'
                      : 'text-slate-600 bg-slate-100 border-slate-200'
                  }`}>
                    {videoFile ? '1 Video Selected' : 'Optional'}
                  </span>
                </div>

                {videoError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2 animate-fade-up">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{videoError}</span>
                  </div>
                )}

                {!videoFile ? (
                  <div className="border-2 border-dashed border-slate-300 hover:border-[#D4AF37] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center bg-slate-50/80 hover:bg-amber-50/30 transition duration-300 cursor-pointer relative shadow-inner group">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      onChange={handleVideoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto mb-2 sm:mb-3 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition duration-300 shadow-sm">
                      <Film className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-black text-slate-800">
                      Click or drag a horse video here to upload (Max 20 Seconds)
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">
                      MP4, WebM, MOV up to 50MB • Maximum duration: 20s • Plays without audio
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-xl">
                    <video
                      src={videoPreviewUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full max-h-[280px] sm:max-h-[340px] object-contain bg-slate-950 mx-auto"
                    />
                    {/* Video Meta Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-20">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-amber-400/40 text-[10px] font-black tracking-wide flex items-center gap-1 shadow-md">
                        <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {videoDuration > 0 ? `${videoDuration}s / 20s Max` : 'Max 20s'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700 text-[10px] font-black tracking-wide flex items-center gap-1 shadow-md">
                        <VolumeX className="w-3 h-3 text-slate-400" />
                        Muted / No Audio
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-20">
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-lg cursor-pointer"
                        title="Remove Video"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate max-w-[200px] sm:max-w-md font-medium text-slate-300">
                        📁 {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                      <span className="text-emerald-400 font-bold">✓ Ready for listing</span>
                    </div>
                  </div>
                )}
              </div>


              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 sm:py-5 bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8860B] hover:from-[#C9A227] hover:to-[#A67C00] text-slate-950 font-black rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-[0_6px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Publishing Listing...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                    <span>
                      {listingType === 'auction'
                        ? 'Publish to Live Auctions'
                        : listingType === 'breeding'
                          ? 'Publish to Breeding Directory'
                          : 'Publish to Marketplace'}
                    </span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
