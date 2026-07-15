import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0B0F19]/90 backdrop-blur-md border-t border-slate-800/80 text-slate-300 py-6 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-2.5">
          <span className="font-black tracking-tight text-white text-sm sm:text-base">
            Horse-Square <span className="text-[#D4AF37]">Pakistan</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} All Rights Reserved
          </span>
        </div>

        {/* Center: Inline Contact Details */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
          <span>Hafizabad, Punjab, Pakistan</span>
          <span className="text-slate-800 hidden sm:inline">•</span>
          <span>03059901997</span>
          <span className="text-slate-800 hidden sm:inline">•</span>
          <a href="mailto:horsesquarepakistan@gmail.com" className="hover:text-[#D4AF37] transition duration-200">
            horsesquarepakistan@gmail.com
          </a>
        </div>

        {/* Right: Tribute / Credit */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          <span>for Equine Enthusiasts</span>
        </div>

      </div>
    </footer>
  );
};
