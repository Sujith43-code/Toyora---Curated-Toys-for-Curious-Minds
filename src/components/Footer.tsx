import React from 'react';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';
import { AGE_CATEGORIES } from '../data/categories';
import { ShieldCheck, Lightbulb, RefreshCw, HeartHandshake } from 'lucide-react';
import { AgeBracket } from '../types';

export const Footer: React.FC = () => {
  const { navigate, setQuickFilter } = useStore();

  const handleAgeClick = (bracket: AgeBracket) => {
    setQuickFilter({ ageBrackets: [bracket] });
    navigate({ type: 'shop', age: bracket });
  };

  return (
    <footer className="bg-[#19191B] text-[#FAF9F5] pt-14 pb-10 border-t border-[#2C2D30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#2C2D30]">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2C2D30] flex items-center justify-center text-[#D85A38] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-white">100% Certified Safe</h4>
              <p className="text-[11px] text-[#A0A0A5] mt-0.5">BIS, ASTM & CE tested non-toxic materials.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2C2D30] flex items-center justify-center text-[#D85A38] flex-shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-white">Curated Child Growth</h4>
              <p className="text-[11px] text-[#A0A0A5] mt-0.5">Selected with child educators for real developmental play.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2C2D30] flex items-center justify-center text-[#D85A38] flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-white">30-Day Gentle Return</h4>
              <p className="text-[11px] text-[#A0A0A5] mt-0.5">Hassle-free replacement if your child doesn’t adore it.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2C2D30] flex items-center justify-center text-[#D85A38] flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-white">Sustainable Beech & Fiber</h4>
              <p className="text-[11px] text-[#A0A0A5] mt-0.5">FSC wood, water-based stains & plastic-free packaging.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-[#2C2D30]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="light" />
            <p className="text-xs text-[#A0A0A5] max-w-sm leading-relaxed">
              Toyora is a carefully curated toy shop designed around playful discovery, age-based browsing, educational collections, and parent confidence. Built for curious minds and timeless childhood memories.
            </p>
            <div className="text-xs text-[#7A7A80] pt-1">
              Dispatching daily across India • Free express shipping over ₹999
            </div>
          </div>

          {/* Shop Pathways */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Shop
            </h5>
            <ul className="space-y-2 text-xs text-[#A0A0A5]">
              <li>
                <button
                  onClick={() => {
                    setQuickFilter({});
                    navigate({ type: 'shop' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Toys
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setQuickFilter({ onSaleOnly: false });
                    navigate({ type: 'shop' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setQuickFilter({ bestSellersOnly: true });
                    navigate({ type: 'shop' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'playrooms' })}
                  className="hover:text-white transition-colors"
                >
                  Shop the Playroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'gift-finder' })}
                  className="text-[#D85A38] hover:text-[#FAEEE9] font-medium transition-colors"
                >
                  Gift Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setQuickFilter({ onSaleOnly: true });
                    navigate({ type: 'shop' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Special Offers
                </button>
              </li>
            </ul>
          </div>

          {/* Browse by Age */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Shop by Age
            </h5>
            <ul className="space-y-2 text-xs text-[#A0A0A5]">
              {AGE_CATEGORIES.map(age => (
                <li key={age.bracket}>
                  <button
                    onClick={() => handleAgeClick(age.bracket)}
                    className="hover:text-white transition-colors flex items-center justify-between w-full pr-4"
                  >
                    <span>{age.label}</span>
                    <span className="text-[10px] text-[#7A7A80]">{age.range}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Support
            </h5>
            <ul className="space-y-2 text-xs text-[#A0A0A5]">
              <li>
                <span className="block text-white font-medium">Customer Care</span>
                <span className="text-[11px] text-[#7A7A80]">care@toyora.in</span>
              </li>
              <li>
                <span className="block text-white font-medium">Helpline</span>
                <span className="text-[11px] text-[#7A7A80]">Mon–Sat: 9am – 7pm</span>
              </li>
              <li>
                <span className="block text-white font-medium">Safety Guarantee</span>
                <span className="text-[11px] text-[#7A7A80]">BIS IS-9873 Compliant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7A80]">
          <div>
            © 2026 Toyora. Curated toys for curious minds. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ type: 'admin' })}
              className="text-[#7A7A80] hover:text-[#A0A0A5] transition-colors text-[11px]"
            >
              Store Administration
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
