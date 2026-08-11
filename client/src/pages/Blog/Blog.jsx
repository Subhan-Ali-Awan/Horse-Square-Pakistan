import React, { useEffect, useState } from 'react';
import { BookOpen, Search, ArrowLeft, Clock, User, Calendar, Tag, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getApiUrl } from '../../config/api';

export const Blog = () => {
  // Enable scroll reveal animations
  useScrollReveal('.reveal-on-scroll');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl('/api/blogs'));
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const formatted = data.data.map(a => ({
              ...a,
              id: a._id,
              date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }));
            setArticles(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to fetch blog articles from API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categories = ['All', 'Breeds', 'Equine Care', 'Events'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (activeArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fade-up">
        {/* Back Button */}
        <button
          onClick={() => setActiveArticle(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#D4AF37] font-bold text-xs sm:text-sm mb-4 sm:mb-6 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Articles
        </button>

        {/* Article Container */}
        <article className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          {/* Header Image */}
          <div className="relative h-52 sm:h-[400px] w-full bg-slate-900">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              className="w-full h-full object-cover object-center opacity-90"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
              <span className="px-3 py-1 bg-[#D4AF37] text-slate-900 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-3 inline-block shadow">
                {activeArticle.category}
              </span>
              <h1 className="text-lg sm:text-3xl font-black leading-tight mt-1 sm:mt-2">
                {activeArticle.title}
              </h1>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 sm:gap-4 px-4 sm:px-8 py-3.5 sm:py-4 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>By {activeArticle.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeArticle.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeArticle.readTime}</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
            {activeArticle.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 animate-fade-up space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" /> Equine Knowledge Center
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Horse-Square Pakistan Blog
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-light">
            Stay updated with breed guides, expert vet tips, regional history, and the latest horse shows across Pakistan.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-center bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full md:w-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${selectedCategory === category
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 reveal-on-scroll">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Card Image */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0F172A] text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase rounded-lg shadow">
                  {article.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-400 mb-2 sm:mb-3 font-semibold">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-500" /> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-[#0F172A] text-base sm:text-xl group-hover:text-[#B8860B] transition leading-snug mb-1.5">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-black text-[#D4AF37] group-hover:text-[#0F172A] transition">
                  <span>Read Full Article</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
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
