import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Phone,
  LayoutGrid,
  List,
  Sparkles,
  DollarSign,
  Award,
  Truck,
  Info,
  X,
  MessageSquare,
  TrendingUp,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const Marketplace = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breedFilter, setBreedFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(15000000);
  const [locationFilter, setLocationFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [modalImageIdx, setModalImageIdx] = useState(0);

  const formatImgUrl = (url) => {
    if (!url) return '/uploads/media__1785359752827.jpg';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return url;
    if (url.startsWith('uploads/')) return '/' + url;
    return '/uploads/' + url;
  };

  const rawImages = (selectedHorse?.images && selectedHorse.images.length > 0)
    ? selectedHorse.images
    : [selectedHorse?.imageUrl || selectedHorse?.image || '/uploads/media__1785359752827.jpg'];

  const horseImages = rawImages.map(formatImgUrl);
  const currentImg = horseImages[modalImageIdx] || horseImages[0];
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters/sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [breedFilter, minPriceFilter, maxPriceFilter, locationFilter, searchTerm, sortBy]);



  // Transport Calculator State
  const [transportFrom, setTransportFrom] = useState('');
  const [transportTo, setTransportTo] = useState('');
  const [transportCost, setTransportCost] = useState(null);

  const majorCities = [
    { name: 'Lahore', region: 'Punjab' },
    { name: 'Hafizabad', region: 'Punjab' },
    { name: 'Sargodha', region: 'Punjab' },
    { name: 'Multan', region: 'Punjab' },
    { name: 'Faisalabad', region: 'Punjab' },
    { name: 'Rawalpindi', region: 'Punjab' },
    { name: 'Islamabad', region: 'Capital' },
    { name: 'Karachi', region: 'Sindh' },
    { name: 'Peshawar', region: 'KPK' }
  ];

  // Dynamic Marketplace Horses state initialized from API
  const sampleHorses = [];

  const fetchHorses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/horses?limit=1000');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map(h => ({
            ...h,
            price: Number(h.price),
            age: Number(h.age || 4),
            imageUrl: h.images && h.images.length > 0 ? h.images[0] : (h.imageUrl || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600')
          }));
          setHorses(formatted);
          return;
        }
      }
      setHorses([]);
    } catch (err) {
      console.error("Failed to fetch horses from API:", err);
      setHorses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchHorses();
  };

  // Distance/Rate matrix calculation for Transport Estimator (Doubled rates)
  const calculateTransport = (e) => {
    e.preventDefault();
    if (!transportFrom || !transportTo) return;

    if (transportFrom === transportTo) {
      setTransportCost(12000); // Local delivery doubled from 6000
      return;
    }

    // Distance pricing approximation in PKR (Doubled)
    const rates = {
      Lahore: { Hafizabad: 18000, Karachi: 96000, Islamabad: 36000, Rawalpindi: 36000, Multan: 32000, Sargodha: 20000, Faisalabad: 16000, Peshawar: 44000 },
      Hafizabad: { Lahore: 18000, Sargodha: 16000, Faisalabad: 17000, Islamabad: 32000, Rawalpindi: 32000, Multan: 34000, Karachi: 92000, Peshawar: 42000 },
      Sargodha: { Hafizabad: 16000, Karachi: 90000, Islamabad: 30000, Rawalpindi: 30000, Multan: 28000, Lahore: 20000, Faisalabad: 14000, Peshawar: 38000 },
      Multan: { Hafizabad: 34000, Karachi: 76000, Islamabad: 48000, Rawalpindi: 48000, Sargodha: 28000, Lahore: 32000, Faisalabad: 24000, Peshawar: 56000 },
      Karachi: { Hafizabad: 92000, Lahore: 96000, Islamabad: 116000, Rawalpindi: 116000, Multan: 76000, Sargodha: 90000, Faisalabad: 84000, Peshawar: 128000 }
    };

    const cost = rates[transportFrom]?.[transportTo] || rates[transportTo]?.[transportFrom] || 50000;
    setTransportCost(cost);
  };

  // Sort and filter client side
  const getProcessedListings = () => {
    let list = [...horses];

    // Client-side search & filters fallback when API isn't writing database changes
    if (breedFilter) {
      list = list.filter(h => h.breed.toLowerCase() === breedFilter.toLowerCase());
    }
    if (minPriceFilter > 0) {
      list = list.filter(h => Number(h.price) >= minPriceFilter);
    }
    if (maxPriceFilter < 15000000) {
      list = list.filter(h => Number(h.price) <= maxPriceFilter);
    }
    if (locationFilter) {
      list = list.filter(h => h.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(q) || h.description.toLowerCase().includes(q));
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'age-young') return a.age - b.age;
      if (sortBy === 'age-old') return b.age - a.age;
      return 0; // Default order
    });

    return list;
  };

  const processedHorses = getProcessedListings();
  const itemsPerPage = 6;
  const totalPages = Math.ceil(processedHorses.length / itemsPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedHorses.slice(indexOfFirstItem, indexOfLastItem);

  const rawSpotlight = horses.filter(h => (h.spotlight || Number(h.price) >= 3000000) && Number(h.price) >= 3000000);
  const spotlightHorses = Array.from(
    new Map(rawSpotlight.map(h => [h._id || h.name, h])).values()
  );

  const marqueeItems = spotlightHorses.length > 0
    ? (spotlightHorses.length < 5
      ? [...spotlightHorses, ...spotlightHorses, ...spotlightHorses, ...spotlightHorses]
      : [...spotlightHorses, ...spotlightHorses])
    : [];
  const avgPrice = horses.length > 0 ? Math.round(horses.reduce((sum, h) => sum + h.price, 0) / horses.length) : 0;


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-up">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" /> Premium Horse Trading
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            HorseSquare Marketplace Pakistan
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-light">
            Browse verified listings, review complete pedigree bloodlines, connect with breeders, and coordinate shipping across Pakistan.
          </p>
        </div>
      </div>

      {/* Market Stats dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 rounded-xl text-[#D4AF37] shrink-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Active Listings</p>
            <h4 className="text-sm sm:text-lg font-black text-[#0F172A] truncate">{horses.length} Verified</h4>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-2.5 sm:p-3 bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Avg. Valuation</p>
            <h4 className="text-xs sm:text-base font-black text-[#0F172A] truncate">Rs. {avgPrice.toLocaleString('en-PK')}</h4>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-2.5 sm:p-3 bg-cyan-500/10 rounded-xl text-cyan-600 shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Trades Settled</p>
            <h4 className="text-sm sm:text-lg font-black text-[#0F172A] truncate">2,840+ Deals</h4>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-2.5 sm:p-3 bg-rose-500/10 rounded-xl text-rose-600 shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Top Breed</p>
            <h4 className="text-sm sm:text-lg font-black text-[#0F172A] truncate">Nukra Stallions</h4>
          </div>
        </div>
      </div>

      {/* Spotlight Slider Section */}
      {spotlightHorses.length > 0 && (
        <div className="space-y-4 relative overflow-hidden">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-container {
              display: flex;
              gap: 24px;
              width: max-content;
              animation: marquee 60s linear infinite;
            }
            .animate-marquee-container:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" /> Spotlight Premium Listings
            </h3>
            <span className="text-[10px] text-slate-400 font-light flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Continuously scrolling (pauses on hover)
            </span>
          </div>

          <div className="w-full overflow-hidden pb-4 pt-1">
            {/* Seamless continuous loop without blank spaces */}
            <div className="animate-marquee-container">
              {marqueeItems.map((horse, idx) => (
                <div
                  key={`${horse._id}-${idx}`}
                  onClick={() => setSelectedHorse(horse)}
                  className="w-[220px] xs:w-[280px] sm:w-[340px] bg-[#0F172A] text-white rounded-3xl overflow-hidden border border-amber-500/30 hover:border-amber-500 shadow-lg relative group cursor-pointer transition-all duration-300 shrink-0"
                >
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-950 flex items-center justify-center group">
                    <img
                      src={formatImgUrl(horse.imageUrl || horse.images?.[0])}
                      alt={horse.name}
                      className="absolute inset-0 w-full h-full object-cover object-center blur-md opacity-40 scale-110"
                    />
                    <img
                      src={formatImgUrl(horse.imageUrl || horse.images?.[0])}
                      alt={horse.name}
                      className="relative z-10 max-w-full max-h-full object-contain object-center group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#0F172A] text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow z-20">
                      Spotlight
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-extrabold text-base sm:text-lg group-hover:text-[#D4AF37] transition">{horse.name}</h4>
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>{horse.breed} • {horse.age} yrs</span>
                      <span className="flex items-center gap-1 text-[#D4AF37]"><MapPin className="w-3.5 h-3.5" /> {horse.location}</span>
                    </div>
                    <p className="text-amber-400 font-black text-sm pt-2">
                      Rs. {Number(horse.price).toLocaleString('en-PK')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Filter & Listing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Filter Form & Transport Estimator */}
        <div className="lg:col-span-4 space-y-6">

          {/* Filters Form */}
          <div className="liquid-glass-card p-6 rounded-2xl border border-slate-200/80 shadow-lg">
            <h3 className="text-base font-black text-[#0F172A] mb-4 flex items-center gap-2 pb-2 border-b">
              <Search className="w-5 h-5 text-[#D4AF37]" /> Filter Listings
            </h3>
            <form onSubmit={handleFilterSubmit} className="space-y-4">

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 uppercase">Breed</label>
                <select
                  value={breedFilter}
                  onChange={(e) => setBreedFilter(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-sm font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37] shadow-sm"
                >
                  <option value="">All Breeds</option>
                  <option value="Thoroughbred">Thoroughbred</option>
                  <option value="Arabian">Arabian</option>
                  <option value="Local / Desi">Local / Desi (Nukra)</option>
                </select>
              </div>

              <div className="space-y-3 p-3.5 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-900 uppercase">Price Range (PKR)</label>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-700">Min Price:</span>
                    <span className="font-black text-slate-900">Rs. {Number(minPriceFilter).toLocaleString('en-PK')}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15000000"
                    step="100000"
                    value={minPriceFilter}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxPriceFilter) setMinPriceFilter(val);
                    }}
                    className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-700">Max Price:</span>
                    <span className="font-black text-slate-900">Rs. {Number(maxPriceFilter).toLocaleString('en-PK')}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15000000"
                    step="100000"
                    value={maxPriceFilter}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= minPriceFilter) setMaxPriceFilter(val);
                    }}
                    className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 uppercase">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Lahore, Sargodha"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37] shadow-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 uppercase">Keyword Search</label>
                <input
                  type="text"
                  placeholder="Search name, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37] shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer"
              >
                Apply Filters
              </button>

              {(breedFilter || minPriceFilter > 0 || maxPriceFilter < 15000000 || locationFilter || searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setBreedFilter('');
                    setMinPriceFilter(0);
                    setMaxPriceFilter(15000000);
                    setLocationFilter('');
                    setSearchTerm('');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl transition text-xs"
                >
                  Clear Filters
                </button>
              )}
            </form>
          </div>

          {/* Transport cost estimator */}
          <div className="liquid-glass-card p-6 rounded-2xl border border-slate-200/80 shadow-lg">
            <h3 className="text-base font-black text-[#0F172A] mb-1 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#D4AF37]" /> Shipping Cost Estimator
            </h3>
            <p className="text-xs text-slate-700 font-semibold mb-4 leading-normal">
              Calculate the cost of safe horse trailer transport across cities.
            </p>
            <form onSubmit={calculateTransport} className="space-y-3">
              <select
                value={transportFrom}
                onChange={(e) => setTransportFrom(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37] shadow-sm"
                required
              >
                <option value="">Select Pickup City</option>
                {majorCities.map(c => <option key={c.name} value={c.name}>{c.name} ({c.region})</option>)}
              </select>

              <select
                value={transportTo}
                onChange={(e) => setTransportTo(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37] shadow-sm"
                required
              >
                <option value="">Select Delivery City</option>
                {majorCities.map(c => <option key={c.name} value={c.name}>{c.name} ({c.region})</option>)}
              </select>

              <button
                type="submit"
                className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer"
              >
                Calculate Cost
              </button>
            </form>

            {transportCost !== null && (
              <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center animate-fade-up">
                <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider">Estimated Transport Cost</span>
                <p className="text-base font-black text-[#0F172A] mt-0.5">Rs. {transportCost.toLocaleString('en-PK')}</p>
                <span className="text-[9px] text-slate-500 font-light block mt-1">Includes handler care & safety harness checks.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Sorting, View Toggle & Product List */}
        <div className="lg:col-span-8 space-y-6">

          {/* Header controllers */}
          <div className="liquid-glass-card flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-2xl border border-slate-200/80 shadow-md">
            <div className="text-xs sm:text-sm font-bold text-slate-700">
              Showing <span className="text-[#D4AF37]">{processedHorses.length}</span> verified horses
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="age-young">Age: Young to Old</option>
                <option value="age-old">Age: Old to Young</option>
              </select>

              <div className="flex border rounded-xl overflow-hidden text-slate-400 bg-slate-50 border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition cursor-pointer ${viewMode === 'grid' ? 'bg-[#0F172A] text-[#D4AF37]' : 'hover:bg-slate-100'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition cursor-pointer ${viewMode === 'list' ? 'bg-[#0F172A] text-[#D4AF37]' : 'hover:bg-slate-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* List display */}
          {loading ? (
            <div className="text-center py-16 text-slate-500 font-light">Loading listings...</div>
          ) : processedHorses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-700">No Listings Match Filters</h3>
              <p className="text-slate-400 text-sm mt-1">Try resetting your filters or modifying search keywords.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentItems.map(horse => (
                <div
                  key={horse._id}
                  onClick={() => setSelectedHorse(horse)}
                  className="liquid-glass-card rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col group cursor-pointer relative"
                >
                  <div className="relative h-56 sm:h-60 bg-slate-950 overflow-hidden flex items-center justify-center group">
                    <img
                      src={formatImgUrl(horse.imageUrl || horse.images?.[0])}
                      alt={horse.name}
                      className="absolute inset-0 w-full h-full object-cover object-center blur-md opacity-40 scale-110"
                    />
                    <img
                      src={formatImgUrl(horse.imageUrl || horse.images?.[0])}
                      alt={horse.name}
                      className="relative z-10 max-w-full max-h-full object-contain object-center group-hover:scale-105 transition duration-500"
                    />
                    {Number(horse.price) >= 3000000 && (
                      <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow z-20">
                        Spotlight
                      </span>
                    )}
                    <span className="absolute bottom-4 right-4 bg-[#0F172A]/90 text-[#D4AF37] font-black text-xs px-3 py-1.5 rounded-lg border border-slate-800 shadow-md z-20">
                      Rs. {Number(horse.price).toLocaleString('en-PK')}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-black text-[#0F172A] text-lg leading-tight group-hover:text-[#D4AF37] transition">
                        {horse.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-bold">{horse.breed}</span>
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-bold">{horse.age} yrs</span>
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-bold">{horse.height}</span>
                      </div>
                      <p className="text-slate-800 text-xs mt-3 leading-relaxed line-clamp-2 font-semibold">
                        {horse.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
                      <span className="flex items-center gap-1 text-slate-900 font-extrabold">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {horse.location}
                      </span>
                      <span className="text-[#D4AF37] group-hover:text-[#0F172A] transition">View Details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {currentItems.map(horse => (
                <div
                  key={horse._id}
                  onClick={() => setSelectedHorse(horse)}
                  className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col sm:flex-row gap-5 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#C9A227] opacity-0 group-hover:opacity-100 transition"></div>

                  <div className="w-full sm:w-48 h-48 bg-slate-950 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative group">
                    <img
                      src={formatImgUrl(horse.imageUrl || horse.images?.[0])}
                      alt={horse.name}
                      className="absolute inset-0 w-full h-full object-cover object-center blur-md opacity-40 scale-110"
                    />
                    <img
                      src={formatImgUrl(horse.imageUrl || horse.images?.[0])}
                      alt={horse.name}
                      className="relative z-10 max-w-full max-h-full object-contain object-center group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="font-extrabold text-lg sm:text-xl text-[#0F172A] group-hover:text-[#D4AF37] transition">
                          {horse.name}
                        </h3>
                        <span className="bg-amber-500/10 border border-amber-500/20 text-[#D4AF37] font-black text-sm px-3.5 py-1.5 rounded-xl shadow-sm">
                          Rs. {Number(horse.price).toLocaleString('en-PK')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-[11px] sm:text-xs text-slate-900 bg-slate-100/90 p-2.5 rounded-lg border border-slate-200">
                        <p><strong className="text-slate-900 font-black">Breed:</strong> <span className="text-slate-900 font-bold">{horse.breed}</span></p>
                        <p><strong className="text-slate-900 font-black">Age:</strong> <span className="text-slate-900 font-bold">{horse.age} yrs</span></p>
                        <p><strong className="text-slate-900 font-black">Height:</strong> <span className="text-slate-900 font-bold">{horse.height}</span></p>
                        <p><strong className="text-slate-900 font-black">Color:</strong> <span className="text-slate-900 font-bold">{horse.color}</span></p>
                      </div>

                      <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-2">
                        {horse.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs font-bold mt-3">
                      <span className="flex items-center gap-1 text-slate-900 font-extrabold">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {horse.location}
                      </span>
                      <span className="text-[#D4AF37] group-hover:text-[#0F172A] transition">View Details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="px-4 py-2 border rounded-xl text-xs font-bold bg-white text-slate-700 hover:border-[#D4AF37] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${activePage === pageNum
                    ? 'bg-[#0F172A] text-[#D4AF37] border border-amber-500/30 shadow'
                    : 'bg-white border text-slate-700 hover:border-[#D4AF37]'
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
                className="px-4 py-2 border rounded-xl text-xs font-bold bg-white text-slate-700 hover:border-[#D4AF37] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

      <Modal
        isOpen={Boolean(selectedHorse)}
        onClose={() => {
          setSelectedHorse(null);
          setModalImageIdx(0);
        }}
        maxWidth="max-w-2xl"
      >
        {selectedHorse && (
          <div className="-m-3.5 sm:-m-6 flex flex-col h-[90vh] sm:h-[85vh] max-h-[90vh] sm:max-h-[85vh] overflow-hidden">
            {/* Modal Image Header - Multi-Photo Gallery Carousel */}
            <div className="relative h-28 xs:h-36 sm:h-72 md:h-80 bg-slate-950 shrink-0 overflow-hidden flex items-center justify-center group">
              {/* Close Button Top-Right */}
              <button
                type="button"
                onClick={() => {
                  setSelectedHorse(null);
                  setModalImageIdx(0);
                }}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950/80 hover:bg-rose-600 text-white flex items-center justify-center z-40 border border-slate-700 shadow-xl cursor-pointer"
                title="Close Modal"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Ambient background blur */}
              <img
                src={currentImg}
                alt={selectedHorse.name}
                className="absolute inset-0 w-full h-full object-cover object-center blur-lg opacity-40 scale-110 transition-all duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = '/uploads/media__1785359752827.jpg'; }}
              />
              {/* Centered primary horse photo */}
              <img
                src={currentImg}
                alt={`${selectedHorse.name} photo ${modalImageIdx + 1}`}
                className="relative z-10 max-w-full max-h-full object-contain object-center transition-all duration-300"
                onError={(e) => { e.target.onerror = null; e.target.src = '/uploads/media__1785359752827.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-20 pointer-events-none"></div>

              {/* Multi-Photo Carousel Controls (Shown if > 1 image) */}
              {horseImages.length > 1 && (
                <>
                  {/* Left Arrow (Previous Photo) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIdx(prev => (prev === 0 ? horseImages.length - 1 : prev - 1));
                    }}
                    className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-[#D4AF37] text-white hover:text-slate-950 transition border border-slate-700 flex items-center justify-center z-30 shadow-xl cursor-pointer"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>

                  {/* Right Arrow (Next Photo) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIdx(prev => (prev === horseImages.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-[#D4AF37] text-white hover:text-slate-950 transition border border-slate-700 flex items-center justify-center z-30 shadow-xl cursor-pointer"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>

                  {/* Photo Counter Badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-slate-950/90 text-[#D4AF37] text-[9px] sm:text-xs font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-500/30 z-30 shadow">
                    📷 {modalImageIdx + 1}/{horseImages.length}
                  </div>
                </>
              )}

              <div className="absolute bottom-2 sm:bottom-6 left-2 sm:left-6 right-2 sm:right-6 text-white flex justify-between items-end z-30">
                <div>
                  <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-[#D4AF37] text-slate-900 rounded text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shadow">
                    {selectedHorse.breed}
                  </span>
                  <h2 className="text-sm sm:text-2xl font-black mt-0.5 sm:mt-2 leading-tight drop-shadow-md">
                    {selectedHorse.name}
                  </h2>
                </div>
                <span className="bg-[#D4AF37] text-slate-950 font-black text-[10px] sm:text-base px-2 py-0.5 sm:px-4 sm:py-2 rounded sm:rounded-xl shadow-lg border border-amber-500/30">
                  Rs. {Number(selectedHorse.price).toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* Modal Info Content - Internal scrolling only */}
            <div className="p-2.5 sm:p-6 space-y-3 sm:space-y-6 text-xs sm:text-sm overflow-y-auto flex-1 custom-scrollbar min-h-0 bg-white">

              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-4 p-2 sm:p-4 bg-slate-50 border rounded-lg sm:rounded-2xl text-center sm:text-left">
                <div>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase font-bold block">Breed</span>
                  <p className="font-bold text-slate-800 text-[10px] sm:text-sm truncate">{selectedHorse.breed}</p>
                </div>
                <div>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase font-bold block">Age</span>
                  <p className="font-bold text-slate-800 text-[10px] sm:text-sm truncate">{selectedHorse.age} yrs</p>
                </div>
                <div>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase font-bold block">Height</span>
                  <p className="font-bold text-slate-800 text-[10px] sm:text-sm truncate">{selectedHorse.height}</p>
                </div>
                <div>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase font-bold block">Color</span>
                  <p className="font-bold text-slate-800 text-[10px] sm:text-sm truncate">{selectedHorse.color}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-0.5">
                <h4 className="text-[9px] sm:text-xs uppercase font-extrabold text-slate-700 tracking-wider">Description</h4>
                <p className="text-slate-600 font-light leading-relaxed text-[11px] sm:text-sm">
                  {selectedHorse.description}
                </p>
              </div>

              {/* Pedigree & Health status grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-6">

                {/* Health & Training */}
                <div className="space-y-1.5 sm:space-y-3 p-2.5 sm:p-4 bg-slate-50/50 rounded-lg sm:rounded-2xl border">
                  <h4 className="text-[9px] sm:text-xs uppercase font-extrabold text-slate-700 tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" /> Health & Performance
                  </h4>
                  <ul className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs">
                    <li className="flex justify-between">
                      <span className="text-slate-400">Temperament:</span>
                      <span className="font-bold text-slate-700">{selectedHorse.temperament || '8/10'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-400">Vaccine Logs:</span>
                      <span className="font-bold text-emerald-600">{selectedHorse.healthStatus || 'Verified'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-400">Training:</span>
                      <span className="font-bold text-slate-700">{selectedHorse.training || 'Basic Trained'}</span>
                    </li>
                  </ul>
                </div>

                {/* Lineage */}
                <div className="space-y-1.5 sm:space-y-3 p-2.5 sm:p-4 bg-slate-50/50 rounded-lg sm:rounded-2xl border">
                  <h4 className="text-[9px] sm:text-xs uppercase font-extrabold text-slate-700 tracking-wider flex items-center gap-1">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[#D4AF37]" /> Bloodline / Pedigree
                  </h4>
                  <ul className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs">
                    <li className="flex justify-between">
                      <span className="text-slate-400">Sire (Father):</span>
                      <span className="font-bold text-slate-700">{selectedHorse.sire || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-400">Dam (Mother):</span>
                      <span className="font-bold text-slate-700">{selectedHorse.dam || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-400">Lineage:</span>
                      <span className="font-bold text-emerald-600">Purebred</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

            {/* Sticky contact footer - Fixed at bottom */}
            <div className="p-2.5 sm:p-4 bg-slate-900 text-white flex flex-row justify-between items-center gap-2 shrink-0 border-t border-slate-800">
              <div className="min-w-0 flex-1">
                <span className="text-[8px] sm:text-[10px] text-amber-400 uppercase font-bold tracking-wider truncate block">{selectedHorse.sellerType || 'Seller'}</span>
                <h4 className="font-bold text-xs sm:text-base leading-tight truncate">{selectedHorse.sellerName || 'Verified Breeder'}</h4>
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-light mt-0.5 leading-none truncate">
                  <span className="text-amber-400 font-bold">{selectedHorse.sellerRating || '4.8'}★</span> | Verified
                </p>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <a
                  href={`tel:${selectedHorse.sellerPhone}`}
                  className="inline-flex items-center justify-center gap-1 bg-[#D4AF37] hover:bg-[#C9A227] text-slate-950 font-bold px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs transition shadow"
                >
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/${selectedHorse.sellerPhone?.replace(/[+ -]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs transition shadow"
                >
                  <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> WhatsApp
                </a>
              </div>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};
