import React, { useState, useEffect } from 'react';
import { Gavel, Clock, Trophy, ArrowUpRight, ShieldCheck, Sparkles, AlertCircle, TrendingUp, DollarSign, HelpCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Auction = () => {
  const { token } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState({});

  const sampleAuctions = [
    {
      _id: 'auc1',
      horseName: 'Shahzadi (Royal Thoroughbred)',
      currentBid: 3850000,
      startingBid: 2000000,
      endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'live',
      breed: 'Thoroughbred',
      location: 'Lahore Race Club',
      imageUrl: 'https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&q=80&w=600',
      bids: [
        { bidderName: 'Malik Usman', amount: 3850000, time: '10 mins ago' },
        { bidderName: 'Chaudhry Bilal', amount: 3500000, time: '1 hour ago' },
        { bidderName: 'Rana Hammad', amount: 3200000, time: '3 hours ago' }
      ]
    },
    {
      _id: 'auc2',
      horseName: 'Zarrar (Desert Arabian Stallion)',
      currentBid: 4500000,
      startingBid: 2500000,
      endTime: new Date(Date.now() + 86400000 * 4).toISOString(),
      status: 'live',
      breed: 'Arabian',
      location: 'Rawalpindi Stud',
      imageUrl: 'https://images.unsplash.com/photo-1593034510222-0a1fb8c9cd02?auto=format&fit=crop&q=80&w=600',
      bids: [
        { bidderName: 'Sardar Tariq Khan', amount: 4500000, time: '15 mins ago' },
        { bidderName: 'Syed Shahzad', amount: 4200000, time: '2 hours ago' }
      ]
    },
    {
      _id: 'auc3',
      horseName: 'Gul-Khan (Nukra Dancing Champion)',
      currentBid: 5200000,
      startingBid: 3000000,
      endTime: new Date(Date.now() + 86400000 * 1.5).toISOString(),
      status: 'live',
      breed: 'Local / Desi (Nukra)',
      location: 'Sargodha Stud Farm',
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600',
      bids: [
        { bidderName: 'Mian Farhan', amount: 5200000, time: '5 mins ago' },
        { bidderName: 'Malik Faisal', amount: 4900000, time: '40 mins ago' }
      ]
    },
    {
      _id: 'auc4',
      horseName: 'Sultan (Nezabazi Tent-Pegging Winner)',
      currentBid: 2900000,
      startingBid: 1800000,
      endTime: new Date(Date.now() + 86400000 * 3).toISOString(),
      status: 'live',
      breed: 'Local / Desi',
      location: 'Multan Club',
      imageUrl: 'https://images.unsplash.com/photo-1551887196-72e32fad773a?auto=format&fit=crop&q=80&w=600',
      bids: [
        { bidderName: 'Nawabzada Ali', amount: 2900000, time: '30 mins ago' },
        { bidderName: 'Chaudhry Kamran', amount: 2600000, time: '2 hours ago' }
      ]
    }
  ];

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch('/api/auctions?status=live');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            setAuctions(data.data);
          } else {
            setAuctions(sampleAuctions);
          }
        } else {
          setAuctions(sampleAuctions);
        }
      } catch (err) {
        setAuctions(sampleAuctions);
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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up space-y-8">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden gold-gradient-bar">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> High-Stakes Verified Bidding
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <Gavel className="w-8 h-8 text-[#D4AF37]" /> Live Equine Auctions
            </h1>
            <p className="text-slate-300 text-sm font-light max-w-xl">
              Participate in verified, escrow-protected bidding for Pakistan's premier Thoroughbreds, Arabian, and Nukra champion horses.
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-right shrink-0 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Live Auction Status</span>
              <span className="text-xs font-black text-amber-400">Bidding Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: SIDEBAR WIDGETS */}
        <div className="lg:col-span-4 space-y-6">

          {/* WIDGET 1: Auction Rules & Security */}
          <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Escrow Protected Bidding
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                100% Safe
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              All bids are verified with deposit protection. Bids in the final 2 minutes automatically extend the timer by 2 minutes to prevent sniping.
            </p>
          </div>

          {/* WIDGET 2: Bidding Tips & Buyer Guidelines */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b">
              <HelpCircle className="w-4.5 h-4.5 text-[#D4AF37]" /> Bidding Suggestions & Tips
            </h3>
            
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Verify your account phone number before bidding.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Review veterinary health logs in the listing details.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Set your maximum bid early to ensure win margin.</span>
              </li>
            </ul>
          </div>

          {/* WIDGET 3: Auction Metrics */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" /> Today's Auction Metrics
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-600">Total Bids Placed Today</span>
                <span className="font-extrabold text-[#0F172A] text-sm">342 Bids</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="font-semibold text-emerald-800">Highest Bid Won</span>
                <span className="font-extrabold text-emerald-700 text-sm">Rs. 5.2M PKR</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="font-semibold text-amber-800">Seller CNIC Verified</span>
                <span className="font-extrabold text-amber-900 text-xs">100% Verified</span>
              </div>
            </div>
          </div>

          {/* WIDGET 4: Sell Horse at Auction CTA */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-3">
            <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block">
              LIST YOUR HORSE FOR AUCTION
            </span>
            <h4 className="font-extrabold text-sm text-white">Have a Premium Stallion to Auction?</h4>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Submit your stallion or mare for admin approval to feature in next week's live auction.
            </p>
            <Link
              to="/sell"
              className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-2 mt-2"
            >
              <Gavel className="w-4 h-4" />
              <span>Submit Auction Listing</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE AUCTIONS GRID */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading live auctions...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {auctions.map((auc) => (
                <div
                  key={auc._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden hover:border-[#D4AF37] transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden bg-slate-950 flex items-center justify-center group">
                      <img
                        src={auc.image || auc.imageUrl}
                        alt={auc.horseName}
                        className="absolute inset-0 w-full h-full object-cover object-center blur-md opacity-40 scale-110"
                      />
                      <img
                        src={auc.image || auc.imageUrl}
                        alt={auc.horseName}
                        className="relative z-10 max-w-full max-h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#0F172A]/90 text-white text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 backdrop-blur-md shadow border border-slate-700 z-20">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Live Auction
                      </div>
                      <span className="absolute bottom-3 right-3 bg-[#D4AF37] text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded shadow z-20">
                        {auc.breed || 'Verified Breed'}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-[#0F172A] leading-snug">{auc.horseName}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{auc.location || 'Pakistan'}</p>
                      </div>

                      <div className="flex justify-between items-center bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/60">
                        <div>
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Current Highest Bid</p>
                          <p className="text-xl font-black text-[#0F172A] mt-0.5">
                            Rs. {Number(auc.currentBid).toLocaleString('en-PK')}
                          </p>
                        </div>
                        <Trophy className="w-7 h-7 text-[#D4AF37]" />
                      </div>

                      {auc.bids && auc.bids.length > 0 && (
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Recent Bidders</p>
                          <div className="space-y-1.5">
                            {auc.bids.slice(0, 2).map((b, idx) => (
                              <div key={idx} className="flex justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="font-semibold text-slate-700">{b.bidderName}</span>
                                <span className="font-bold text-[#0F172A]">Rs. {Number(b.amount).toLocaleString('en-PK')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
                    <div className="flex gap-2.5 mt-4">
                      <input
                        type="number"
                        placeholder={`Min Rs. ${(auc.currentBid + 50000).toLocaleString('en-PK')}`}
                        value={bidAmount[auc._id] || ''}
                        onChange={(e) => setBidAmount({ ...bidAmount, [auc._id]: e.target.value })}
                        className="flex-1 p-3 border border-slate-300 rounded-2xl text-xs bg-slate-50 focus:outline-none focus:border-[#D4AF37] font-semibold"
                      />
                      <button
                        onClick={() => handlePlaceBid(auc._id, auc.currentBid)}
                        className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold px-4 py-3 rounded-2xl text-xs transition shadow flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <span>Bid</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
