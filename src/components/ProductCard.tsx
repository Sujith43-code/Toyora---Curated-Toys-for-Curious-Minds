import React from 'react';
import { Heart, Star, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { navigate, addToCart, toggleWishlist, isInWishlist, cart } = useStore();
  const isWishlisted = isInWishlist(product.id);
  const inCart = cart.some(item => item.product.id === product.id);

  const handleCardClick = () => {
    navigate({ type: 'product', id: product.id });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#E9E6DC] hover:border-[#D8D4C5] transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3.8] bg-[#F4F2EA] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Secondary image preview on hover if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate angle`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />
        )}

        {/* Top Badges: Age / BestSeller */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center pointer-events-none z-10">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-white/95 text-[#19191B] shadow-xs backdrop-blur-xs">
            {product.ageDisplay}
          </span>
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#19191B] text-white">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D85A38] text-white">
              New In
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-[#FAF9F5] text-[#D85A38] shadow-sm'
              : 'bg-white/80 hover:bg-white text-[#57585C] hover:text-[#D85A38] backdrop-blur-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#D85A38]' : ''}`} />
        </button>

        {/* Quick Add Overlay on desktop hover */}
        <div className="hidden sm:block absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-10">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Another</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Subtle Rating + Play category */}
          <div className="flex items-center justify-between gap-2 text-xs text-[#57585C] mb-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#E9A822] text-[#E9A822]" />
              <span className="font-semibold text-[#19191B]">{product.rating.toFixed(1)}</span>
              <span className="text-[#7A7A80]">({product.reviewCount})</span>
            </div>
            <span className="text-[11px] font-medium text-[#7A7A80] uppercase tracking-wider truncate">
              {product.playType}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-display font-medium text-sm sm:text-[15px] text-[#19191B] leading-snug line-clamp-2 group-hover:text-[#D85A38] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-2.5 border-t border-[#F4F2EA] flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-display font-bold text-base sm:text-lg text-[#19191B]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#8E8E93] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discountPercent && (
              <span className="text-[10px] font-bold text-[#D85A38] bg-[#FAEEE9] px-1.5 py-0.5 rounded-xs">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Mobile Direct Add Button */}
          <div className="sm:hidden">
            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="w-8 h-8 rounded-lg bg-[#19191B] text-white flex items-center justify-center active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
