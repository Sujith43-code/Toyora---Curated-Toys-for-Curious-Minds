import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Star, ArrowRight, Compass, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES } from '../data/categories';
import { ProductCategory } from '../types';

export const QuickSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    navigate,
    recentSearches,
    addRecentSearch,
    setQuickFilter
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Handle ESC key and '/' global shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(trimmed) ||
      p.tagline.toLowerCase().includes(trimmed) ||
      p.category.toLowerCase().includes(trimmed) ||
      p.playType.toLowerCase().includes(trimmed) ||
      p.ageDisplay.toLowerCase().includes(trimmed) ||
      p.description.toLowerCase().includes(trimmed)
    ).slice(0, 6);
  }, [query, products]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (productId: string) => {
    if (query.trim()) {
      addRecentSearch(query);
    }
    setIsSearchOpen(false);
    navigate({ type: 'product', id: productId });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query);
    setIsSearchOpen(false);
    setQuickFilter({ searchQuery: query });
    navigate({ type: 'shop', search: query });
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
    setIsSearchOpen(false);
    setQuickFilter({ searchQuery: term });
    navigate({ type: 'shop', search: term });
  };

  const handleCategoryClick = (cat: ProductCategory) => {
    setIsSearchOpen(false);
    setQuickFilter({ categories: [cat] });
    navigate({ type: 'shop', category: cat });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-[#E9E6DC] overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative border-b border-[#E9E6DC] flex items-center px-4">
          <Search className="w-5 h-5 text-[#7A7A80] mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wooden toys, STEM kits, age 3-5, puzzles..."
            className="w-full py-4 text-base text-[#19191B] placeholder-[#8E8E93] focus:outline-hidden bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#8E8E93] hover:text-[#19191B] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs font-semibold text-[#57585C] hover:text-[#19191B] bg-[#F4F2EA] rounded-md"
          >
            ESC
          </button>
        </form>

        {/* Dynamic Search Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {query.trim().length > 0 ? (
            /* Results List */
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#7A7A80] uppercase tracking-wider mb-3">
                <span>Matching Toys ({searchResults.length})</span>
                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="text-[#D85A38] hover:underline normal-case font-bold"
                  >
                    View all results →
                  </button>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-[#19191B]">No toys found for "{query}"</p>
                  <p className="text-xs text-[#7A7A80] mt-1">
                    Try searching for general terms like "wooden", "magnetic", "STEM", or "3-5".
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="p-2.5 rounded-xl hover:bg-[#FAF9F5] border border-transparent hover:border-[#E9E6DC] flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[#F4F2EA] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-display font-medium text-sm text-[#19191B] group-hover:text-[#D85A38] transition-colors truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-[#7A7A80] mt-0.5">
                            <span className="font-medium text-[#19191B]">{product.ageDisplay}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                              <Star className="w-3 h-3 fill-current" /> {product.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="font-display font-bold text-sm text-[#19191B]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Default Suggestions View */
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7A7A80] mb-2.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(term => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-[#2C2D30] bg-[#F4F2EA] hover:bg-[#E9E6DC] transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7A7A80] mb-2.5">
                  <Compass className="w-3.5 h-3.5 text-[#D85A38]" />
                  <span>Popular Categories</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRODUCT_CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="p-2.5 rounded-xl border border-[#E9E6DC] hover:border-[#D85A38] bg-[#FAF9F5] text-left text-xs font-semibold text-[#19191B] hover:text-[#D85A38] transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#FAF9F5] border-t border-[#E9E6DC] text-[11px] text-[#7A7A80] flex items-center justify-between px-6">
          <span>Press <strong>Enter</strong> to search all products</span>
          <span>Tip: Filter by age or play intent anytime in the catalog</span>
        </div>
      </div>
    </div>
  );
};
