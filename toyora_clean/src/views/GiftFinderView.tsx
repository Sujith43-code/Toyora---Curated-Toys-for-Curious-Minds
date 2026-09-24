import React, { useState } from 'react';
import { Gift, ArrowRight, RotateCcw, Check, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AGE_CATEGORIES, PLAY_TYPES } from '../data/categories';
import { AgeBracket, PlayType, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const GiftFinderView: React.FC = () => {
  const { products, addToCart, navigate } = useStore();

  const [selectedAge, setSelectedAge] = useState<AgeBracket | 'all'>('3-5');
  const [selectedPlay, setSelectedPlay] = useState<PlayType | 'all'>('all');
  const [budgetTier, setBudgetTier] = useState<'under-1000' | '1000-2500' | 'over-2500' | 'any'>('any');
  const [occasion, setOccasion] = useState<'birthday' | 'milestone' | 'holiday' | 'any'>('birthday');

  // Filter products based on gift criteria
  const giftMatches = products.filter(p => {
    // Age check
    if (selectedAge !== 'all' && p.ageBracket !== selectedAge) {
      return false;
    }

    // Play check
    if (selectedPlay !== 'all' && p.playType !== selectedPlay) {
      return false;
    }

    // Budget check
    if (budgetTier === 'under-1000' && p.price >= 1000) return false;
    if (budgetTier === '1000-2500' && (p.price < 1000 || p.price > 2500)) return false;
    if (budgetTier === 'over-2500' && p.price <= 2500) return false;

    return true;
  });

  const handleReset = () => {
    setSelectedAge('all');
    setSelectedPlay('all');
    setBudgetTier('any');
    setOccasion('any');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#FAEEE9] text-[#D85A38]">
          <Gift className="w-3.5 h-3.5" />
          <span>Curated Gift Discovery</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#19191B]">
          Find the Perfect Gift in Seconds
        </h1>
        <p className="text-xs sm:text-sm text-[#57585C]">
          Answer a few quick questions to discover certified safe, deeply engaging toys suited to their exact developmental stage.
        </p>
      </div>

      {/* Interactive Questionnaire Box */}
      <div className="bg-white rounded-3xl border border-[#E9E6DC] p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* Step 1: Age */}
        <div>
          <label className="font-display font-bold text-sm text-[#19191B] block mb-3">
            1. Select the child's age group:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <button
              onClick={() => setSelectedAge('all')}
              className={`p-3 rounded-xl text-xs font-semibold transition-all border ${
                selectedAge === 'all'
                  ? 'bg-[#19191B] text-white border-[#19191B]'
                  : 'bg-[#FAF9F5] text-[#2C2D30] border-[#E9E6DC] hover:border-[#D85A38]'
              }`}
            >
              All Ages
            </button>
            {AGE_CATEGORIES.map(age => (
              <button
                key={age.bracket}
                onClick={() => setSelectedAge(age.bracket)}
                className={`p-3 rounded-xl text-xs font-semibold transition-all border text-left flex flex-col justify-between ${
                  selectedAge === age.bracket
                    ? 'bg-[#19191B] text-white border-[#19191B]'
                    : 'bg-[#FAF9F5] text-[#2C2D30] border-[#E9E6DC] hover:border-[#D85A38]'
                }`}
              >
                <span className="font-bold">{age.label}</span>
                <span className={`text-[10px] ${selectedAge === age.bracket ? 'text-neutral-300' : 'text-[#7A7A80]'}`}>
                  {age.range}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Play Intent / Interest */}
        <div>
          <label className="font-display font-bold text-sm text-[#19191B] block mb-3">
            2. What kind of play do they love most?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <button
              onClick={() => setSelectedPlay('all')}
              className={`p-3 rounded-xl text-xs font-semibold transition-all border ${
                selectedPlay === 'all'
                  ? 'bg-[#19191B] text-white border-[#19191B]'
                  : 'bg-[#FAF9F5] text-[#2C2D30] border-[#E9E6DC] hover:border-[#D85A38]'
              }`}
            >
              Any Interest
            </button>
            {PLAY_TYPES.map(play => (
              <button
                key={play.type}
                onClick={() => setSelectedPlay(play.type)}
                className={`p-3 rounded-xl text-xs font-semibold transition-all border text-left ${
                  selectedPlay === play.type
                    ? 'bg-[#19191B] text-white border-[#19191B]'
                    : 'bg-[#FAF9F5] text-[#2C2D30] border-[#E9E6DC] hover:border-[#D85A38]'
                }`}
              >
                <span className="font-bold block">{play.title}</span>
                <span className={`text-[10px] ${selectedPlay === play.type ? 'text-neutral-300' : 'text-[#7A7A80]'}`}>
                  {play.type === 'Build' && 'STEM & Construct'}
                  {play.type === 'Create' && 'Art & Crafts'}
                  {play.type === 'Explore' && 'Science & Nature'}
                  {play.type === 'Imagine' && 'Pretend Play'}
                  {play.type === 'Move' && 'Active Motor'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Budget Tier */}
        <div>
          <label className="font-display font-bold text-sm text-[#19191B] block mb-3">
            3. What is your gift budget?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => setBudgetTier('any')}
              className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                budgetTier === 'any'
                  ? 'bg-[#D85A38] text-white border-[#D85A38]'
                  : 'bg-[#FAF9F5] text-[#2C2D30] border-[#E9E6DC]'
              }`}
            >
              Any Budget
            </button>
            <button
              onClick={() => setBudgetTier('under-1000')}
              className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                budgetTier === 'under-1000'
                  ? 'bg-[#D85A38] text-white border-[#D85A38]'
                  : 'bg-[#FAF9F5] text-[#2C2D30] border-[#E9E6DC]'
              }`}
            >
              Under ₹1,000
            </button>
            <button
              onClick={() => setBudgetTier('1000-2500')}
              className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                budgetTier === '1000-2500'
                  ? 'bg-[#D85A38] text-white border-[#D85A38]'
                  : 'bg-[#FAF9F5] text-[#2C2D30] border-[#E9E6DC]'
              }`}
            >
              ₹1,000 – ₹2,500
            </button>
            <button
              onClick={() => setBudgetTier('over-2500')}
              className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                budgetTier === 'over-2500'
                  ? 'bg-[#D85A38] text-white border-[#D85A38]'
                  : 'bg-[#FAF9F5] text-[#2C2D30] border-[#E9E6DC]'
              }`}
            >
              ₹2,500 & Above
            </button>
          </div>
        </div>

        {/* Reset */}
        <div className="pt-2 border-t border-[#F4F2EA] flex items-center justify-between text-xs">
          <span className="text-[#57585C]">
            Found <strong className="text-[#19191B]">{giftMatches.length}</strong> thoughtful gift matches
          </span>
          <button
            onClick={handleReset}
            className="text-[#7A7A80] hover:text-[#19191B] flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Criteria</span>
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-[#19191B]">
            Recommended Gifts
          </h2>
          <span className="text-xs text-[#7A7A80]">
            Every order includes complimentary Toyora gift packaging & handwritten card option
          </span>
        </div>

        {giftMatches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E9E6DC] p-12 text-center space-y-3">
            <h3 className="font-display font-bold text-base text-[#19191B]">No matches for this specific combination</h3>
            <p className="text-xs text-[#7A7A80]">Try adjusting the budget or choosing "All Ages".</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-bold bg-[#19191B] text-white rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {giftMatches.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
