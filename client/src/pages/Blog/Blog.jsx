import React, { useState } from 'react';
import { BookOpen, Search, ArrowLeft, Clock, User, Calendar, Tag, ChevronRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "The Regal Nukra Horse: Pakistan's Icon of Prestige",
    category: "Breeds",
    author: "Malik Shahzad",
    date: "June 25, 2026",
    readTime: "5 min read",
    summary: "Known for their pure white coat and pink skin, Nukra horses hold an esteemed place in Punjab's traditional festivals and ceremonies.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800",
    content: [
      "The Nukra horse is not just a breed; it is a living symbol of cultural pride, heritage, and luxury in Pakistan, particularly across the fertile plains of Punjab. Characterized by its signature pure white coat, white mane, pink skin, and often light-colored eyes, a true Nukra is a sight of breathtaking beauty. In local horse culture, the pink-spotted skin is beautifully referred to as 'phulkari' (floral embroidery).",
      "Genetically, the Nukra's stunning white coat is the result of specific double-sabino genes. While breeders across Pakistan treat them as a distinct class, experts note that they share conformational lineages with other regional breeds like the Sindhi and Chamba horses. They are highly agile, spirited, and possess a regal stance.",
      "In traditional celebrations, Nukra horses play an irreplaceable role. They are trained for traditional dancing (tent-pegging shows, cultural fairs) where they move gracefully to the beat of Punjabi 'dhol' drums. Owning a Nukra stallion is considered a status symbol of nobility and hospitality, and they are regularly featured in high-profile weddings and national festivals like the Lahore Horse and Cattle Show."
    ]

  },
  {
    id: 3,
    title: "Essential Equine Nutrition & Daily Diet Guidelines",
    category: "Equine Care",
    author: "Vet. Bilal Ahmed",
    date: "June 10, 2026",
    readTime: "4 min read",
    summary: "A practical guide to horse feed, hydration, and nutritional balance to keep your companion healthy and strong.",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
    content: [
      "Proper nutrition is the cornerstone of horse health and performance. A horse's digestive system is designed to process high-fiber forage in small amounts throughout the day. Ideally, high-quality grass or hay (forage) should constitute 1.5% to 2% of their total body weight daily. For example, a 500kg horse needs around 7.5 to 10kg of forage each day.",
      "Clean, fresh water must be accessible at all times. A horse can drink anywhere from 20 to 50 liters of water a day, which increases significantly during summer heat or high-intensity work. Dehydration is a primary cause of impaction colic, a life-threatening veterinary emergency.",
      "While forage provides base energy, active stallions, pregnant mares, or growing foals require supplemental concentrates (oats, barley, commercial pellets) and essential mineral blocks. Always introduce dietary changes gradually over 7 to 10 days to allow the horse's gut microbiome to adapt and prevent colic or laminitis."
    ]
  },
  {
    id: 4,
    title: "Understanding Nezabazi: The Traditional Art of Tent Pegging",
    category: "Events",
    author: "Chaudhary Nabeel",
    date: "May 28, 2026",
    readTime: "5 min read",
    summary: "Learn about Pakistan's national horse sport, Nezabazi, a display of horse mastery, speed, and precision.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    content: [
      "Nezabazi, or tent pegging, is one of the most celebrated traditional equestrian sports in Pakistan. Originating from ancient cavalry tactics where horsemen would attack enemy camp tents at a gallop to collapse them, it has evolved into a thrilling sport of speed, precision, and coordination. Riders gallop at full speed and use a lance or sword to impale and carry away a small wooden peg anchored in the ground.",
      "The sport demands an extraordinary level of trust and training between the horse and the rider. Horses must maintain a straight line at absolute top speed (nearly 50 km/h) without flinching, while the rider leans low to hit a target just a few inches wide.",
      "In Pakistan, Nezabazi tournaments draw thousands of spectators. Traditional clubs from Faisalabad, Sargodha, Lahore, and Multan compete intensely. The riders wear vibrant traditional clothing, and the horses are beautifully adorned, making it a spectacular display of Pakistan's deep-rooted equestrian heritage."
    ]
  }
];

export const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ['All', 'Breeds', 'Equine Care', 'Events'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (activeArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">
        {/* Back Button */}
        <button
          onClick={() => setActiveArticle(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#D4AF37] font-semibold mb-6 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Articles
        </button>

        {/* Article Container */}
        <article className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          {/* Header Image */}
          <div className="relative h-64 sm:h-[400px] w-full bg-slate-900">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="px-3 py-1 bg-[#D4AF37] text-slate-900 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                {activeArticle.category}
              </span>
              <h1 className="text-xl sm:text-3xl font-black leading-tight mt-2">
                {activeArticle.title}
              </h1>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-100 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-slate-400" />
              <span>By {activeArticle.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{activeArticle.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{activeArticle.readTime}</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-8 space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg font-light">
            {activeArticle.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden gold-gradient-bar">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Equine Knowledge Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Horse-Square Pakistan Blog
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Stay updated with breed guides, expert vet tips, regional history, and the latest horse shows across Pakistan.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${selectedCategory === category
                  ? 'bg-[#D4AF37] text-slate-900 shadow-md shadow-amber-500/10'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#0F172A]/85 text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase rounded">
                  {article.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-[#0F172A] text-lg sm:text-xl group-hover:text-[#D4AF37] transition mb-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed mb-4">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-xs font-bold text-[#D4AF37] group-hover:text-[#0F172A] transition">
                  <span>Read Article</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-inner">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-extrabold text-slate-700 text-lg">No articles found</h3>
          <p className="text-slate-400 text-sm mt-1">Try tweaking your search or filtering keywords.</p>
        </div>
      )}
    </div>
  );
};
