import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, Search, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { PRODUCT_CATEGORIES, AGE_CATEGORIES, PLAY_TYPES } from '../data/categories';
import { ProductCategory, AgeBracket, PlayType } from '../types';

export const ShopView: React.FC = () => {
  const { products, filters, setFilters, resetFilters } = useStore();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(query) ||
          product.tagline.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.playType.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Age
      if (filters.ageBrackets.length > 0 && !filters.ageBrackets.includes(product.ageBracket)) {
        return false;
      }

      // Play Type
      if (filters.playTypes.length > 0 && !filters.playTypes.includes(product.playType)) {
        return false;
      }

      // Price
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // Rating
      if (filters.minRating !== null && product.rating < filters.minRating) {
        return false;
      }

      // In Stock
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // On Sale
      if (filters.onSaleOnly && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }

      // Best Sellers
      if (filters.bestSellersOnly && !product.isBestSeller) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'featured':
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
    });
  }, [products, filters]);

  // Active filter count
  const activeFilterCount =
    filters.categories.length +
    filters.ageBrackets.length +
    filters.playTypes.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.bestSellersOnly ? 1 : 0) +
    (filters.maxPrice < 5000 || filters.minPrice > 0 ? 1 : 0);

  // Toggle helpers
  const toggleCategory = (cat: ProductCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleAge = (age: AgeBracket) => {
    setFilters(prev => ({
      ...prev,
      ageBrackets: prev.ageBrackets.includes(age)
        ? prev.ageBrackets.filter(a => a !== age)
        : [...prev.ageBrackets, age]
    }));
  };

  const togglePlay = (play: PlayType) => {
    setFilters(prev => ({
      ...prev,
      playTypes: prev.playTypes.includes(play)
        ? prev.playTypes.filter(p => p !== play)
        : [...prev.playTypes, play]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
              {filters.categories.length === 1 ? filters.categories[0] : 'Shop All Toys'}
            </h1>
            <p className="text-xs text-[#7A7A80] mt-1">
              Curated developmental toys designed for open-ended discovery and certified safety.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#57585C]">
            Showing <strong className="text-[#19191B]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'toy' : 'toys'}
          </span>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E9E6DC] mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF9F5] border border-[#E9E6DC] text-[#19191B]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#D85A38]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#D85A38] text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Search inside shop */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 text-[#7A7A80] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search within toys..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] focus:outline-hidden focus:border-[#D85A38]"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A7A80] hover:text-[#19191B]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#7A7A80] hidden sm:inline">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="py-1.5 px-3 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] text-xs font-semibold text-[#19191B] focus:outline-hidden cursor-pointer"
          >
            <option value="featured">Featured / Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated (★)</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-[#7A7A80] text-[11px] font-semibold uppercase tracking-wider">
            Active:
          </span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E9E6DC] text-[#19191B]">
              Query: "{filters.searchQuery}"
              <X onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} className="w-3 h-3 cursor-pointer text-[#7A7A80] hover:text-red-500" />
            </span>
          )}

          {filters.categories.map(c => (
            <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E9E6DC] text-[#19191B]">
              {c}
              <X onClick={() => toggleCategory(c)} className="w-3 h-3 cursor-pointer text-[#7A7A80] hover:text-red-500" />
            </span>
          ))}

          {filters.ageBrackets.map(a => (
            <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E9E6DC] text-[#19191B]">
              Age: {a} yrs
              <X onClick={() => toggleAge(a)} className="w-3 h-3 cursor-pointer text-[#7A7A80] hover:text-red-500" />
            </span>
          ))}

          {filters.playTypes.map(p => (
            <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E9E6DC] text-[#19191B]">
              Play: {p}
              <X onClick={() => togglePlay(p)} className="w-3 h-3 cursor-pointer text-[#7A7A80] hover:text-red-500" />
            </span>
          ))}

          {filters.onSaleOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAEEE9] text-[#D85A38] border border-[#F3D4C6] font-bold">
              On Sale
              <X onClick={() => setFilters(prev => ({ ...prev, onSaleOnly: false }))} className="w-3 h-3 cursor-pointer" />
            </span>
          )}

          {filters.bestSellersOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#19191B] text-white font-bold">
              Best Sellers
              <X onClick={() => setFilters(prev => ({ ...prev, bestSellersOnly: false }))} className="w-3 h-3 cursor-pointer" />
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs font-bold text-[#D85A38] hover:underline ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset all</span>
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E9E6DC] space-y-6 sticky top-24">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F2EA]">
              <span className="font-display font-bold text-sm text-[#19191B] uppercase tracking-wider">
                Filter Toys
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#D85A38] hover:underline font-bold"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Age Range Filter */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-2.5">
                Age Range
              </label>
              <div className="space-y-1.5">
                {AGE_CATEGORIES.map(age => {
                  const count = products.filter(p => p.ageBracket === age.bracket).length;
                  const isChecked = filters.ageBrackets.includes(age.bracket);
                  return (
                    <label
                      key={age.bracket}
                      onClick={() => toggleAge(age.bracket)}
                      className="flex items-center justify-between text-xs py-1 px-1.5 rounded-md hover:bg-[#FAF9F5] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#D85A38] border-[#D85A38] text-white' : 'border-[#D8D4C5] bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`font-medium ${isChecked ? 'text-[#19191B] font-bold' : 'text-[#2C2D30]'}`}>
                          {age.label} ({age.range})
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7A7A80]">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-2.5">
                Category
              </label>
              <div className="space-y-1.5">
                {PRODUCT_CATEGORIES.map(category => {
                  const count = products.filter(p => p.category === category).length;
                  const isChecked = filters.categories.includes(category);
                  return (
                    <label
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className="flex items-center justify-between text-xs py-1 px-1.5 rounded-md hover:bg-[#FAF9F5] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#D85A38] border-[#D85A38] text-white' : 'border-[#D8D4C5] bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`font-medium ${isChecked ? 'text-[#19191B] font-bold' : 'text-[#2C2D30]'}`}>
                          {category}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7A7A80]">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Play Type Filter */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-2.5">
                Play Intent
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PLAY_TYPES.map(play => {
                  const isChecked = filters.playTypes.includes(play.type);
                  return (
                    <button
                      key={play.type}
                      type="button"
                      onClick={() => togglePlay(play.type)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#19191B] text-white'
                          : 'bg-[#FAF9F5] text-[#2C2D30] hover:bg-[#F4F2EA]'
                      }`}
                    >
                      <span>{play.title}</span>
                      {isChecked && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Presets */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-2.5">
                Price
              </label>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 999 }))}
                  className={`w-full text-left py-1.5 px-2 rounded-lg ${
                    filters.maxPrice === 999 ? 'bg-[#FAEEE9] text-[#D85A38] font-bold' : 'hover:bg-[#FAF9F5] text-[#2C2D30]'
                  }`}
                >
                  Under ₹999
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, minPrice: 1000, maxPrice: 1999 }))}
                  className={`w-full text-left py-1.5 px-2 rounded-lg ${
                    filters.minPrice === 1000 && filters.maxPrice === 1999 ? 'bg-[#FAEEE9] text-[#D85A38] font-bold' : 'hover:bg-[#FAF9F5] text-[#2C2D30]'
                  }`}
                >
                  ₹1,000 – ₹1,999
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, minPrice: 2000, maxPrice: 5000 }))}
                  className={`w-full text-left py-1.5 px-2 rounded-lg ${
                    filters.minPrice === 2000 ? 'bg-[#FAEEE9] text-[#D85A38] font-bold' : 'hover:bg-[#FAF9F5] text-[#2C2D30]'
                  }`}
                >
                  ₹2,000 and above
                </button>
              </div>
            </div>

            {/* Special Badges */}
            <div className="pt-2 border-t border-[#F4F2EA] space-y-2">
              <label
                onClick={() => setFilters(prev => ({ ...prev, onSaleOnly: !prev.onSaleOnly }))}
                className="flex items-center gap-2 text-xs cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={filters.onSaleOnly}
                  readOnly
                  className="rounded text-[#D85A38] focus:ring-[#D85A38]"
                />
                <span className="font-semibold text-[#D85A38]">On Sale / Discounted</span>
              </label>

              <label
                onClick={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                className="flex items-center gap-2 text-xs cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  readOnly
                  className="rounded text-[#D85A38] focus:ring-[#D85A38]"
                />
                <span className="font-medium text-[#2C2D30]">In-Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E9E6DC] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF9F5] flex items-center justify-center text-[#7A7A80] mx-auto">
                <Search className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#19191B]">No toys match your filter criteria</h3>
                <p className="text-xs text-[#7A7A80] mt-1 max-w-sm mx-auto">
                  Try broadening your price range, selecting multiple age brackets, or clearing some active filters.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-5">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in"
          />
          <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 ml-auto overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#E9E6DC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D85A38]" />
                <h3 className="font-display font-bold text-base text-[#19191B]">Filters & Refinements</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-[#7A7A80] hover:text-[#19191B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 flex-1">
              {/* Age Range */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-2">
                  Age Range
                </label>
                <div className="space-y-2">
                  {AGE_CATEGORIES.map(age => (
                    <button
                      key={age.bracket}
                      onClick={() => toggleAge(age.bracket)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-left flex items-center justify-between ${
                        filters.ageBrackets.includes(age.bracket)
                          ? 'bg-[#19191B] text-white'
                          : 'bg-[#FAF9F5] text-[#2C2D30]'
                      }`}
                    >
                      <span>{age.label} ({age.range})</span>
                      {filters.ageBrackets.includes(age.bracket) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-2">
                  Category
                </label>
                <div className="space-y-1.5">
                  {PRODUCT_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-left flex items-center justify-between ${
                        filters.categories.includes(cat)
                          ? 'bg-[#D85A38] text-white'
                          : 'bg-[#FAF9F5] text-[#2C2D30]'
                      }`}
                    >
                      <span>{cat}</span>
                      {filters.categories.includes(cat) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special options */}
              <div className="space-y-2 pt-2 border-t border-[#F4F2EA]">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, onSaleOnly: !prev.onSaleOnly }))}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-left ${
                    filters.onSaleOnly ? 'bg-[#D85A38] text-white' : 'bg-[#FAF9F5] text-[#D85A38]'
                  }`}
                >
                  On Sale %
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-left ${
                    filters.inStockOnly ? 'bg-[#19191B] text-white' : 'bg-[#FAF9F5] text-[#2C2D30]'
                  }`}
                >
                  In-Stock Only
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F5] border-t border-[#E9E6DC] flex gap-3">
              <button
                onClick={resetFilters}
                className="w-1/3 py-3 rounded-xl text-xs font-bold bg-white border border-[#E9E6DC] text-[#57585C]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-2/3 py-3 rounded-xl text-xs font-bold bg-[#19191B] text-white"
              >
                Show {filteredProducts.length} Toys
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
