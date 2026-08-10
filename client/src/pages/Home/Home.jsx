import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Gavel,
  Dna,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  ShieldCheck,
  BookOpen,
  MapPin
} from 'lucide-react';
import heroVideo from '../../assets/Hero final.mov';

export const Home = () => {
  const { user } = useAuth();
  const [featuredHorses, setFeaturedHorses] = useState([]);

  const formatImgUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return url;
    if (url.startsWith('uploads/')) return '/' + url;
    return '/uploads/' + url;
  };

  // Dynamic Featured Horses state initialized from API
  const sampleFeaturedHorses = [];

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const res = await fetch('/api/horses?limit=6');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const formatted = data.data.map(h => ({
              ...h,
              price: Number(h.price),
              imageUrl: h.images && h.images.length > 0 ? h.images[0] : (h.imageUrl || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600')
            }));
            setFeaturedHorses(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to fetch featured horses from API:", err);
      }
    };
    fetchHorses();
  }, []);

  const features = [
    {
      title: "Horse Marketplace",
      description: "Buy and sell premium horses directly. Browse verified listings and connect with sellers across Punjab, Sindh, KPK, and Balochistan.",
      icon: <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />,
      link: "/marketplace",
      cta: "Explore Marketplace"
    },
    {
      title: "Live Auctions",
      description: "Participate in real-time bidding for elite horse breeds. Start your own auction or bid securely on verified listings.",
      icon: <Gavel className="w-6 h-6 text-[#D4AF37]" />,
      link: "/auction",
      cta: "Explore Auctions"
    },
    {
      title: "Breeding Registry",
      description: "Find breed matches for your stallion or mare. Track bloodlines, request breeding certificates, and connect with stud owners.",
      icon: <Dna className="w-6 h-6 text-[#D4AF37]" />,
      link: "/breeding",
      cta: "Find Stud Matches"
    },
    {
      title: "AI Vet Doctor",
      description: "Instant AI diagnostics for common equine symptoms. Generate health analysis reports and find verified local vets.",
      icon: <Stethoscope className="w-6 h-6 text-[#D4AF37]" />,
      link: "/vet",
      cta: "Diagnose Now"
    },
    {
      title: "Riding Schools",
      description: "Connect with premium horse riding schools and instructors. Locate courses from beginner training to advanced show jumping.",
      icon: <GraduationCap className="w-6 h-6 text-[#D4AF37]" />,
      link: "/riding-school",
      cta: "Find Riding Clubs"
    }
  ];

  const stats = [
    { label: "Active Listings", value: "5,000+", icon: <TrendingUp className="w-5 h-5 text-amber-500" /> },
    { label: "Verified Members", value: "12,000+", icon: <Users className="w-5 h-5 text-amber-500" /> },
    { label: "AI Vet Consultations", value: "3,500+", icon: <ShieldCheck className="w-5 h-5 text-amber-500" /> },
    { label: "Riding Clubs Registered", value: "45+", icon: <Award className="w-5 h-5 text-amber-500" /> }
  ];

  const breeds = [
    {
      name: "Thoroughbred",
      origin: "British / European",
      description: "Renowned for their incredible speed, athletic posture, and premium racing pedigree. Highly sought after for professional turf racing.",
      imageUrl: "https://images.unsplash.com/photo-1605258277235-8f645a7ec8c9?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Arabian",
      origin: "Middle East",
      description: "Famed for their elegance, high-set tail, and exceptional endurance. Prized across Pakistan for beauty contests and stamina riding.",
      imageUrl: "https://images.pexels.com/photos/3165565/pexels-photo-3165565.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Desi / Local (Nukra)",
      origin: "Pakistan / Punjab",
      description: "Highly robust, white coat (Nukra), and resilient. Widely celebrated for traditional Nezabazi (Tent pegging) and local equestrian shows.",
      imageUrl: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Sindhi",
      origin: "Sindh, Pakistan",
      description: "Prized for its elegant high head carriage, ambling gait, and immense heat tolerance. An integral part of Sindhi cultural festivals.",
      imageUrl: "https://images.unsplash.com/photo-1598974357801-cbca10065a71?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Balochi",
      origin: "Balochistan, Pakistan",
      description: "A powerful, mountain-hardy horse with robust hooves. Widely celebrated for Nezabazi (tent pegging) and endurance across rocky regions.",
      imageUrl: "https://images.unsplash.com/photo-1598974357832-6a68b030fb3f?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Friesian",
      origin: "Netherlands (Exotic)",
      description: "Highly majestic black horses with thick manes, feathered legs, and high-stepping gaits. Increasingly popular for luxury weddings.",
      imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const academies = [
    {
      title: "Structured Training Curriculum",
      description: "From basic riding fundamentals and mount balance to advanced dressage, show jumping, and obstacle clearance training.",
      icon: <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      title: "Certified Instructors",
      description: "Learn from verified, elite national equestrian coaches and instructors. Schedule private or group sessions directly.",
      icon: <Users className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      title: "Partner Arenas & Facilities",
      description: "Access premium training arenas, safety gear, and well-schooled training horses at our verified partner riding clubs.",
      icon: <MapPin className="w-5 h-5 text-[#D4AF37]" />
    }
  ];

  const events = [
    {
      title: "National Tent Pegging (Nezabazi) Cup",
      location: "Lahore Cavalry Ground",
      date: "Oct 12-15, 2026",
      description: "Watch Pakistan's finest horse clubs compete in traditional tent pegging. A celebration of speed, skill, and cultural heritage.",
      icon: <Award className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      title: "National Breeding Pageant & Show",
      location: "Faisalabad Equestrian Club",
      date: "Nov 22, 2026",
      description: "An elite beauty show presenting purebred Nukra and Arabian breeds, judging confirmation, posture, and elegance.",
      icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      title: "Rawalpindi Autumn Gallop Tour",
      location: "Rawalpindi Race Club",
      date: "Dec 05, 2026",
      description: "High-stakes turf racing event featuring top Thoroughbreds and local stallions. Food stalls, family activities, and awards.",
      icon: <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
    }
  ];

  const tips = [
    {
      title: "Equine Nutrition Rules",
      content: "Ensure your horse has clean water at all times. High-quality forage (grass/hay) should constitute at least 1.5% to 2% of their body weight daily."
    },
    {
      title: "Hoof Care & Farriery",
      content: "Hooves should be trimmed or shod every 6 to 8 weeks. Clean hooves daily to prevent thrush and identify bruising early."
    },
    {
      title: "Vaccination & Immunity",
      content: "Ensure timely vaccinations against Tetanus, Rabies, and Equine Influenza. Set up a strategic deworming schedule based on fecal egg counts."
    },
    {
      title: "Grooming & Health Checks",
      content: "Daily brushing boosts blood circulation, keeps skin healthy, and lets you check for cuts, swelling, or changes in body temperature."
    }
  ];

  const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Ambient background glow orbs for liquid glass refraction */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-400/15 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Hero Section with Background Video and Liquid Glass Overlay & Widgets */}
      <div className="relative w-full min-h-[calc(100vh-80px)] py-16 overflow-hidden flex items-center justify-center bg-black">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-[1.5] contrast-[1.05]"
        >
          <source src={heroVideo} />
          Your browser does not support the video tag.
        </video>

        {/* Lightened Ambient Overlay for Bright Video Display */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-slate-950/65"></div>

        {/* Hero Ambient Glass Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 sm:px-12 md:px-16 lg:px-20 max-w-4xl mx-auto text-white flex flex-col items-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight animate-fade-up">
            Experience the Legacy of <span className="animate-shimmer whitespace-nowrap">Horse-Square</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-base md:text-lg font-light mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-150">
            The ultimate digital marketplace for horse trading, live auctions, professional breeding, AI-assisted vet diagnostics, and certified riding school networks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center animate-fade-up delay-250">
            <Link
              to="/marketplace"
              className="w-full sm:w-auto liquid-glass-hero-btn bg-white/20 hover:bg-white/35 text-white font-extrabold py-3.5 px-9 rounded-xl border border-white/60 hover:border-[#D4AF37] transition-all duration-300 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:shadow-[0_14px_45px_rgba(212,175,55,0.45)] hover:-translate-y-0.5"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-24">

        {/* Core Features Showcase Section */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 animate-fade-up">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Services</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Our Premium Services</h2>
            <p className="text-slate-500 text-sm sm:text-base font-light">
              Horse-Square Pakistan offers state-of-the-art features tailored for equine enthusiasts, breeders, and buyers nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`liquid-glass-card liquid-glass-sheen rounded-3xl p-7 border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden animate-fade-up ${delays[idx % delays.length]}`}
              >
                {/* Accent gold top border highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                <div>
                  <div className="w-12 h-12 rounded-2xl liquid-glass-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-amber-500/30">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2.5">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">{feature.description}</p>
                </div>

                <Link
                  to={feature.link}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D4AF37] hover:text-[#0F172A] transition-colors"
                >
                  {feature.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Statistics Section in Dark Liquid Glass */}
        <section className="liquid-glass-dark text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl animate-fade-up delay-100 border border-amber-500/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`liquid-glass-dark p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col items-center justify-center shadow-lg group hover:-translate-y-1 animate-fade-up ${delays[idx % delays.length]}`}
              >
                <div className="bg-amber-500/15 p-3.5 rounded-xl mb-3.5 border border-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 mb-1 tracking-tight">{stat.value}</span>
                <span className="text-slate-300 text-xs sm:text-sm uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Marketplace Horse Ads */}
        <section className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-up">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Live Marketplace</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Featured Marketplace Listings</h2>
              <p className="text-slate-500 text-sm sm:text-base font-light">
                Discover verified horses listed for sale by top breeders and sellers across Pakistan.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-[#0F172A] transition-colors shrink-0"
            >
              Browse All Marketplace Ads <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHorses.slice(0, 6).map((horse, idx) => (
              <div
                key={horse._id || idx}
                className={`liquid-glass-card liquid-glass-sheen rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group border border-white/80 animate-fade-up ${delays[idx % delays.length]}`}
              >
                <div>
                  <div className="relative h-56 sm:h-60 bg-slate-950 overflow-hidden flex items-center justify-center group">
                    <img
                      src={formatImgUrl(horse.imageUrl || horse.images?.[0] || horse.image)}
                      alt={horse.name}
                      className="absolute inset-0 w-full h-full object-cover object-center blur-md opacity-40 scale-110"
                    />
                    <img
                      src={formatImgUrl(horse.imageUrl || horse.images?.[0] || horse.image)}
                      alt={horse.name}
                      className="relative z-10 max-w-full max-h-full object-contain object-center group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B0F19]/80 text-amber-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-lg border border-amber-500/30 z-20">
                      {horse.breed || 'Purebred'}
                    </div>
                    {horse.location && (
                      <div className="absolute top-3 right-3 bg-black/70 text-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 z-20">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" /> {horse.location}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">{horse.age ? `${horse.age} Yrs` : 'Adult'} • {horse.color || 'Solid'}</span>
                      <span className="text-lg font-black text-[#D4AF37]">
                        Rs. {Number(horse.price || 0).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {horse.name}
                    </h3>

                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed font-normal">
                      {horse.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/marketplace"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#D4AF37] text-white hover:text-[#0F172A] font-bold text-xs py-3 px-4 rounded-xl transition-all duration-300 shadow-md"
                  >
                    View Listing Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Equestrian Academies & Riding Schools */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 animate-fade-up">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Equestrian Training</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Riding Academies & Clubs</h2>
            <p className="text-slate-500 text-sm sm:text-base font-light">
              Connect with certified riding institutions, enroll in structured coaching programs, and train at elite arenas across the country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {academies.map((academy, idx) => (
              <div
                key={idx}
                className={`liquid-glass-card liquid-glass-sheen rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group border border-white/80 animate-fade-up ${delays[idx % delays.length]}`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl liquid-glass-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-amber-500/30 shadow-sm">
                    {academy.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{academy.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{academy.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center animate-fade-up">
            <Link
              to="/riding-school"
              className="inline-flex items-center gap-2 liquid-glass-dark hover:border-amber-500/50 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-xl transition-all duration-300 border border-amber-500/30 hover:scale-105"
            >
              Browse Riding Schools <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>
        </section>

        {/* National Equestrian Events Calendar */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 animate-fade-up">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Stay Updated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Equestrian Events Calendar</h2>
            <p className="text-slate-500 text-sm sm:text-base font-light">
              Don't miss the major tent-pegging (Nezabazi) cups, horse pageants, and derby races in Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, idx) => (
              <div
                key={idx}
                className={`liquid-glass-card liquid-glass-sheen rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden border border-white/80 animate-fade-up ${delays[idx % delays.length]}`}
              >
                <div className="absolute top-0 right-0 liquid-glass-dark text-amber-300 text-[11px] font-bold px-4 py-1.5 rounded-bl-2xl border-l border-b border-amber-500/40 shadow-md">
                  {event.date}
                </div>

                <div className="mt-2">
                  <div className="w-12 h-12 rounded-2xl liquid-glass-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-amber-500/30 shadow-sm">
                    {event.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 pr-16">{event.title}</h3>
                  <p className="text-slate-500 text-xs flex items-center gap-1 mb-3 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {event.location}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Horse Care Tips & Insights in Liquid Glass Container */}
        <section className="liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-8 animate-fade-up border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
            <div className="p-2.5 rounded-xl liquid-glass-gold border border-amber-500/40">
              <BookOpen className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Essential Equine Care Guide</h2>
              <p className="text-slate-500 text-sm font-light">Professional advice to keep your horse healthy, robust, and active.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, idx) => (
              <div
                key={idx}
                className={`liquid-glass-gold border border-amber-500/40 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 animate-fade-up hover:-translate-y-1 ${delays[idx % delays.length]}`}
              >
                <h3 className="font-bold text-[#0F172A] text-base sm:text-lg mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#D4AF37] rounded-full inline-block"></span>
                  {tip.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{tip.content}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 text-center">
            <Link
              to="/vet"
              className="inline-flex items-center gap-2.5 liquid-glass-dark text-white hover:border-amber-500/60 font-semibold text-sm px-8 py-4 rounded-xl shadow-xl transition-all duration-300 border border-amber-500/40 hover:scale-105 animate-glow"
            >
              Need Medical Advice? Consult AI Vet Doctor <ArrowRight className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
