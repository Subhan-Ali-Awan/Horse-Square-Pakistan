import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export const SellHorse = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    breed: 'Thoroughbred',
    age: '',
    color: '',
    height: '',
    location: '',
    price: '',
    description: '',
    sellerPhone: user ? user.phone || '' : '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Please login first to list a horse for sale.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (imageFile) {
        data.append('images', imageFile);
      }

      const res = await fetch('/api/horses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const resData = await res.json();
      if (resData.success) {
        setMessage('Your horse listing has been submitted for admin approval!');
        setTimeout(() => navigate('/'), 2500);
      } else {
        setError(resData.message || 'Submission failed.');
      }
    } catch (err) {
      setError('Connection error. Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-up">
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] flex items-center gap-2">
            <PlusCircle className="w-7 h-7 text-[#D4AF37]" /> Sell Your Horse
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Fill in the details below to list your horse on Pakistan's #1 equine marketplace.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" /> {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mb-6 border border-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Horse Name / Title</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Thunder Star"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Breed</label>
              <select
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
              >
                <option value="Thoroughbred">Thoroughbred</option>
                <option value="Arabian">Arabian</option>
                <option value="Marwari">Marwari</option>
                <option value="Andalusian">Andalusian</option>
                <option value="Local / Desi">Local / Desi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Price (PKR)</label>
              <input
                type="number"
                name="price"
                required
                placeholder="e.g. 1500000"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Location / City</label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Lahore"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Age (Years)</label>
              <input
                type="number"
                name="age"
                required
                placeholder="e.g. 4"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Color</label>
              <input
                type="text"
                name="color"
                required
                placeholder="e.g. Chestnut, Black"
                value={formData.color}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Height (Hands / hh)</label>
              <input
                type="text"
                name="height"
                placeholder="e.g. 15.2 hh"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Seller Phone Number</label>
              <input
                type="text"
                name="sellerPhone"
                required
                placeholder="+92 300 1234567"
                value={formData.sellerPhone}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Description & Temperament</label>
            <textarea
              name="description"
              rows="4"
              required
              placeholder="Provide information regarding pedigree, training level, vaccinations, and health status..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm focus:border-[#D4AF37] focus:bg-white transition"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Upload Horse Photo</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100/50 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {imageFile ? imageFile.name : 'Click or drag photo here to upload'}
              </p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-white font-bold text-base rounded-xl shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5 text-amber-400" />
            {loading ? 'Submitting Listing...' : 'Submit Listing For Sale'}
          </button>
        </form>
      </div>
    </div>
  );
};
