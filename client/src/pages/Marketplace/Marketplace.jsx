import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Dna,
  CheckCircle2,
  Calculator,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const Marketplace = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breedFilter, setBreedFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(5000000);
  const [locationFilter, setLocationFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [modalImageIdx, setModalImageIdx] = useState(0);

  // Pagination State (6 listings per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // City-to-City Transport Calculator State
  const [originCity, setOriginCity] = useState('Lahore');
  const [destinationCity, setDestinationCity] = useState('Islamabad');
  const [vehicleType, setVehicleType] = useState('single'); // 'single' or 'truck'

  const citiesList = [
    'Lahore', 'Islamabad', 'Rawalpindi', 'Karachi', 'Peshawar',
    'Quetta', 'Multan', 'Faisalabad', 'Sargodha', 'Sialkot',
    'Hafizabad', 'Gujranwala', 'Bahawalpur', 'Sahiwal'
  ];

  // Estimated distances (km) between major Pakistani hubs
  const getDistance = (from, to) => {
    if (!from || !to || from === to) return 25;
    const key1 = `${from}-${to}`.toLowerCase();
    const key2 = `${to}-${from}`.toLowerCase();

    const distanceMap = {
      'lahore-islamabad': 375,
      'lahore-rawalpindi': 370,
      'lahore-karachi': 1210,
      'lahore-peshawar': 510,
      'lahore-quetta': 980,
      'lahore-multan': 345,
      'lahore-faisalabad': 180,
      'lahore-sargodha': 190,
      'lahore-hafizabad': 110,
      'lahore-sialkot': 135,
      'lahore-gujranwala': 80,
      'islamabad-karachi': 1410,
      'islamabad-peshawar': 185,
      'islamabad-multan': 540,
      'sargodha-lahore': 190,
      'sargodha-karachi': 1100,
      'sargodha-islamabad': 240,
      'multan-karachi': 890,
      'hafizabad-lahore': 110,
      'hafizabad-islamabad': 260
    };

    if (distanceMap[key1]) return distanceMap[key1];
    if (distanceMap[key2]) return distanceMap[key2];

    // Dynamic estimation fallback based on text hash
    const val1 = from.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const val2 = to.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.abs(val1 * 3 - val2 * 2) % 650 + 120;
  };

  const calculatedDistance = getDistance(originCity, destinationCity);
  const baseFare = vehicleType === 'single' ? 5000 : 10000;
  const ratePerKm = vehicleType === 'single' ? 120 : 210;
  const estimatedTransportCost = baseFare + (calculatedDistance * ratePerKm);

  const formatImgUrl = (url) => {
    if (!url) return '/uploads/media__1785359752827.jpg';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return url;
    if (url.startsWith('uploads/')) return '/' + url;
    return '/uploads/' + url;
  };

  const sampleHorses = [
    {
      _id: 'faiz_miran_1',
      name: 'Faiz Miran',
      breed: 'Local / Desi',
      age: 8,
      color: 'Black',
      height: '62 inches',
      location: 'Lahore',
      price: 1000000,
      description: 'Pure Desi horse with Ravi bloodline especially trained for Nezabazi (tent-pegging) and sprint racing tournaments across Punjab.',
      sellerName: 'Ibrahim',
      sellerPhone: '+923001234567',
      sellerRating: 4.8,
      sellerType: 'CNIC Verified',
      sire: 'Asbha Siraj',
      dam: 'Karmawali',
      qualities: ['Neza Bazi Champion', 'Sprint Race Trained', 'Ravi Bloodline'],
      temperament: '8/10',
      healthStatus: 'Fully Vaccinated',
      training: 'Nezabazi & Speed Sprint',
      imageUrl: '/uploads/media__1785445045636.jpg',
      images: ['/uploads/media__1785445045636.jpg'],
      spotlight: true
    },
    {
      _id: '1',
      name: 'Thunderbolt (Stallion)',
      breed: 'Thoroughbred',
      age: 4,
      color: 'Dark Bay',
      height: '66 inches',
      location: 'Lahore',
      price: 2500000,
      description: 'Champion bloodline, excellent temperament, fully vaccinated. Top speed record holder at Lahore Turf Club competitions.',
      sellerName: 'Malik Shahzad',
      sellerPhone: '+923009876543',
      sellerRating: 4.9,
      sellerType: 'Verified Breeder',
      sire: 'Storm Cat II',
      dam: 'Lady Pearl',
      qualities: ['Speed Racer', 'Turf Club Record Holder', 'High Stamina'],
      temperament: '8/10',
      healthStatus: 'Fully Vaccinated',
      training: 'Professional Race Trained',
      imageUrl: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=600',
      images: [
        'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'
      ],
      spotlight: true
    },
    {
      _id: '2',
      name: 'Royal Sapphire (Mare)',
      breed: 'Arabian',
      age: 3,
      color: 'Grey / White',
      height: '61 inches',
      location: 'Islamabad',
      price: 1800000,
      description: 'Purebred Arabian mare with high stamina and elegant posture. Ideal for show rings, endurance rides, and breeding studs.',
      sellerName: 'Dr. Aisha Khan',
      sellerPhone: '+923214567890',
      sellerRating: 4.8,
      sellerType: 'Veterinarian & Breeder',
      sire: 'Al-Murtajiz',
      dam: 'Desert Rose',
      qualities: ['Endurance Champion', 'Show Ring Lineage', 'Pure Arabian Blood'],
      temperament: '9/10',
      healthStatus: 'Fully Vaccinated',
      training: 'Show and Endurance Trained',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
      spotlight: false
    },
    {
      _id: '4',
      name: 'Sufi (Nukra Stallion)',
      breed: 'Local / Desi',
      age: 4,
      color: 'Pure White (Pink Skin)',
      height: '67 inches',
      location: 'Sargodha',
      price: 3500000,
      description: 'Elite Nukra bloodline with clear pink skin (phulkari). Active dancer and Nezabazi (tent-pegging) champion stallion.',
      sellerName: 'Chaudhary Nabeel',
      sellerPhone: '+923017654321',
      sellerRating: 5.0,
      sellerType: 'Nukra Breed Specialist',
      sire: 'Shah-Jahan',
      dam: 'White Beauty',
      qualities: ['Nukra Pink Skin', 'Dancing Horse', 'Neza Bazi Champion'],
      temperament: '9/10',
      healthStatus: 'Fully Vaccinated',
      training: 'Nezabazi & Dancing Certified',
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600',
      spotlight: true
    },
    {
      _id: '5',
      name: 'Dilraj Nukra',
      breed: 'Local / Desi',
      age: 5,
      color: 'White',
      height: '64 inches',
      location: 'Multan',
      price: 2800000,
      description: 'Famous southern Punjab lineage stallion with outstanding trot and rhythm. Performs at cultural horse dancing festivals.',
      sellerName: 'Mian Tariq',
      sellerPhone: '+923028889900',
      sellerRating: 4.7,
      sellerType: 'CNIC Verified Breeder',
      sire: 'Sultan Khan',
      dam: 'Dilpasand',
      qualities: ['Dancing Horse', 'Festival Performer', 'Pure Stud Pedigree'],
      temperament: '9/10',
      healthStatus: 'Vaccinated',
      training: 'Traditional Dance Trained',
      imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600',
      spotlight: false
    },
    {
      _id: '6',
      name: 'Speedster Red',
      breed: 'Thoroughbred',
      age: 5,
      color: 'Chestnut Red',
      height: '65 inches',
      location: 'Faisalabad',
      price: 2100000,
      description: 'High velocity race stallion trained for long distance flat racing. Great muscle composition and speed stride.',
      sellerName: 'Rana Hammad',
      sellerPhone: '+923334445566',
      sellerRating: 4.9,
      sellerType: 'Race Horse Stable',
      sire: 'Red Rum Legacy',
      dam: 'Golden Speed',
      qualities: ['Speed Racer', 'Flat Racing Specialist'],
      temperament: '8/10',
      healthStatus: 'Fully Vaccinated',
      training: 'Professional Race Sprint',
      imageUrl: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=600',
      spotlight: false
    },
    {
      _id: '7',
      name: 'Zarrar (Arabian Stud)',
      breed: 'Arabian',
      age: 6,
      color: 'Chestnut Bay',
      height: '63 inches',
      location: 'Rawalpindi',
      price: 3200000,
      description: 'Imported lineage Arabian stud with verified pedigree documents. Excellent sire for high grade breeding programs.',
      sellerName: 'Brig. (R) Asadullah',
      sellerPhone: '+923005551234',
      sellerRating: 5.0,
      sellerType: 'Verified Stud Farm',
      sire: 'El Shaklan',
      dam: 'Safiya Al-Badiya',
      qualities: ['Stud Lineage', 'Imported Ancestry', 'Breeding Champion'],
      temperament: '9/10',
      healthStatus: 'Certified Health Clearance',
      training: 'Stud & Show Trained',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
      spotlight: true
    },
    {
      _id: '8',
      name: 'Sherdil Tent-Pegger',
      breed: 'Local / Desi',
      age: 7,
      color: 'Dappled Grey',
      height: '65 inches',
      location: 'Hafizabad',
      price: 1950000,
      description: 'Fearless tent-pegging horse with rock solid target acquisition. Proven winner in National Equestrian Championships.',
      sellerName: 'Ch. Subhan Ali',
      sellerPhone: '+923059901997',
      sellerRating: 5.0,
      sellerType: 'Master Breeder',
      sire: 'Dilbar Senior',
      dam: 'Phoolan Devi',
      qualities: ['Neza Bazi Champion', 'National Tournament Winner'],
      temperament: '10/10',
      healthStatus: 'Fully Vaccinated',
      training: 'Nezabazi Master Level',
      imageUrl: '/uploads/media__1785445045636.jpg',
      spotlight: true
    }
  ];

  const fetchHorses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/horses?limit=1000');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const formatted = data.data.map(h => ({
            ...h,
            price: Number(h.price),
            age: Number(h.age || 4),
            sire: h.sire || 'Registered Sire',
            dam: h.dam || 'Pure Dam Line',
            qualities: h.qualities || (h.description?.toLowerCase().includes('neza') ? ['Neza Bazi Champion'] : ['Speed Racer']),
            imageUrl: h.images && h.images.length > 0 ? h.images[0] : 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'
          }));
          setHorses(formatted);
        } else {
          setHorses(sampleHorses);
        }
      } else {
        setHorses(sampleHorses);
      }
    } catch (err) {
      setHorses(sampleHorses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, []);

  // Reset page to 1 on any filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [breedFilter, minPriceFilter, maxPriceFilter, locationFilter, searchTerm, sortBy]);

  const getProcessedListings = () => {
    let list = [...horses];
    if (breedFilter) {
      list = list.filter(h => h.breed.toLowerCase() === breedFilter.toLowerCase());
    }
    if (minPriceFilter > 0) {
      list = list.filter(h => Number(h.price) >= minPriceFilter);
    }
    if (maxPriceFilter < 5000000) {
      list = list.filter(h => Number(h.price) <= maxPriceFilter);
    }
    if (locationFilter) {
      list = list.filter(h => h.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        (h.sire && h.sire.toLowerCase().includes(q)) ||
        (h.dam && h.dam.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'age-young') return a.age - b.age;
      if (sortBy === 'age-old') return b.age - a.age;
      return 0;
    });

    return list;
  };

  const processedHorses = getProcessedListings();
  const totalPages = Math.ceil(processedHorses.length / ITEMS_PER_PAGE) || 1;
  const paginatedHorses = processedHorses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const avgPrice = horses.length > 0 ? Math.round(horses.reduce((sum, h) => sum + h.price, 0) / horses.length) : 0;

  const rawImages = (selectedHorse?.images && selectedHorse.images.length > 0)
    ? selectedHorse.images
    : [selectedHorse?.imageUrl || selectedHorse?.image || '/uploads/media__1785359752827.jpg'];

  const horseImages = rawImages.map(formatImgUrl);
  const currentImg = horseImages[modalImageIdx] || horseImages[0];

  const handleCalculateForHorse = (horseLocation) => {
    if (horseLocation) {
      setOriginCity(horseLocation);
    }
    // Scroll to transport calculator card in left sidebar
    const el = document.getElementById('transport-calculator-widget');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setSelectedHorse(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-up">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#020B21] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden gold-gradient-bar">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Verified Equestrian Trading
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            HorseSquare Marketplace Pakistan
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl font-normal leading-relaxed">
            Browse verified horses, inspect sire & dam bloodlines (Racer, Neza Bazi, Dancing), calculate city-to-city freight, and connect directly with Pakistan's top breeders.
          </p>
        </div>
      </div>

      {/* Market Stats dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-[#D4AF37]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Listings</p>
            <h4 className="text-lg font-black text-[#0F172A]">{horses.length} Verified</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg. Valuation</p>
            <h4 className="text-base font-black text-[#0F172A]">Rs. {avgPrice.toLocaleString('en-PK')}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trades Settled</p>
            <h4 className="text-lg font-black text-[#0F172A]">2,840+ Deals</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Breed</p>
            <h4 className="text-lg font-black text-[#0F172A]">Nukra Stallions</h4>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filters & Transport Calculator | Right Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side (4 Cols): Filter Form & Transport Calculator Widget */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Search & Filter Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4">
            <h3 className="text-sm font-black text-[#0F172A] pb-2 border-b flex items-center gap-2 uppercase tracking-wide">
              <Search className="w-4 h-4 text-[#D4AF37]" /> Search & Filter Listings
            </h3>

            {/* Keyword Search */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase">Keyword / Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search name, bloodline, sire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Breed Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase">Breed</label>
              <select
                value={breedFilter}
                onChange={(e) => setBreedFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
              >
                <option value="">All Breeds</option>
                <option value="Thoroughbred">Thoroughbred</option>
                <option value="Arabian">Arabian</option>
                <option value="Local / Desi">Local / Desi (Nukra)</option>
              </select>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase">Max Budget (PKR)</label>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="250000"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <span className="text-xs font-black text-[#D4AF37] block text-right">Rs. {maxPriceFilter.toLocaleString('en-PK')}</span>
            </div>

            {/* Location Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase">City / Location</label>
              <input
                type="text"
                placeholder="e.g. Lahore, Sargodha"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>
          </div>

          {/* 2. CITY TO CITY TRANSPORT CALCULATOR WIDGET */}
          <div id="transport-calculator-widget" className="bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#1E293B] p-6 rounded-2xl border border-slate-800 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wide">City-to-City Transport</h3>
                <p className="text-[10px] text-slate-400 font-medium">Equine Freight Estimator</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Origin City */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Pickup City (Seller)</label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Destination City */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Delivery City (Buyer)</label>
                <select
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Vehicle Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Vehicle Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVehicleType('single')}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition text-center ${
                      vehicleType === 'single'
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    Single Trailer
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('truck')}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition text-center ${
                      vehicleType === 'truck'
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    Heavy Truck
                  </button>
                </div>
              </div>

              {/* Fare Calculation Display */}
              <div className="pt-3 border-t border-slate-800 bg-slate-950/60 p-3 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Estimated Distance:</span>
                  <span className="font-bold text-white">{calculatedDistance} km</span>
                </div>
                <div className="flex justify-between items-center text-[#D4AF37] font-black text-sm">
                  <span>Estimated Freight:</span>
                  <span>Rs. {estimatedTransportCost.toLocaleString('en-PK')}</span>
                </div>
                <p className="text-[9px] text-slate-500 pt-1">
                  * Includes vet transit clearance, handler assistance, & secure trailer harness.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side (8 Cols): Product Grid with Pagination */}
        <div className="lg:col-span-8 space-y-6">

          {/* Top Bar: Results Count & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-700">
              Showing <span className="text-[#D4AF37] font-black">{paginatedHorses.length}</span> of <span className="text-slate-900 font-bold">{processedHorses.length}</span> verified horses (Page {currentPage} of {totalPages})
            </span>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Horse Cards Grid (6 items per page) */}
          {paginatedHorses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {paginatedHorses.map((horse) => (
                <div
                  key={horse._id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Top Media Image */}
                    <div className="relative h-56 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => { setSelectedHorse(horse); setModalImageIdx(0); }}>
                      <img
                        src={formatImgUrl(horse.imageUrl || horse.images?.[0])}
                        alt={horse.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#0F172A]/85 backdrop-blur-md text-amber-400 text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-lg border border-amber-500/30">
                        {horse.breed}
                      </span>
                      <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" /> {horse.location}
                      </span>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">{horse.age} Yrs • {horse.color}</span>
                        <span className="text-lg font-black text-[#D4AF37]">Rs. {Number(horse.price).toLocaleString('en-PK')}</span>
                      </div>

                      <h3
                        onClick={() => { setSelectedHorse(horse); setModalImageIdx(0); }}
                        className="text-base font-bold text-[#0F172A] group-hover:text-[#D4AF37] transition cursor-pointer line-clamp-1"
                      >
                        {horse.name}
                      </h3>

                      {/* Father / Mother Pedigree Snippet */}
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] grid grid-cols-2 gap-2">
                        <div className="truncate">
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">Father (Sire)</span>
                          <strong className="text-slate-900 font-extrabold">{horse.sire || 'Registered Sire'}</strong>
                        </div>
                        <div className="truncate">
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">Mother (Dam)</span>
                          <strong className="text-slate-900 font-extrabold">{horse.dam || 'Pure Dam'}</strong>
                        </div>
                      </div>

                      {/* Bloodline Qualities Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(horse.qualities || (horse.description?.toLowerCase().includes('neza') ? ['Neza Bazi Champion'] : ['Speed Racer'])).slice(0, 2).map((q, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1">
                            <Dna className="w-2.5 h-2.5 text-[#D4AF37]" /> {q}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        setSelectedHorse(horse);
                        setModalImageIdx(0);
                      }}
                      className="w-full bg-[#0F172A] hover:bg-[#D4AF37] text-white hover:text-[#0F172A] font-bold text-xs py-2.5 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>View Full Details & Pedigree</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-lg">No Horses Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No horse listings match your current filters. Try resetting your search or location preferences.
              </p>
            </div>
          )}

          {/* PAGINATION NAVIGATION CONTROLS (6 items per page) */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mt-6">
              <span className="text-xs font-semibold text-slate-500">
                Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                {/* Previous Page Button */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-[#D4AF37] hover:text-slate-950 hover:border-[#D4AF37] transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                      currentPage === pageNum
                        ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Page Button */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-[#D4AF37] hover:text-slate-950 hover:border-[#D4AF37] transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* RICH HORSE DETAILS POPUP MODAL */}
      <Modal
        isOpen={Boolean(selectedHorse)}
        onClose={() => setSelectedHorse(null)}
        title={selectedHorse?.name || 'Horse Details'}
      >
        {selectedHorse && (
          <div className="space-y-6">
            {/* Top Media Gallery Preview */}
            <div className="space-y-2">
              <div className="relative h-64 sm:h-72 bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <img
                  src={currentImg}
                  alt={selectedHorse.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#0F172A]/90 text-amber-400 text-xs font-black tracking-wider uppercase px-3 py-1 rounded-lg border border-amber-500/30">
                  {selectedHorse.breed}
                </span>
                <span className="absolute top-3 right-3 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedHorse.location}
                </span>
              </div>

              {/* Thumbnails strip if multiple images */}
              {horseImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {horseImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setModalImageIdx(idx)}
                      className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                        modalImageIdx === idx ? 'border-[#D4AF37] scale-95 shadow' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Name Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F172A]">{selectedHorse.name}</h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {selectedHorse.age} Years Old • {selectedHorse.color} • {selectedHorse.height}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Asking Price</span>
                <span className="text-2xl font-black text-[#D4AF37]">
                  Rs. {Number(selectedHorse.price).toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* FATHER (SIRE) & MOTHER (DAM) PEDIGREE SECTION */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
                <Dna className="w-4 h-4 text-[#D4AF37]" /> Pedigree & Bloodline Ancestry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Father (Sire)</span>
                  <strong className="text-amber-300 text-sm font-extrabold block mt-0.5">
                    {selectedHorse.sire || 'Asbha Siraj'}
                  </strong>
                  <p className="text-[10px] text-slate-400 mt-1">Verified Stud Lineage</p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Mother (Dam)</span>
                  <strong className="text-amber-300 text-sm font-extrabold block mt-0.5">
                    {selectedHorse.dam || 'Karmawali'}
                  </strong>
                  <p className="text-[10px] text-slate-400 mt-1">Registered Dam Line</p>
                </div>
              </div>
            </div>

            {/* BLOODLINE QUALITIES & DISCIPLINES BADGES */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D4AF37]" /> Bloodline Qualities & Specialties
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selectedHorse.qualities || ['Neza Bazi Champion', 'Speed Racer', 'Dancing Horse']).map((q, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* Comprehensive Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Temperament</span>
                <strong className="text-slate-900 text-xs font-extrabold">{selectedHorse.temperament || '8/10'}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Health Status</span>
                <strong className="text-emerald-700 text-xs font-extrabold">{selectedHorse.healthStatus || 'Fully Vaccinated'}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Training</span>
                <strong className="text-slate-900 text-xs font-extrabold">{selectedHorse.training || 'Professional'}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Verification</span>
                <strong className="text-cyan-700 text-xs font-extrabold">CNIC Verified</strong>
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-900 uppercase">Seller Description</h4>
              <p className="text-slate-700 text-xs leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-200">
                {selectedHorse.description}
              </p>
            </div>

            {/* Seller Contact Card & Quick Transport Button */}
            <div className="p-5 bg-gradient-to-r from-amber-500/10 via-slate-900 to-[#0F172A] rounded-2xl border border-slate-800 text-white space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Seller Information</span>
                  <h4 className="text-base font-black text-white">{selectedHorse.sellerName || 'Ibrahim'}</h4>
                  <p className="text-xs text-slate-300 font-semibold">{selectedHorse.sellerPhone || '+923001234567'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedHorse.sellerPhone || '+923001234567'}`}
                    className="px-4 py-2.5 bg-[#D4AF37] text-slate-950 font-extrabold rounded-xl text-xs hover:bg-amber-400 transition cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Seller
                  </a>

                  <a
                    href={`https://wa.me/${String(selectedHorse.sellerPhone || '923001234567').replace(/\+/g, '')}?text=Hello%20${encodeURIComponent(selectedHorse.sellerName || 'Seller')},%20I%20am%20interested%20in%20your%20horse%20listing:%20${encodeURIComponent(selectedHorse.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#25D366] text-white font-extrabold rounded-xl text-xs hover:bg-[#20bd5a] transition cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Quick Freight Button */}
              <button
                type="button"
                onClick={() => handleCalculateForHorse(selectedHorse.location)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Estimate Transport Freight from {selectedHorse.location}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
