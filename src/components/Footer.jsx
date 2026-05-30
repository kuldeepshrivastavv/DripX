import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ShieldCheck, RefreshCw, Smartphone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-900 pt-16 pb-28 md:pb-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Branding Section */}
        <div className="flex flex-col gap-4">
          <Link to="/" id="footer-logo-link" className="flex items-center gap-2 w-max">
            <span className="bg-gradient-to-r from-neonGreen to-emerald-400 text-black font-extrabold px-3 py-1 rounded-lg text-lg tracking-wider shadow-[0_0_10px_rgba(99,102,241,0.3)]">
              DRIP X
            </span>
          </Link>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
            Hyperlocal peer-to-peer and shop-to-user premium fashion rentals. Wear your dream fit today, return it tomorrow.
          </p>
        </div>

        {/* Features Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-xs uppercase font-extrabold tracking-widest text-neutral-300">
            Drip Network
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <MapPin className="w-4 h-4 text-neonGreen" />
              <span>Hyperlocal 3KM radius</span>
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4 text-neonGreen" />
              <span>Drip Insurance Guaranteed</span>
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4 text-neonGreen" />
              <span>Eco-friendly dry-cleaned</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-xs uppercase font-extrabold tracking-widest text-neutral-300">
            Quick Navigation
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-neutral-400 font-semibold">
            <li>
              <Link to="/?auth=login" id="footer-nav-login" className="hover:text-neonGreen transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link to="/?auth=signup" id="footer-nav-signup" className="hover:text-neonGreen transition-colors">
                Signup
              </Link>
            </li>
            <li>
              <a href="#about" id="footer-nav-about" className="hover:text-neonGreen transition-colors">
                About Platform
              </a>
            </li>
          </ul>
        </div>

        {/* Signup / Fun Alert */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-xs uppercase font-extrabold tracking-widest text-neutral-300">
            Experience Now
          </h3>
          <p className="text-neutral-400 text-sm">
            Experience mobile-first high luxury rentals in a click.
          </p>
          <div className="flex gap-2">
            <Link 
              to="/?auth=signup" 
              id="footer-cta-btn" 
              className="bg-neonGreen text-black font-extrabold text-xs px-4 py-2.5 rounded-xl text-center shadow-[0_0_10px_rgba(99,102,241,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transform hover:-translate-y-0.5 transition-all w-full"
            >
              🚀 Explore Closet
            </Link>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 font-bold uppercase tracking-wider">
        <span>© {new Date().getFullYear()} DripX Inc. All Rights Reserved.</span>
        <span className="flex items-center gap-1 hover:text-white cursor-pointer">
          <Smartphone className="w-3.5 h-3.5 text-neonGreen" />
          Optimized for Mobile First Web Experience
        </span>
      </div>
    </footer>
  );
}
