import React from 'react';
import { Link } from 'react-router-dom';
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
import heroVideo from '../../assets/hero_section_video.mp4';

export const Home = () => {
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
      imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Arabian",
      origin: "Middle East",
      description: "Famed for their elegance, high-set tail, and exceptional endurance. Prized across Pakistan for beauty contests and stamina riding.",
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Marwari",
      origin: "Rajasthan (Subcontinent)",
      description: "Recognized by their distinctive inward-curving ears and extreme loyalty. Known for their high spirit and usage in cultural festivals.",
      imageUrl: "https://images.unsplash.com/photo-1598974357801-cbca10065a71?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Desi / Local (Nukra)",
      origin: "Pakistan / Punjab",
      description: "Highly robust, white coat (Nukra), and resilient. Widely celebrated for traditional Nezabazi (Tent pegging) and local equestrian shows.",
      imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600"
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
      description: "An elite beauty show presenting purebred Nukra, Arabian, and Marwari breeds, judging confirmation, posture, and elegance.",
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
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Hero Section with Background Video and Black Blur Overlay */}
      <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center bg-black">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source
            src={heroVideo}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Black Blur Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 backdrop-blur-[0.5px]"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight animate-fade-up">
            Experience the Legacy of <span className="animate-shimmer">Horse-Square</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg font-light mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-150">
            The ultimate digital marketplace for horse trading, live auctions, professional breeding, AI-assisted vet diagnostics, and certified riding school networks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center animate-fade-up delay-250">
            <Link
              to="/marketplace"
              className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] hover:to-[#B8860B] text-[#0F172A] font-bold py-3.5 px-8 rounded-lg shadow-lg hover:shadow-amber-500/30 transition-all duration-300 text-center animate-glow"
            >
              Explore Marketplace
            </Link>
            <Link
              to="/vet"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-lg border border-white/20 hover:border-white/30 backdrop-blur transition-all duration-300 text-center"
            >
              Consult AI Vet
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">

        {/* Core Features Showcase Section */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 animate-fade-up">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Our Premium Services</h2>
            <p className="text-slate-500 text-sm sm:text-base font-light">
              Horse-Square Pakistan offers state-of-the-art features tailored for equine enthusiasts, breeders, and buyers nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-[#D4AF37] transition-all duration-500 flex flex-col justify-between group relative overflow-hidden animate-fade-up ${delays[idx % delays.length]}`}
              >
                {/* Accent border highlight on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{feature.description}</p>
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

        {/* Platform Statistics Section */}
        <section className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl animate-fade-up delay-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-4 first:pt-0 sm:pt-4 lg:pt-0 animate-fade-up ${delays[idx % delays.length]}`}
              >
                <div className="bg-slate-800 p-3 rounded-full mb-3 group hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">{stat.value}</span>
                <span className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pakistani Breeds Spotlight */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 animate-fade-up">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Equestrian Breeds Spotlight</h2>
            <p className="text-slate-500 text-sm sm:text-base font-light">
              Explore the iconic breeds found, traded, and bred within Pakistan's premier horse community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {breeds.map((breed, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-500 flex flex-col sm:flex-row sm:h-60 group animate-fade-up ${delays[idx % delays.length]}`}
              >
                <div className="sm:w-2/5 h-48 sm:h-full relative overflow-hidden">
                  <img
                    src={breed.imageUrl}
                    alt={breed.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#0F172A]/80 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                    {breed.origin}
                  </div>
                </div>
                <div className="sm:w-3/5 p-6 flex flex-col justify-center space-y-2 bg-white">
                  <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#D4AF37] transition-colors">{breed.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{breed.description}</p>
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
                className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group animate-fade-up ${delays[idx % delays.length]}`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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
              className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm px-6 py-3.5 rounded-lg shadow-md transition"
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
                className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden animate-fade-up ${delays[idx % delays.length]}`}
              >
                <div className="absolute top-0 right-0 bg-[#0F172A] text-amber-300 text-[10px] font-bold px-3 py-1.5 rounded-bl-lg border-l border-b border-slate-800">
                  {event.date}
                </div>

                <div className="mt-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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

        {/* Horse Care Tips & Insights */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 animate-fade-up">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <BookOpen className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Essential Equine Care Guide</h2>
              <p className="text-slate-500 text-sm">Professional advice to keep your horse healthy, robust, and active.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, idx) => (
              <div
                key={idx}
                className={`bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#D4AF37]/35 transition-all duration-300 animate-fade-up ${delays[idx % delays.length]}`}
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
              className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm px-6 py-3.5 rounded-lg shadow-md hover:shadow-amber-500/10 transition animate-glow"
            >
              Need Medical Advice? Consult AI Vet Doctor <ArrowRight className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
