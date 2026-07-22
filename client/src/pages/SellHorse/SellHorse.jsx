import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle,
  Upload,
  CheckCircle,
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
  CheckSquare
} from 'lucide-react';

export const SellHorse = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    breed: 'Local / Desi',
    age: '',
    color: '',
    height: '62 inches',
    location: '',
    price: '',
    sire: '',
    dam: '',
    description: '',
    sellerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '' : '',
    sellerPhone: user ? user.phone || '' : '',
  });
  const [listingType, setListingType] = useState('marketplace'); // 'marketplace' or 'auction'
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [policyFailures, setPolicyFailures] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Real-time Policy Validation Indicators
  const numPrice = Number(formData.price);
  const isPriceValid = !isNaN(numPrice) && numPrice >= 700000 && numPrice <= 17500000;
  
  let heightInches = 0;
  const hMatch = String(formData.height).match(/\d+/);
  if (hMatch) heightInches = parseInt(hMatch[0], 10);
  const isHeightValid = heightInches >= 58 && heightInches <= 66;

  const cleanPhone = String(formData.sellerPhone).replace(/[- ]/g, "");
  const isPhoneValid = /^03\d{9}$/.test(cleanPhone);

  const hasPhoto = Boolean(imageFile);

  // Quick Description Suggestions
  const descriptionSuggestions = [
    { label: '🏆 Nezabazi Champion', text: 'Active champion in Nezabazi (tent-pegging) tournaments across Punjab.' },
    { label: '💃 Professional Dancer', text: 'Trained dance horse for traditional equestrian celebrations and events.' },
    { label: '🧬 Pure Nukra Pink Skin', text: 'Elite Nukra bloodline with clear pink skin (phulkari) and elegant posture.' },
    { label: '💉 Fully Vaccinated', text: 'Fully vaccinated, medically certified by AI Vet, and in prime athletic condition.' },
    { label: '🛡️ Calm Temperament', text: 'Extremely calm temperament, safe for riders, and easy to manage.' }
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
        if (imageFile) {
          data.append('image', imageFile);
          data.append('images', imageFile);
        }

        const res = await fetch('/api/auctions', {
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
        
        if (imageFile) {
          data.append('images', imageFile);
        }

        const res = await fetch('/api/horses', {
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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up space-y-8">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden gold-gradient-bar">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Auto-Approval Marketplace
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Sell Your Horse
            </h1>
            <p className="text-slate-300 text-sm font-light max-w-xl">
              Fill in your horse details below. Listings meeting all platform policy bounds are **instantly auto-approved** and published immediately!
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-right shrink-0 hidden sm:block">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Allowed Price Bounds</span>
            <span className="text-sm font-black text-[#D4AF37]">Rs. 700k - 17.5M PKR</span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: SIDEBAR WIDGETS & SUGGESTION ASSISTANT */}
        <div className="lg:col-span-5 space-y-6">

          {/* WIDGET 1: Real-time Auto-Approval Policy Checklist */}
          <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Platform Auto-Approval Policy
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Live Checks
              </span>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                {isPriceValid ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <X className="w-4 h-4 text-slate-500 shrink-0" />}
                <span className={isPriceValid ? 'text-emerald-300' : 'text-slate-400'}>
                  Price: Rs. 700,000 - 17,500,000 PKR
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                {isHeightValid ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <X className="w-4 h-4 text-slate-500 shrink-0" />}
                <span className={isHeightValid ? 'text-emerald-300' : 'text-slate-400'}>
                  Height: 58 inches - 66 inches
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                {isPhoneValid ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <X className="w-4 h-4 text-slate-500 shrink-0" />}
                <span className={isPhoneValid ? 'text-emerald-300' : 'text-slate-400'}>
                  Seller Phone: 11-Digit Pak Mobile (03XXXXXXXXX)
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                {hasPhoto ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <X className="w-4 h-4 text-slate-500 shrink-0" />}
                <span className={hasPhoto ? 'text-emerald-300' : 'text-slate-400'}>
                  Media: At least 1 Horse Photo attached
                </span>
              </div>
            </div>
          </div>

          {/* WIDGET 2: Description Smart Suggestions Box (Moved to Left Side!) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Lightbulb className="w-4.5 h-4.5 text-amber-500" /> Description Assistant
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">Click to Insert</span>
            </div>
            
            <p className="text-xs text-slate-500 font-normal">
              Tap any of the important performance or pedigree chips below to append them directly into your horse description:
            </p>

            <div className="space-y-2 pt-1">
              {descriptionSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSuggestion(sug.text)}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-amber-50/80 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-2xl text-xs font-semibold transition cursor-pointer flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{sug.label}</span>
                  </div>
                  <PlusCircle className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* WIDGET 3: Seller Best Practices & Guidelines */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b">
              <Award className="w-4.5 h-4.5 text-[#D4AF37]" /> Tips to Sell 3x Faster
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Upload a bright side-profile photo showing full stance and coat.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Enter father (sire) and mother (dam) names for buyer trust.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Keep price competitive within standard Pakistan market rates.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 4: Market Price Valuation Guide */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b">
              <DollarSign className="w-4.5 h-4.5 text-emerald-600" /> Market Price Reference
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                <span className="font-semibold text-slate-700">Nukra / Desi Stallion</span>
                <span className="font-extrabold text-amber-600">Rs. 1.0M - 4.5M</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                <span className="font-semibold text-slate-700">Thoroughbred Mare</span>
                <span className="font-extrabold text-indigo-600">Rs. 1.5M - 6.0M</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                <span className="font-semibold text-slate-700">Purebred Arabian</span>
                <span className="font-extrabold text-emerald-600">Rs. 2.0M - 8.5M</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: MAIN FORM BODY */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-8">

            {error && (
              <div className="bg-rose-50 text-rose-800 p-5 rounded-2xl border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" /> {error}
                </div>
                {policyFailures.length > 0 && (
                  <ul className="list-disc pl-8 text-xs text-rose-700 space-y-1 font-medium">
                    {policyFailures.map((pf, idx) => (
                      <li key={idx}>{pf}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {message && (
              <div className="bg-emerald-50 text-emerald-900 p-5 rounded-2xl border border-emerald-200 flex items-center gap-3 shadow-sm font-bold text-sm">
                <CheckCircle className="w-6 h-6 shrink-0 text-emerald-600" /> {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* SELECT LISTING DESTINATION: MARKETPLACE vs LIVE AUCTION */}
              <div className="space-y-3 p-5 bg-gradient-to-r from-slate-900 to-[#1E293B] text-white rounded-3xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" /> Select Listing Destination
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded font-bold border border-amber-500/30">
                    Required Choice
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option 1: Marketplace Direct Sale */}
                  <button
                    type="button"
                    onClick={() => setListingType('marketplace')}
                    className={`p-4 rounded-2xl border text-left transition duration-200 cursor-pointer ${
                      listingType === 'marketplace'
                        ? 'bg-amber-500/20 border-[#D4AF37] ring-2 ring-amber-500/40 text-white'
                        : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-white flex items-center gap-2">
                        🛒 Marketplace Listing
                      </span>
                      {listingType === 'marketplace' && <CheckCircle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Fixed price direct sale. Published **exclusively in the Marketplace (`/marketplace`)**.
                    </p>
                  </button>

                  {/* Option 2: Live Auction Listing */}
                  <button
                    type="button"
                    onClick={() => setListingType('auction')}
                    className={`p-4 rounded-2xl border text-left transition duration-200 cursor-pointer ${
                      listingType === 'auction'
                        ? 'bg-amber-500/20 border-[#D4AF37] ring-2 ring-amber-500/40 text-white'
                        : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-white flex items-center gap-2">
                        🔨 Live Auction Listing
                      </span>
                      {listingType === 'auction' && <CheckCircle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      High-stakes bidding. Published **exclusively in Live Auctions (`/auction`)**.
                    </p>
                  </button>
                </div>
              </div>

              {/* Section 1: Basic Horse Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D4AF37]" /> 1. Horse Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Horse Name / Title</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Sufi (Nukra Stallion)"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Breed Category</label>
                    <select
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition font-semibold"
                    >
                      <option value="Local / Desi">Local / Desi (Nukra)</option>
                      <option value="Thoroughbred">Thoroughbred</option>
                      <option value="Arabian">Arabian</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Price (PKR 700,000 - 17,500,000)
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="700000"
                      max="17500000"
                      placeholder="e.g. 1500000"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full p-3.5 border rounded-xl text-sm transition focus:bg-white ${
                        formData.price && !isPriceValid ? 'border-rose-400 bg-rose-50 text-rose-900' : 'border-slate-300 bg-slate-50 focus:border-[#D4AF37]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Location / City</label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. Sargodha, Lahore, Sahiwal"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Age (Years)</label>
                    <input
                      type="number"
                      name="age"
                      required
                      placeholder="e.g. 4"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Color / Coat</label>
                    <input
                      type="text"
                      name="color"
                      required
                      placeholder="e.g. Pure White (Pink Skin), Chestnut"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Height */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4AF37]" /> 2. Physical & Seller Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Height (58 - 66 inches)
                    </label>
                    <select
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition font-semibold"
                    >
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

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Seller Full Name</label>
                    <input
                      type="text"
                      name="sellerName"
                      required
                      placeholder="e.g. Chaudhary Sajawal"
                      value={formData.sellerName}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Seller Phone (11-Digit Pak)
                    </label>
                    <input
                      type="text"
                      name="sellerPhone"
                      required
                      placeholder="03001234567"
                      value={formData.sellerPhone}
                      onChange={handleChange}
                      className={`w-full p-3.5 border rounded-xl text-sm transition focus:bg-white ${
                        formData.sellerPhone && !isPhoneValid ? 'border-rose-400 bg-rose-50 text-rose-900' : 'border-slate-300 bg-slate-50 focus:border-[#D4AF37]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Pedigree / Parents Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-2 flex items-center gap-2">
                  <Dna className="w-4 h-4 text-[#D4AF37]" /> 3. Pedigree & Lineage (Parents Name)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Father Name (Sire)
                    </label>
                    <input
                      type="text"
                      name="sire"
                      placeholder="e.g. Ghulam Murtaza, Shah-Jahan"
                      value={formData.sire}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Mother Name (Dam)
                    </label>
                    <input
                      type="text"
                      name="dam"
                      placeholder="e.g. Bella, White Beauty"
                      value={formData.dam}
                      onChange={handleChange}
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
                    />
                  </div>
                </div>

                {(formData.sire || formData.dam) && (
                  <button
                    type="button"
                    onClick={handleGeneratePedigreeDesc}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Insert Parents Name into Description
                  </button>
                )}
              </div>

              {/* Section 4: Full Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D4AF37]" /> 4. Full Description
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Detailed Performance & History</label>
                  <textarea
                    name="description"
                    rows="5"
                    required
                    placeholder="Describe lineage, active dancer status, Nezabazi (tent-pegging) championships, temperament, vaccinations, and health..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-4 border border-slate-300 rounded-2xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
                  ></textarea>
                </div>
              </div>

              {/* Section 5: Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] border-b pb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#D4AF37]" /> 5. Horse Photo (Required)
                </h3>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition cursor-pointer relative shadow-inner">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-10 h-10 text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-sm font-extrabold text-slate-800">
                    {imageFile ? `Selected File: ${imageFile.name}` : 'Click or drag horse photo here to upload'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] hover:to-[#B8860B] text-slate-950 font-black rounded-2xl text-base shadow-xl hover:shadow-2xl transition duration-300 cursor-pointer flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <span>Publishing Listing to {listingType === 'auction' ? 'Live Auctions' : 'Marketplace'}...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-slate-950" />
                    <span>
                      {listingType === 'auction'
                        ? 'Publish to Live Auctions (/auction)'
                        : 'Publish to Marketplace (/marketplace)'}
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
