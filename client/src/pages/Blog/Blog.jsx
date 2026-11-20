import React, { useEffect, useState } from 'react';
import { BookOpen, Search, ArrowLeft, Clock, User, Calendar, Tag, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getApiUrl } from '../../config/api';

const FALLBACK_ARTICLES = [
  {
    id: 'f1',
    title: "Shahi Nukra Ghora: Pakistan Ki Shaan Aur Izzat Ka Nishan",
    category: "Breeds",
    author: "Malik Shahzad",
    date: "Nov 20, 2026",
    readTime: "5 min read",
    summary: "Apni chamakdar safaid jild aur gulabi rangat ki waja se, Nukra ghore Punjab ke shahi melaon, shadiyon aur tehwaro me numayan muqam rakhte hain.",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
    content: [
      "Nukra ghora sirf aik nasal nahi hai, balkay yeh Pakistan, khas tor par Punjab ke zarkhez maidanon me saqafat, fakhar aur shaan o shaukat ki zinda misaal hai. Iski pehchan iska shafaf safaid rang, safaid baal, gulabi jild aur chamakdar aankhein hain. Desi equine culture me iski gulabi jild ko bohot khoobsurti se 'phulkari' kaha jata hai.",
      "Genetic aitabar se, Nukra ghoray ka shandar safaid rang double-sabino genes ka nateeja hota hai. Pakistan ke equine breeders isay aik mukammal alag class maantay hain, jabke experts ke mutabiq yeh Sindhi aur Chamba naslon ke sath bhi gehra connection rakhta hai. Yeh ghore nihayat chust, hoshyar aur roabdar chaal dhaal ke malik hotay hain.",
      "Pakistan ke riwayati melay aur tehwar Nukra ghoron ke baghair adhoore hain. Inhein makhsoos dhol ki thaap par nachnay (horse dance) aur Nezabazi ke shandar muzahiron ke liye train kiya jata hai. Nukra ghore ka maalik hona khandani shaan aur izzat samjha jata hai, aur yeh Lahore Horse & Cattle Show jese qoumi events ka markazi hissa hotay hain."
    ]
  },
  {
    id: 'f2',
    title: "Tareekhi Anmol Nasal: Pakistan Ka Qadeem Equine Virsa",
    category: "Breeds",
    author: "Dr. Tariq Mahmood",
    date: "Nov 15, 2026",
    readTime: "7 min read",
    summary: "Qadeem Anmol nasal ki tareekh, aur insaan aur ghoray ke sadiyon puranay rishtay aur Pakistan ki shandar saqafat ka jaiza.",
    image: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800",
    content: [
      "Ghoray aur insaan ka rishta Punjab aur Pakistan ki tareekh aur saqafat me sadiyon purana aur bohot gehra hai. Sadiyon se yeh shandar janwar sirf safar ka zariya nahi rahay, balkay bahadur jangjuon ke wafadar saathi, nawabon aur sardaron ki shaan, aur Nezabazi (tent pegging) ke champions rahay hain. Yeh tareekhi rishta wafadari, ghairat aur ba-bahami ehtaram ki azeem dastaan hai.",
      "'Anmol' (jis ka lafzi matlab la-jawab ya be-qeemat hai) bare-sagheer aur Pakistan ki aik nihayat qadeem aur nayab equine nasal hai. Tareekhi riwayat ke mutabiq Anmol nasal ka silsila Sikandar-e-Azam (Alexander the Great) ke daryaye Jhelum ke maarkay se milta hai, jahan muqami ghoron ko Arabi aur Irani naslon ke sath cross kiya gaya tha.",
      "Anmol ghore apne chamakdar kumait (bay) ya samand (chestnut) rang, mazboot pathon, aur sakht garmi aur dhoop me be-misaal stamina ke liye mashhoor hain. Jadeed racing ghoron ke muqablay me Anmol ghora mukhtasir khuraak par lamba fasla tay karne ki shandar salahiyat rakhta hai.",
      "Aaj kal, Punjab aur Khyber Pakhtunkhwa ke pur-khaloos breeders Anmol nasal ki hifazat aur iski asal bloodline ko dobarah zinda karne ke liye din raat mehnat kar rahay hain, taake Pakistan ka yeh tareekhi sarmaya hamesha mehfooz rahay."
    ]
  },
  {
    id: 'f3',
    title: "Ghoron Ki Behtareen Khuraak Aur Rozmarra Diet Ke Assool",
    category: "Equine Care",
    author: "Vet. Bilal Ahmed",
    date: "Nov 10, 2026",
    readTime: "4 min read",
    summary: "Ghoron ki sehat, paani ki miqdaar aur tawazan wali ghiza ka mukammal rehnuma guide taake aapka ghora hamesha tandrust aur taqatwar rahay.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800",
    content: [
      "Munassib aur tawazan wali ghiza ghoray ki tandrusti aur behtareen kar-kardagi ki bunyad hai. Ghoray ka nizam-e-inhazam (digestive system) din bhar halki halki fiber wali khuraak hazam karne ke liye bana hai. Achi quality ka hara chara ya sookhi ghaas (hay) ghoray ke kul wazan ka 1.5% se 2% rozana hona zaroori hai. Misaal ke tor par, 500kg wazan ke ghoray ko rozana 7.5 se 10kg chara darkaar hota hai.",
      "Saaf aur taaza paani har waqt ghoray ki pohanch me hona chahiye. Aik aam ghora din me 20 se 50 liter paani peeta hai, aur garmiyon ya sakht mehnat me yeh miqdaar mazeed barh jati hai. Paani ki kami ghoron me 'Colic' (pet dard) ki sab se bari waja banti hai jo ke janlewa sabit ho sakti hai.",
      "Hara chara bunyadi tawanai deta hai, lekin active stallions, ghaban madiyon (pregnant mares) aur chotay bachedon (foals) ke liye protein aur grains (jaee/oats, jow/barley) aur namak/mineral blocks bohot zaroori hain. Ghoray ki khuraak me tabdeeli hamesha aahista aahista 7 se 10 dino me karein taake pet ke masail aur bimariyon se bacha ja sakay."
    ]
  },
  {
    id: 'f4',
    title: "Pakistan Me Nezabazi Aur Shahi Equine Melay",
    category: "Events",
    author: "Chaudhry Kamran",
    date: "Nov 05, 2026",
    readTime: "5 min read",
    summary: "Punjab aur KPK ke maidanon me dhol ki thaap, tezz tareen gallop aur Nezabazi ke shandar muqablon ki dastaan.",
    image: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&q=80&w=800",
    content: [
      "Nezabazi (Tent Pegging) Pakistan ka qoumi aur saqafati equestrian khel hai jis me ghursawar poori raftaar se gallop karte hue zameen par lagay lakri ke peg ko barchhi (lance) se uthate hain. Yeh khel ghursawar aur ghoray ke darmiyan be-panah rabtay aur yaqeen ki nishani hai.",
      "Faisalabad, Sargodha, Sahiwal, Chakwal aur Hafizabad ke ilaqon me saalana melaon me hazaron shaiqeen jama hote hain jahan Desi aur Nukra ghore apni tezi aur balance ka shandar muzahira karte hain. Dhol ki thaap par ghoron ka nach aur sawaar ki maharat dekhne se taaluq rakhti hai.",
      "Horse-Square Pakistan in tamam riwayati melo aur registered riding clubs ko digitally connect kar raha hai taake har ghursawar aur equine lover ko behtareen platform aur maloomat mil sakay."
    ]
  }
];

export const Blog = () => {
  // Enable scroll reveal animations
  useScrollReveal('.reveal-on-scroll');
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);
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
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            const formatted = data.data.map(a => ({
              ...a,
              id: a._id,
              date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'
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
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Wapis Articles Par Jayein (Back to Articles)
        </button>

        {/* Article Container */}
        <article className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          {/* Header Image */}
          <div className="relative h-52 sm:h-[400px] w-full bg-slate-900">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              className="w-full h-full object-contain object-center opacity-90"
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
            Ghoron ki shandar naslein, vet doctor mashwaray, rozmarra khuraak aur Pakistan ke equine shows par Roman English articles.
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
            placeholder="Articles search karein (Nukra, Anmol, Khuraak)..."
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
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition duration-500"
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
                  <span>Mukammal Article Parhein</span>
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
