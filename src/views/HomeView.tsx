import React, { useState } from 'react';
import { ArrowRight, Gift, Star, ShieldCheck, Heart, Award, ArrowUpRight, Check, Compass, Blocks, Palette, Footprints, Baby, Lightbulb } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { AGE_CATEGORIES, PLAY_TYPES, PLAYROOM_STORIES } from '../data/categories';
import { AgeBracket, PlayType } from '../types';

export const HomeView: React.FC = () => {
  const { products, navigate, setQuickFilter, addToCart } = useStore();

  // Active shopping path tab (Age vs Play)
  const [activePathTab, setActivePathTab] = useState<'age' | 'play'>('age');

  // Gift finder mini-state on home
  const [giftAge, setGiftAge] = useState<AgeBracket>('3-5');
  const [giftPlay, setGiftPlay] = useState<PlayType>('Build');
  const [giftBudget, setGiftBudget] = useState<'under-1000' | '1000-2000' | 'all'>('all');

  // Filtered collections
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival || p.isStaffPick).slice(0, 4);
  const affordableGifts = products.filter(p => p.price <= 1200).slice(0, 4);

  // Dynamic gift recommendation calculation
  const giftRecommendations = products.filter(p => {
    const ageMatch = p.ageBracket === giftAge;
    const playMatch = p.playType === giftPlay;
    let budgetMatch = true;
    if (giftBudget === 'under-1000') budgetMatch = p.price < 1000;
    if (giftBudget === '1000-2000') budgetMatch = p.price >= 1000 && p.price <= 2000;
    return ageMatch && (playMatch || budgetMatch);
  }).slice(0, 3);

  const handleAgeClick = (bracket: AgeBracket) => {
    setQuickFilter({ ageBrackets: [bracket] });
    navigate({ type: 'shop', age: bracket });
  };

  const handlePlayClick = (play: PlayType) => {
    setQuickFilter({ playTypes: [play] });
    navigate({ type: 'shop', play: play });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. EDITORIAL HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="bg-[#F4F2EA] rounded-3xl border border-[#E9E6DC] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          
          {/* Left: Brand Message & Direct Actions */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-[#D85A38] border border-[#E9E6DC]">
                <span>Modern Curated Play</span>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#19191B] leading-[1.12] tracking-tight">
                Toys for curious minds.
              </h1>

              <p className="text-sm sm:text-base text-[#57585C] max-w-md leading-relaxed">
                Find something they'll love, learn from, and come back to. Carefully curated open-ended wooden toys, tactile STEM kits, and certified safe materials.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setQuickFilter({});
                    navigate({ type: 'shop' });
                  }}
                  className="px-6 py-3.5 rounded-xl font-display font-bold text-sm tracking-wide bg-[#19191B] hover:bg-[#D85A38] text-white transition-all duration-200 shadow-md flex items-center gap-2 group"
                >
                  <span>Shop All Toys</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate({ type: 'gift-finder' })}
                  className="px-6 py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide bg-white hover:bg-[#FAF9F5] text-[#19191B] border border-[#D8D4C5] transition-colors"
                >
                  Find a Gift
                </button>
              </div>

              {/* Trust Subtext */}
              <div className="flex items-center gap-4 text-xs text-[#7A7A80] pt-2">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> BIS Certified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Non-Toxic
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Free Shipping ₹999+
                </span>
              </div>
            </div>
          </div>

          {/* Right: Curated Campaign Visual */}
          <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-auto bg-[#E9E6DC]">
            <img
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80"
              alt="Curated wooden rainbow stacker and open-ended educational toys on an oak playroom shelf"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Subtle floating feature badge */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E9E6DC] shadow-lg max-w-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D85A38]">
                Featured Playroom
              </div>
              <div className="font-display font-bold text-sm text-[#19191B]">
                Sensory & Wooden Studio
              </div>
              <p className="text-[11px] text-[#57585C] mt-0.5">
                Calm beechwood arches & non-toxic botanical colors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOPPING PATHS (WHAT ARE YOU LOOKING FOR?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#D85A38] mb-1">
              Structured Discovery
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
              What are you looking for?
            </h2>
          </div>

          {/* Path Toggle: By Age vs By Play Intent */}
          <div className="inline-flex bg-[#E9E6DC] p-1 rounded-xl">
            <button
              onClick={() => setActivePathTab('age')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activePathTab === 'age'
                  ? 'bg-white text-[#19191B] shadow-xs'
                  : 'text-[#57585C] hover:text-[#19191B]'
              }`}
            >
              Shop by Age
            </button>
            <button
              onClick={() => setActivePathTab('play')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activePathTab === 'play'
                  ? 'bg-white text-[#19191B] shadow-xs'
                  : 'text-[#57585C] hover:text-[#19191B]'
              }`}
            >
              Shop by Play Intent
            </button>
          </div>
        </div>

        {/* Tab 1: Shop by Age Grid */}
        {activePathTab === 'age' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {AGE_CATEGORIES.map(age => (
              <div
                key={age.bracket}
                onClick={() => handleAgeClick(age.bracket)}
                className="group bg-white p-4 sm:p-5 rounded-2xl border border-[#E9E6DC] hover:border-[#D85A38] transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md"
              >
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-[#F4F2EA]">
                    <img
                      src={age.image}
                      alt={age.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="font-display font-bold text-base sm:text-lg text-[#19191B] group-hover:text-[#D85A38] transition-colors">
                    {age.label}
                  </div>
                  <div className="text-xs font-medium text-[#7A7A80]">
                    {age.range}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#F4F2EA] flex items-center justify-between text-[11px] font-semibold text-[#57585C] group-hover:text-[#D85A38]">
                  <span>{age.milestoneTag}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Shop by Play Intent Grid */}
        {activePathTab === 'play' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {PLAY_TYPES.map(play => (
              <div
                key={play.type}
                onClick={() => handlePlayClick(play.type)}
                className="group bg-white p-5 rounded-2xl border border-[#E9E6DC] hover:border-[#D85A38] transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FAEEE9] text-[#D85A38] flex items-center justify-center mb-3">
                    {play.type === 'Build' && <Blocks className="w-5 h-5" />}
                    {play.type === 'Create' && <Palette className="w-5 h-5" />}
                    {play.type === 'Explore' && <Compass className="w-5 h-5" />}
                    {play.type === 'Imagine' && <Lightbulb className="w-5 h-5" />}
                    {play.type === 'Move' && <Footprints className="w-5 h-5" />}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#19191B] group-hover:text-[#D85A38] transition-colors">
                    {play.title}
                  </h3>
                  <p className="text-xs text-[#57585C] mt-1.5 leading-relaxed">
                    {play.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#F4F2EA] text-xs font-semibold text-[#D85A38] flex items-center justify-between">
                  <span>Browse {play.title}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#D85A38] mb-1">
              Customer Favorites
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => {
              setQuickFilter({ bestSellersOnly: true });
              navigate({ type: 'shop' });
            }}
            className="text-xs sm:text-sm font-bold text-[#19191B] hover:text-[#D85A38] flex items-center gap-1"
          >
            <span>View all best sellers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4-column product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. "SHOP THE PLAYROOM" CURATED EXPERIENCE (Melissa & Doug Inspired) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F5] border border-[#E9E6DC] rounded-3xl p-6 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D85A38] bg-[#FAEEE9] px-2.5 py-1 rounded-full inline-block mb-2">
              Curated Environments
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
              Shop the Playroom
            </h2>
            <p className="text-xs sm:text-sm text-[#57585C] mt-1.5">
              Discover toys thoughtfully paired together in real play contexts rather than isolated boxes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Playroom 1: The Creative Corner */}
            <div className="bg-white rounded-2xl border border-[#E9E6DC] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/9] bg-[#F4F2EA]">
                <img
                  src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80"
                  alt="The Creative Corner playroom set"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#19191B]/85 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  Age 3–10 Years
                </div>
              </div>
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#19191B]">
                    The Creative Corner
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57585C] mt-1.5 leading-relaxed">
                    A curated collection for little makers, watercolor artists, and magnetic architects.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-[#FAF9F5] text-xs font-medium text-[#2C2D30] rounded-md border border-[#E9E6DC]">
                      100-Pc Magnetic Builder
                    </span>
                    <span className="px-2.5 py-1 bg-[#FAF9F5] text-xs font-medium text-[#2C2D30] rounded-md border border-[#E9E6DC]">
                      Botanical Watercolor Studio
                    </span>
                    <span className="px-2.5 py-1 bg-[#FAF9F5] text-xs font-medium text-[#2C2D30] rounded-md border border-[#E9E6DC]">
                      Kinetic Marble Cascade
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F4F2EA] flex items-center justify-between">
                  <button
                    onClick={() => navigate({ type: 'playrooms' })}
                    className="text-xs sm:text-sm font-bold text-[#D85A38] hover:text-[#B84323] flex items-center gap-1.5"
                  >
                    <span>Shop this Playroom Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Playroom 2: The Adventure Shelf */}
            <div className="bg-white rounded-2xl border border-[#E9E6DC] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/9] bg-[#F4F2EA]">
                <img
                  src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80"
                  alt="The Adventure Shelf collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#19191B]/85 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  Age 5–14 Years
                </div>
              </div>
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#19191B]">
                    The Adventure Shelf
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57585C] mt-1.5 leading-relaxed">
                    For curious scientists who explore backyard ecosystems, solar robotics, and mechanical mazes.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-[#FAF9F5] text-xs font-medium text-[#2C2D30] rounded-md border border-[#E9E6DC]">
                      40x Optical Wooden Scope
                    </span>
                    <span className="px-2.5 py-1 bg-[#FAF9F5] text-xs font-medium text-[#2C2D30] rounded-md border border-[#E9E6DC]">
                      Solar Mars Rover Lab
                    </span>
                    <span className="px-2.5 py-1 bg-[#FAF9F5] text-xs font-medium text-[#2C2D30] rounded-md border border-[#E9E6DC]">
                      Nature Forager Backpack
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F4F2EA] flex items-center justify-between">
                  <button
                    onClick={() => navigate({ type: 'playrooms' })}
                    className="text-xs sm:text-sm font-bold text-[#D85A38] hover:text-[#B84323] flex items-center gap-1.5"
                  >
                    <span>Shop this Playroom Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE GIFT DISCOVERY WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#19191B] text-white rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="max-w-xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#2C2D30] text-[#D85A38] mb-3">
              <Gift className="w-3.5 h-3.5" />
              <span>Smart Gift Finder</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Who are you shopping for?
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0A5] mt-1">
              Select age, play style, and budget to get instant curated toy recommendations.
            </p>
          </div>

          {/* Interactive Selectors Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-[#222226] p-4 rounded-2xl border border-[#333338]">
            {/* Age Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A0A0A5] block mb-2">
                1. Child's Age
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['0-2', '3-5', '6-8', '9-12', '12+'] as AgeBracket[]).map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setGiftAge(a)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                      giftAge === a
                        ? 'bg-[#D85A38] text-white'
                        : 'bg-[#2C2D30] text-[#E9E6DC] hover:bg-[#38383D]'
                    }`}
                  >
                    {a} yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Play Style Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A0A0A5] block mb-2">
                2. Play Interest
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Build', 'Create', 'Explore', 'Imagine', 'Move'] as PlayType[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setGiftPlay(p)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                      giftPlay === p
                        ? 'bg-[#D85A38] text-white'
                        : 'bg-[#2C2D30] text-[#E9E6DC] hover:bg-[#38383D]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A0A0A5] block mb-2">
                3. Budget
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setGiftBudget('under-1000')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                    giftBudget === 'under-1000'
                      ? 'bg-[#D85A38] text-white'
                      : 'bg-[#2C2D30] text-[#E9E6DC] hover:bg-[#38383D]'
                  }`}
                >
                  &lt; ₹1,000
                </button>
                <button
                  type="button"
                  onClick={() => setGiftBudget('1000-2000')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                    giftBudget === '1000-2000'
                      ? 'bg-[#D85A38] text-white'
                      : 'bg-[#2C2D30] text-[#E9E6DC] hover:bg-[#38383D]'
                  }`}
                >
                  ₹1k–₹2k
                </button>
                <button
                  type="button"
                  onClick={() => setGiftBudget('all')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                    giftBudget === 'all'
                      ? 'bg-[#D85A38] text-white'
                      : 'bg-[#2C2D30] text-[#E9E6DC] hover:bg-[#38383D]'
                  }`}
                >
                  Any
                </button>
              </div>
            </div>
          </div>

          {/* Instant Recommendations Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#A0A0A5]">
                Matching recommendations for <strong className="text-white">{giftAge} years</strong> in <strong className="text-white">{giftPlay}</strong>:
              </span>
              <button
                onClick={() => {
                  setQuickFilter({ ageBrackets: [giftAge], playTypes: [giftPlay] });
                  navigate({ type: 'shop' });
                }}
                className="text-xs font-bold text-[#D85A38] hover:underline"
              >
                Browse all matches →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {giftRecommendations.map(product => (
                <div
                  key={product.id}
                  onClick={() => navigate({ type: 'product', id: product.id })}
                  className="bg-white text-[#19191B] p-3.5 rounded-xl border border-transparent hover:border-[#D85A38] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#F4F2EA] mb-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#7A7A80] mb-1">
                      <span className="font-semibold text-[#19191B]">{product.ageDisplay}</span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-current" /> {product.rating}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-[#19191B] line-clamp-1 group-hover:text-[#D85A38]">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F4F2EA] flex items-center justify-between">
                    <span className="font-display font-bold text-base text-[#19191B]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1, true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#D85A38] mb-1">
              Fresh In Store
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setQuickFilter({});
              navigate({ type: 'shop' });
            }}
            className="text-xs sm:text-sm font-bold text-[#19191B] hover:text-[#D85A38] flex items-center gap-1"
          >
            <span>Explore all new toys</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. PARENT CONFIDENCE & SAFETY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4F2EA] rounded-3xl p-8 sm:p-12 border border-[#E9E6DC] grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D85A38] shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#19191B]">
              Certified Safe & Non-Toxic
            </h3>
            <p className="text-xs text-[#57585C] leading-relaxed">
              Every toy is evaluated against international safety standards (BIS IS-9873, ASTM F963, EN71). Finished with smooth sanded edges and organic, water-based dyes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D85A38] shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#19191B]">
              Open-Ended Play Purpose
            </h3>
            <p className="text-xs text-[#57585C] leading-relaxed">
              We curate toys that encourage open exploration, spatial intuition, problem-solving, and imaginative creativity without flashing lights or noisy batteries.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D85A38] shadow-xs">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#19191B]">
              30-Day Gentle Return Policy
            </h3>
            <p className="text-xs text-[#57585C] leading-relaxed">
              If an unopened toy isn't the right fit for your family, enjoy simple 30-day returns and prompt customer support.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
