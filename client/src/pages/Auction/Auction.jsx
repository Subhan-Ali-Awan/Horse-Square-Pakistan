import React, { useState, useEffect } from 'react';
import { Gavel, Clock, Trophy, ArrowUpRight, ShieldCheck, Sparkles, AlertCircle, TrendingUp, DollarSign, HelpCircle, CheckCircle, CheckCircle2, UserCheck, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Auction = () => {
  const { token } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState({});

  const formatImgUrl = (url) => {
    if (!url) return '/uploads/media__1785445045636.jpg';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return url;
    if (url.startsWith('uploads/')) return '/' + url;
    return '/uploads/' + url;
  };

  // Dynamic Live Auctions state initialized from API
  const sampleAuctions = [];

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch('/api/auctions?status=live');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setAuctions(data.data);
            return;
          }
        }
        setAuctions([]);
      } catch (err) {
        console.error("Failed to fetch live auctions from API:", err);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const handlePlaceBid = async (auctionId, currentPrice) => {
    const amount = Number(bidAmount[auctionId]);
    if (!amount || amount <= currentPrice) {
      alert(`Please enter a bid higher than current bid (Rs. ${currentPrice.toLocaleString('en-PK')})`);
      return;
    }

    if (!token) {
      alert('Please login to place a bid.');
      return;
    }

    try {
      const res = await fetch(`/api/auctions/${auctionId}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (data.success) {
        alert('Bid placed successfully!');
        if (data.data) {
          setAuctions(auctions.map(a => a._id === auctionId ? data.data : a));
        } else {
          setAuctions(auctions.map(a => a._id === auctionId ? { ...a, currentBid: amount } : a));
        }
        setBidAmount({ ...bidAmount, [auctionId]: '' });
      } else {
        alert(data.message || 'Error placing bid');
      }
    } catch (err) {
      alert('Network error. Failed to communicate with the auction server.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-up">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" /> High-Stakes Verified Bidding
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Live Equine Auctions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-light">
              Participate in verified, escrow-protected bidding for Pakistan's premier Thoroughbreds, Arabian, and Nukra champion horses.
            </p>
          </div>

          <div className="p-3 sm:p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-right w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-start gap-3 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Live Auction Status</span>
              <span className="text-xs font-black text-amber-400">Bidding Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

        {/* LEFT COLUMN: SIDEBAR WIDGETS (4 COLS - Order last on mobile so auction cards are top priority) */}
        <div className="lg:col-span-4 space-y-6 order-last lg:order-none">

          {/* WIDGET 1: Auction Rules & Security */}
          <div className="bg-gradient-to-br from-[#0B0F19] via-slate-900 to-[#0F172A] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#D4AF37]" /> Escrow Protected Bidding
              </h3>
              <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                100% Safe
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              All bids are verified with deposit protection. Bids in the final 2 minutes automatically extend the timer by 2 minutes to prevent sniping.
            </p>
          </div>

          {/* WIDGET 2: Bidding Tips & Buyer Guidelines */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <HelpCircle className="w-4.5 h-4.5 text-[#D4AF37]" /> Bidding Suggestions & Tips
            </h3>

            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Verify your account phone number before bidding.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Review veterinary health logs in the listing details.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Set your maximum bid early to ensure win margin.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 3: Auction Metrics */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" /> Today's Auction Metrics
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-600">Total Bids Placed Today</span>
                <span className="font-black text-[#0F172A] text-xs sm:text-sm">342 Bids</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl sm:rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="font-bold text-emerald-800">Highest Bid Won</span>
                <span className="font-black text-emerald-700 text-xs sm:text-sm">Rs. 5.2M PKR</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="font-bold text-amber-800">Seller CNIC Verified</span>
                <span className="font-black text-amber-900 text-xs">100% Verified</span>
              </div>
            </div>
          </div>

          {/* WIDGET 4: Sell Horse at Auction CTA */}
          <div className="bg-gradient-to-br from-[#0B0F19] via-slate-900 to-[#0F172A] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
            <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block">
              LIST YOUR HORSE FOR AUCTION
            </span>
            <h4 className="font-black text-sm sm:text-base text-white">Have a Premium Stallion or Mare to Auction?</h4>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Submit your stallion or mare for admin approval to feature in next week's live auction.
            </p>
            <Link
              to="/sell"
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8860B] hover:from-[#C9A227] text-slate-950 font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <Gavel className="w-4 h-4 text-slate-950" />
              <span>Submit Auction Listing</span>
              <ArrowUpRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE AUCTIONS GRID (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-bold">Loading live auctions...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {auctions.map((auc) => {
                const mainImg = formatImgUrl(auc.image || auc.imageUrl);
                return (
                  <div
                    key={auc._id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden hover:border-[#D4AF37] transition duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header Zone */}
                      <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-950">
                        <img
                          src={mainImg}
                          alt={auc.horseName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-slate-950 text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-amber-500/30 flex items-center gap-1.5 shadow">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> Live Auction
                        </div>
                        <span className="absolute top-3 right-3 bg-[#D4AF37] text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-lg sm:rounded-xl shadow">
                          {auc.breed || 'Verified Breed'}
                        </span>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-[#0F172A] leading-snug line-clamp-1">{auc.horseName}</h3>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">{auc.location || 'Pakistan'}</p>
                        </div>

                        {/* Current Highest Bid Banner */}
                        <div className="bg-gradient-to-r from-slate-900 to-[#0F172A] text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 flex justify-between items-center shadow-inner">
                          <div>
                            <p className="text-[9px] sm:text-[10px] font-bold text-amber-300 uppercase tracking-wider">Current Highest Bid</p>
                            <p className="text-lg sm:text-xl font-black text-[#D4AF37] mt-0.5">
                              Rs. {Number(auc.currentBid).toLocaleString('en-PK')}
                            </p>
                          </div>
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        </div>

                        {/* Recent Bidders Table */}
                        {auc.bids && auc.bids.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Recent Bidders</p>
                            <div className="space-y-1.5">
                              {auc.bids.slice(0, 2).map((b, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs text-slate-600 bg-slate-50 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-100">
                                  <span className="font-bold text-slate-700 truncate max-w-[120px]">{b.bidderName}</span>
                                  <span className="font-black text-[#0F172A] shrink-0">Rs. {Number(b.amount).toLocaleString('en-PK')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bid Input & Place Bid Action - Prominent & Enlarged */}
                    <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 mt-auto">
                      <div className="flex flex-col sm:flex-row gap-2.5 pt-3 sm:pt-4">
                        <input
                          type="number"
                          placeholder={`Min Rs. ${(auc.currentBid + 50000).toLocaleString('en-PK')}`}
                          value={bidAmount[auc._id] || ''}
                          onChange={(e) => setBidAmount({ ...bidAmount, [auc._id]: e.target.value })}
                          className="w-full sm:flex-1 p-3.5 sm:p-4 border border-slate-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-white transition shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handlePlaceBid(auc._id, auc.currentBid)}
                          className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8860B] hover:from-[#C9A227] text-slate-950 font-black px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                        >
                          <Gavel className="w-4 h-4 text-slate-950" />
                          <span>Place Bid</span>
                          <ArrowUpRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
