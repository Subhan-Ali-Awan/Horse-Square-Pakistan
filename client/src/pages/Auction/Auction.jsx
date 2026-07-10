import React, { useState, useEffect } from 'react';
import { Gavel, Clock, Trophy, ArrowUpRight } from 'lucide-react';
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
      currentBid: 3500000,
      startingBid: 2000000,
      endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'live',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
      bids: [
        { bidderName: 'Malik Usman', amount: 3500000, time: '10 mins ago' },
        { bidderName: 'Chaudhry Bilal', amount: 3200000, time: '1 hour ago' }
      ]
    },
    {
      _id: 'auc2',
      horseName: 'Zarrar (Desert Stallion)',
      currentBid: 4200000,
      startingBid: 2500000,
      endTime: new Date(Date.now() + 86400000 * 4).toISOString(),
      status: 'live',
      imageUrl: 'https://images.unsplash.com/photo-1598974357801-cbca10065a71?auto=format&fit=crop&q=80&w=600',
      bids: [
        { bidderName: 'Rana Hammad', amount: 4200000, time: '25 mins ago' }
      ]
    }
  ];

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch('/api/auctions?status=live');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.auctions && data.auctions.length > 0) {
            setAuctions(data.auctions);
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
      alert(`Please enter a bid higher than current bid (Rs. ${currentPrice.toLocaleString()})`);
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
        // update UI
        setAuctions(auctions.map(a => a._id === auctionId ? { ...a, currentBid: amount } : a));
      } else {
        alert(data.message || 'Error placing bid');
      }
    } catch (err) {
      alert('Simulated bid recorded! (Backend connection pending)');
      setAuctions(auctions.map(a => a._id === auctionId ? { ...a, currentBid: amount } : a));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up">
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white mb-8 shadow-xl relative overflow-hidden gold-gradient-bar">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Gavel className="w-8 h-8 text-[#D4AF37]" /> Live Equine Auctions
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Participate in verified, high-stakes bidding for Pakistan's finest bloodlines.
            </p>
          </div>
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Bidding Active
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading live auctions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {auctions.map((auc) => (
            <div
              key={auc._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:border-[#D4AF37] transition group flex flex-col justify-between"
            >
              <div>
                <div className="relative">
                  <img
                    src={auc.imageUrl}
                    alt={auc.horseName}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#0F172A]/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Ends Soon
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">{auc.horseName}</h3>
                  <div className="flex justify-between items-center bg-amber-50 p-4 rounded-xl border border-amber-200/60 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Current Highest Bid</p>
                      <p className="text-2xl font-bold text-[#0F172A] mt-0.5">
                        Rs. {Number(auc.currentBid).toLocaleString('en-PK')}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-[#D4AF37]" />
                  </div>

                  {auc.bids && auc.bids.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Recent Bids</p>
                      <div className="space-y-1.5">
                        {auc.bids.slice(0, 2).map((b, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                            <span>{b.bidderName}</span>
                            <span className="font-bold text-slate-800">Rs. {Number(b.amount).toLocaleString('en-PK')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
                <div className="flex gap-3 mt-4">
                  <input
                    type="number"
                    placeholder={`Min Rs. ${auc.currentBid + 50000}`}
                    value={bidAmount[auc._id] || ''}
                    onChange={(e) => setBidAmount({ ...bidAmount, [auc._id]: e.target.value })}
                    className="flex-1 p-3 border border-slate-300 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={() => handlePlaceBid(auc._id, auc.currentBid)}
                    className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow flex items-center gap-1.5"
                  >
                    Place Bid <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
