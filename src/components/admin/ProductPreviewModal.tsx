import React from 'react';
import { X, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface ProductPreviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E9E6DC] overflow-hidden flex flex-col max-h-[90dvh] animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E9E6DC] flex items-center justify-between bg-[#FAF9F5] shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#19191B] text-white">
              Live Preview
            </span>
            <span className="text-xs font-semibold text-[#7A7A80]">Storefront Card & PDP Overview</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A7A80] hover:text-[#19191B] rounded-lg hover:bg-[#E9E6DC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#FAF9F5] border border-[#E9E6DC] relative">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.isBestSeller && (
              <span className="absolute top-3 left-3 bg-[#D85A38] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                Best Seller
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D85A38]">
                {product.category} • {product.ageDisplay}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#19191B]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-[#7A7A80] font-normal">({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-[#19191B] mt-1">
              {product.name}
            </h3>
            <p className="text-xs text-[#57585C] mt-0.5">{product.tagline}</p>
          </div>

          <div className="flex items-baseline gap-2 pt-2 border-t border-[#F4F2EA]">
            <span className="font-display font-bold text-2xl text-[#19191B]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#7A7A80] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">
              {product.stockCount} in stock
            </span>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E9E6DC] space-y-1.5 text-xs text-[#57585C]">
            <div className="flex items-center gap-1.5 font-bold text-[#19191B]">
              <Sparkles className="w-3.5 h-3.5 text-[#D85A38]" />
              <span>Developmental Focus:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.developmentalBenefits?.map((b, i) => (
                <span key={i} className="px-2 py-0.5 bg-white border border-[#E9E6DC] rounded-md text-[11px] font-medium text-[#19191B]">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs text-[#7A7A80] font-mono">
            SKU: {product.sku || 'N/A'} • Material: {product.specifications?.material || 'Natural Wood'}
          </div>
        </div>
      </div>
    </div>
  );
};
