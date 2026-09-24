import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, ArrowRight, Compass, Blocks, Palette, Footprints } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES, AGE_CATEGORIES, PLAY_TYPES, PLAYROOM_STORIES } from '../data/categories';
import { ProductCategory, AgeBracket, PlayType } from '../types';

export const Header: React.FC = () => {
  const { 
    navigate, 
    cartCount, 
    wishlistCount, 
    setIsCartOpen, 
    setIsSearchOpen, 
    setQuickFilter,
    currentRoute
  } = useStore();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAgeExpanded, setIsAgeExpanded] = useState(false);
  const [isPlayIntentExpanded, setIsPlayIntentExpanded] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile nav is open and reset collapsible states when closed
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsAgeExpanded(false);
      setIsPlayIntentExpanded(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  // Close mega menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShopClick = () => {
    setIsMegaMenuOpen(prev => !prev);
  };

  const handleCategoryNav = (cat: ProductCategory) => {
    setIsMegaMenuOpen(false);
    setIsMobileNavOpen(false);
    setQuickFilter({ categories: [cat] });
    navigate({ type: 'shop', category: cat });
  };

  const handleAgeNav = (age: AgeBracket) => {
    setIsMegaMenuOpen(false);
    setIsMobileNavOpen(false);
    setQuickFilter({ ageBrackets: [age] });
    navigate({ type: 'shop', age: age });
  };

  const handlePlayNav = (play: PlayType) => {
    setIsMegaMenuOpen(false);
    setIsMobileNavOpen(false);
    setQuickFilter({ playTypes: [play] });
    navigate({ type: 'shop', play: play });
  };

  const handleNewArrivals = () => {
    setIsMegaMenuOpen(false);
    setIsMobileNavOpen(false);
    setQuickFilter({ onSaleOnly: false, bestSellersOnly: false });
    navigate({ type: 'shop' });
  };

  const handleBestSellers = () => {
    setIsMegaMenuOpen(false);
    setIsMobileNavOpen(false);
    setQuickFilter({ bestSellersOnly: true });
    navigate({ type: 'shop' });
  };

  const handleSale = () => {
    setIsMegaMenuOpen(false);
    setIsMobileNavOpen(false);
    setQuickFilter({ onSaleOnly: true });
    navigate({ type: 'shop' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E9E6DC]">
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#19191B] text-[#F4F2EA] text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-6 flex-wrap">
          <span>Free Express Delivery on orders over ₹999</span>
          <span className="hidden md:inline text-[#7A7A80]">•</span>
          <span className="hidden md:inline">100% Non-toxic & Certified Safe Materials</span>
          <span className="hidden md:inline text-[#7A7A80]">•</span>
          <span className="hidden sm:inline">30-Day Gentle Happiness Guarantee</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open mobile navigation"
              className="lg:hidden p-2 -ml-2 text-[#19191B] hover:text-[#D85A38] rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate({ type: 'home' })}
              className="text-left focus:outline-hidden"
              aria-label="Toyora Homepage"
            >
              <Logo />
            </button>
          </div>

          {/* Desktop Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Mega Menu Toggle: Shop */}
            <div className="relative" ref={megaMenuRef}>
              <button
                onClick={handleShopClick}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isMegaMenuOpen ? 'text-[#D85A38] bg-[#FAEEE9]' : 'text-[#19191B] hover:text-[#D85A38]'
                }`}
              >
                <span>Shop</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#D85A38]' : 'text-[#7A7A80]'}`} />
              </button>

              {/* Mega Menu Overlay */}
              {isMegaMenuOpen && (
                <div 
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                  className="absolute top-full left-0 w-[840px] -ml-20 mt-1 bg-white rounded-2xl shadow-xl border border-[#E9E6DC] p-6 grid grid-cols-12 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* Column 1: By Category */}
                  <div className="col-span-4 border-r border-[#F4F2EA] pr-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] mb-3">
                      By Category
                    </div>
                    <ul className="space-y-1.5">
                      {PRODUCT_CATEGORIES.map(category => (
                        <li key={category}>
                          <button
                            onClick={() => handleCategoryNav(category)}
                            className="w-full text-left text-[13px] font-medium text-[#2C2D30] hover:text-[#D85A38] py-1 px-2 rounded-md hover:bg-[#FAF9F5] transition-colors flex items-center justify-between group"
                          >
                            <span>{category}</span>
                            <span className="text-[#A0A0A5] group-hover:text-[#D85A38] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2: By Age */}
                  <div className="col-span-3 border-r border-[#F4F2EA] pr-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] mb-3">
                      By Age Range
                    </div>
                    <ul className="space-y-1.5">
                      {AGE_CATEGORIES.map(age => (
                        <li key={age.bracket}>
                          <button
                            onClick={() => handleAgeNav(age.bracket)}
                            className="w-full text-left text-[13px] font-medium text-[#2C2D30] hover:text-[#D85A38] py-1 px-2 rounded-md hover:bg-[#FAF9F5] transition-colors flex flex-col"
                          >
                            <span className="font-semibold text-[#19191B]">{age.label}</span>
                            <span className="text-[11px] text-[#7A7A80]">{age.range}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: By Play Intent */}
                  <div className="col-span-2 border-r border-[#F4F2EA] pr-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] mb-3">
                      By Play Intent
                    </div>
                    <ul className="space-y-1.5">
                      {PLAY_TYPES.map(play => (
                        <li key={play.type}>
                          <button
                            onClick={() => handlePlayNav(play.type)}
                            className="w-full text-left text-[13px] font-medium text-[#2C2D30] hover:text-[#D85A38] py-1 px-2 rounded-md hover:bg-[#FAF9F5] transition-colors"
                          >
                            {play.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 4: Curated Playroom Feature */}
                  <div className="col-span-3 bg-[#FAF9F5] rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#D85A38] bg-[#FAEEE9] px-2 py-0.5 rounded-full inline-block mb-2">
                        Shop the Playroom
                      </span>
                      <h4 className="font-display font-bold text-sm text-[#19191B] leading-tight mb-1">
                        The Creative Corner
                      </h4>
                      <p className="text-xs text-[#57585C] line-clamp-2 mb-3">
                        Curated art studio kits, wooden building blocks & open-ended play.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        navigate({ type: 'playrooms' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D85A38] hover:text-[#B84323]"
                    >
                      <span>Explore Playrooms</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setQuickFilter({});
                navigate({ type: 'shop' });
              }}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentRoute.type === 'shop' ? 'text-[#D85A38]' : 'text-[#19191B] hover:text-[#D85A38]'
              }`}
            >
              All Toys
            </button>

            <button
              onClick={handleNewArrivals}
              className="px-3 py-2 text-sm font-semibold text-[#19191B] hover:text-[#D85A38] rounded-lg transition-colors"
            >
              New Arrivals
            </button>

            <button
              onClick={handleBestSellers}
              className="px-3 py-2 text-sm font-semibold text-[#19191B] hover:text-[#D85A38] rounded-lg transition-colors"
            >
              Best Sellers
            </button>

            <button
              onClick={() => navigate({ type: 'playrooms' })}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentRoute.type === 'playrooms' ? 'text-[#D85A38]' : 'text-[#19191B] hover:text-[#D85A38]'
              }`}
            >
              Playrooms
            </button>

            <button
              onClick={() => navigate({ type: 'gift-finder' })}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentRoute.type === 'gift-finder' ? 'text-[#D85A38]' : 'text-[#19191B] hover:text-[#D85A38]'
              }`}
            >
              Gift Finder
            </button>

            <button
              onClick={handleSale}
              className="px-3 py-2 text-sm font-bold text-[#D85A38] hover:text-[#B84323] rounded-lg transition-colors"
            >
              Sale
            </button>
          </nav>

          {/* Right Action Tools: Search, Wishlist, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search catalog"
              className="flex items-center gap-2 py-2 px-2.5 sm:px-3 rounded-full text-xs font-medium text-[#57585C] bg-[#F4F2EA] hover:bg-[#E9E6DC] transition-colors"
            >
              <Search className="w-4 h-4 text-[#19191B]" />
              <span className="hidden md:inline text-[#7A7A80]">Search toys...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#7A7A80] bg-white rounded border border-[#D8D4C5]">
                /
              </kbd>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate({ type: 'wishlist' })}
              aria-label={`Wishlist with ${wishlistCount} items`}
              className="relative p-2.5 rounded-full text-[#19191B] hover:text-[#D85A38] hover:bg-[#F4F2EA] transition-colors"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#D85A38] text-[#D85A38]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D85A38] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${cartCount} items`}
              className="relative flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-full bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-start">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            aria-hidden="true"
          />

          {/* Drawer Sheet - Responsive to all phone and tablet viewports */}
          <div 
            className="relative w-[85vw] max-w-[360px] sm:w-[360px] h-[100dvh] max-h-[100dvh] bg-[#FAF9F5] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 box-border"
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
          >
            {/* Fixed Header */}
            <div className="px-4 py-3.5 sm:p-4 border-b border-[#E9E6DC] flex items-center justify-between bg-white shrink-0">
              <Logo />
              <button
                onClick={() => setIsMobileNavOpen(false)}
                aria-label="Close menu"
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#57585C] hover:text-[#19191B] rounded-lg hover:bg-[#FAF9F5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Menu Content Area */}
            <div className="p-4 sm:p-5 space-y-5 flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {/* Quick Search */}
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center gap-2 py-2.5 px-3.5 bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#57585C] shadow-2xs hover:border-[#D85A38] transition-colors"
              >
                <Search className="w-4 h-4 text-[#19191B] shrink-0" />
                <span className="truncate">Search all toys & collections...</span>
              </button>

              {/* Primary Links */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] mb-2">
                  Explore Toyora
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      setQuickFilter({});
                      navigate({ type: 'shop' });
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      currentRoute.type === 'shop' ? 'bg-[#FAEEE9] text-[#D85A38] font-bold' : 'text-[#19191B] hover:bg-white'
                    }`}
                  >
                    All Toys
                  </button>
                  <button
                    onClick={handleNewArrivals}
                    className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-[#19191B] hover:bg-white transition-colors"
                  >
                    New Arrivals
                  </button>
                  <button
                    onClick={handleBestSellers}
                    className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-[#19191B] hover:bg-white transition-colors"
                  >
                    Best Sellers
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      navigate({ type: 'playrooms' });
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      currentRoute.type === 'playrooms' ? 'bg-[#FAEEE9] text-[#D85A38] font-bold' : 'text-[#19191B] hover:bg-white'
                    }`}
                  >
                    Shop the Playroom
                  </button>
                  <button
                    onClick={handleSale}
                    className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-[#D85A38] hover:bg-[#FAEEE9] transition-colors"
                  >
                    On Sale %
                  </button>
                </div>
              </div>

              {/* Shop by Age Collapsible Accordion */}
              <div className="border-b border-[#E9E6DC] pb-4">
                <button
                  onClick={() => setIsAgeExpanded(prev => !prev)}
                  className="w-full flex items-center justify-between py-2 px-1 text-left group min-h-[44px]"
                  aria-expanded={isAgeExpanded}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] group-hover:text-[#19191B] transition-colors">
                    Shop by Age
                  </span>
                  <span className="text-xs font-bold text-[#7A7A80] group-hover:text-[#D85A38] transition-transform duration-200">
                    {isAgeExpanded ? '↑' : '>'}
                  </span>
                </button>
                {isAgeExpanded && (
                  <div className="mt-2.5 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {AGE_CATEGORIES.map(age => (
                      <button
                        key={age.bracket}
                        onClick={() => handleAgeNav(age.bracket)}
                        className="p-2.5 bg-white rounded-xl border border-[#E9E6DC] text-left hover:border-[#D85A38] transition-colors shadow-2xs"
                      >
                        <div className="font-bold text-xs text-[#19191B]">{age.label}</div>
                        <div className="text-[10px] text-[#7A7A80]">{age.range}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Shop by Play Intent Collapsible Accordion */}
              <div className="border-b border-[#E9E6DC] pb-4">
                <button
                  onClick={() => setIsPlayIntentExpanded(prev => !prev)}
                  className="w-full flex items-center justify-between py-2 px-1 text-left group min-h-[44px]"
                  aria-expanded={isPlayIntentExpanded}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] group-hover:text-[#19191B] transition-colors">
                    Shop by Play Intent
                  </span>
                  <span className="text-xs font-bold text-[#7A7A80] group-hover:text-[#D85A38] transition-transform duration-200">
                    {isPlayIntentExpanded ? '↑' : '>'}
                  </span>
                </button>
                {isPlayIntentExpanded && (
                  <div className="mt-2.5 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {PLAY_TYPES.map(play => (
                      <button
                        key={play.type}
                        onClick={() => handlePlayNav(play.type)}
                        className="p-2.5 bg-white rounded-xl border border-[#E9E6DC] text-left hover:border-[#D85A38] transition-colors shadow-2xs flex items-center justify-between"
                      >
                        <span className="font-bold text-xs text-[#19191B]">{play.title}</span>
                        <ArrowRight className="w-3 h-3 text-[#7A7A80] shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories list */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] mb-2">
                  Toy Categories
                </div>
                <div className="space-y-1">
                  {PRODUCT_CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryNav(category)}
                      className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-[#2C2D30] hover:text-[#D85A38] hover:bg-white transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{category}</span>
                      <span className="text-[#A0A0A5] ml-1 shrink-0">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Bottom Info */}
            <div className="p-4 bg-[#F4F2EA] border-t border-[#E9E6DC] text-xs text-[#57585C] shrink-0 flex items-center justify-between">
              <span>Free delivery over ₹999</span>
              <span className="font-semibold text-[#19191B]">30-Day Returns</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
