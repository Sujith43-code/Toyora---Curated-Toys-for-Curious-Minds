import React, { useState } from 'react';
import { 
  Heart, Star, Plus, Minus, ShieldCheck, Truck, RefreshCw, 
  Check, ArrowRight, Share2, Lightbulb, Award, Box, Info 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigate, 
    setQuickFilter,
    addToast 
  } = useStore();

  const product = products.find(p => p.id === productId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'safety' | 'reviews'>('overview');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAEEE9] text-[#D85A38] flex items-center justify-center mx-auto">
          <Info className="w-8 h-8" />
        </div>
        <h1 className="font-display font-bold text-2xl text-[#19191B]">Toy Not Found</h1>
        <p className="text-xs sm:text-sm text-[#57585C] max-w-md mx-auto">
          The toy you requested may have been moved, renamed, or is currently unavailable.
        </p>
        <button
          onClick={() => {
            setQuickFilter({});
            navigate({ type: 'shop' });
          }}
          className="px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors"
        >
          Explore All Toys
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  // Related products in the same category or play type
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.playType === product.playType))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false);
    navigate({ type: 'checkout' });
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeStatus('Available! Express Delivery in 2–3 business days • Free Delivery');
    } else {
      setPincodeStatus('Please enter a valid 6-digit PIN code.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#7A7A80] flex-wrap">
        <button
          onClick={() => navigate({ type: 'home' })}
          className="hover:text-[#19191B] transition-colors"
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => {
            setQuickFilter({});
            navigate({ type: 'shop' });
          }}
          className="hover:text-[#19191B] transition-colors"
        >
          Shop
        </button>
        <span>/</span>
        <button
          onClick={() => {
            setQuickFilter({ categories: [product.category] });
            navigate({ type: 'shop', category: product.category });
          }}
          className="hover:text-[#19191B] transition-colors"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-[#19191B] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Viewport: Gallery & Product Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left: Product Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/3.4] rounded-3xl overflow-hidden bg-[#F4F2EA] border border-[#E9E6DC]">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges on Gallery */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-white/95 text-[#19191B] shadow-sm backdrop-blur-xs">
                {product.ageDisplay}
              </span>
              {product.isBestSeller && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#19191B] text-white">
                  Best Seller
                </span>
              )}
              {product.isEcoFriendly && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#22382E] text-white">
                  FSC Certified Wood
                </span>
              )}
            </div>

            {/* Wishlist & Share buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isWishlisted
                    ? 'bg-[#FAF9F5] text-[#D85A38] shadow-md'
                    : 'bg-white/90 hover:bg-white text-[#57585C] hover:text-[#D85A38]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-[#D85A38]' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                aria-label="Share product"
                className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#57585C] hover:text-[#19191B] backdrop-blur-md transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#F4F2EA] border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#D85A38] scale-95 ring-2 ring-[#FAEEE9]'
                      : 'border-[#E9E6DC] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box & Product Overview */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Category & Age Meta */}
            <div className="flex items-center gap-2 text-xs text-[#7A7A80] mb-2">
              <span className="font-bold text-[#D85A38] uppercase tracking-wider">
                {product.category}
              </span>
              <span>•</span>
              <span>Play Intent: <strong className="text-[#19191B]">{product.playType}</strong></span>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B] leading-tight">
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-[#57585C] mt-2 leading-relaxed">
              {product.tagline}
            </p>

            {/* Star Rating summary */}
            <div className="flex items-center gap-2 mt-3 pt-2">
              <div className="flex items-center text-[#E9A822]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#19191B]">{product.rating.toFixed(1)}</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-[#7A7A80] hover:text-[#D85A38] underline"
              >
                ({product.reviewCount} verified parent reviews)
              </button>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E9E6DC]">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-[#8E8E93] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-xs font-bold text-[#D85A38] bg-[#FAEEE9] px-2 py-0.5 rounded-md">
                  SAVE {product.discountPercent}%
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#7A7A80] mt-1">
              Price inclusive of all taxes. Free express delivery eligible.
            </div>

            {/* In-Stock Indicator */}
            <div className="mt-3 pt-2.5 border-t border-[#E9E6DC] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-800">In Stock for Immediate Dispatch</span>
              </div>
              <span className="text-[#7A7A80]">{product.stockCount} units remaining</span>
            </div>
          </div>

          {/* Actions: Quantity + Add to Cart + Buy Now */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Picker */}
              <div className="flex items-center border border-[#D8D4C5] rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="p-2 hover:text-[#D85A38] text-[#57585C]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-display font-bold text-sm text-[#19191B]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="p-2 hover:text-[#D85A38] text-[#57585C]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-4 rounded-xl font-display font-bold text-sm tracking-wide bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Add to Cart</span>
                <span className="text-xs opacity-75">• ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>

            {/* Buy Now Instant Action */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm tracking-wide bg-[#D85A38] hover:bg-[#C24726] text-white transition-colors shadow-sm"
            >
              Buy Now with 1-Click Checkout
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="bg-white p-4 rounded-2xl border border-[#E9E6DC] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#19191B]">
              <Truck className="w-4 h-4 text-[#D85A38]" />
              <span>Check Delivery Pincode</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit pincode (e.g. 560001)"
                className="flex-1 py-2 px-3 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden focus:border-[#D85A38]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-[#FAF9F5] hover:bg-[#E9E6DC] border border-[#D8D4C5] rounded-xl text-[#19191B]"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="text-[11px] font-semibold text-[#22382E] bg-emerald-50 p-2 rounded-lg">
                {pincodeStatus}
              </p>
            )}
          </div>

          {/* Key Assurance Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#57585C] pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC]">
              <ShieldCheck className="w-4 h-4 text-[#D85A38]" />
              <span>BIS & ASTM Tested</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC]">
              <RefreshCw className="w-4 h-4 text-[#D85A38]" />
              <span>30-Day Gentle Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Product Tabs: Overview, Specs, Safety, Parent Reviews */}
      <div className="bg-white rounded-3xl border border-[#E9E6DC] p-6 sm:p-10 shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-[#E9E6DC] gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-display font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'overview'
                ? 'border-[#D85A38] text-[#D85A38]'
                : 'border-transparent text-[#7A7A80] hover:text-[#19191B]'
            }`}
          >
            Overview & Play Benefits
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-display font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'specs'
                ? 'border-[#D85A38] text-[#D85A38]'
                : 'border-transparent text-[#7A7A80] hover:text-[#19191B]'
            }`}
          >
            Box Contents & Specifications
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`pb-3 text-sm font-display font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'safety'
                ? 'border-[#D85A38] text-[#D85A38]'
                : 'border-transparent text-[#7A7A80] hover:text-[#19191B]'
            }`}
          >
            Safety Standards & Care
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-display font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'reviews'
                ? 'border-[#D85A38] text-[#D85A38]'
                : 'border-transparent text-[#7A7A80] hover:text-[#19191B]'
            }`}
          >
            Parent Reviews ({product.reviewCount})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="pt-6 space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="font-display font-bold text-lg text-[#19191B] mb-2">
                About this Toy
              </h3>
              <p className="text-xs sm:text-sm text-[#57585C] leading-relaxed max-w-3xl">
                {product.description}
              </p>
            </div>

            {/* Developmental Benefits list */}
            <div>
              <h4 className="font-display font-bold text-sm text-[#19191B] mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#D85A38]" />
                <span>Developmental & Learning Milestones</span>
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.developmentalBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] text-xs text-[#2C2D30]">
                    <Check className="w-4 h-4 text-[#D85A38] flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Distinct Features */}
            <div>
              <h4 className="font-display font-bold text-sm text-[#19191B] mb-3">
                Key Craftsmanship Details
              </h4>
              <ul className="space-y-2 text-xs text-[#57585C]">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D85A38]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specs' && (
          <div className="pt-6 space-y-4 animate-in fade-in duration-150">
            <h3 className="font-display font-bold text-lg text-[#19191B]">
              Technical Specifications & Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] space-y-1">
                <strong className="text-[#19191B] block">Primary Materials:</strong>
                <span className="text-[#57585C]">{product.specifications.material}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] space-y-1">
                <strong className="text-[#19191B] block">Dimensions:</strong>
                <span className="text-[#57585C]">{product.specifications.dimensions}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] space-y-1">
                <strong className="text-[#19191B] block">Piece Count:</strong>
                <span className="text-[#57585C]">{product.specifications.pieceCount || 'Complete Unit'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] space-y-1">
                <strong className="text-[#19191B] block">Box Contents:</strong>
                <span className="text-[#57585C]">{product.specifications.boxContents}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Safety Standards */}
        {activeTab === 'safety' && (
          <div className="pt-6 space-y-4 animate-in fade-in duration-150">
            <h3 className="font-display font-bold text-lg text-[#19191B]">
              Safety Testing & Longevity Care
            </h3>
            <div className="space-y-3 text-xs text-[#57585C] leading-relaxed">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <strong className="font-bold block">Certified Conformance:</strong>
                <p>{product.specifications.safetyStandards}</p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  100% free of Lead, Phthalates, BPA, PVC, and heavy metals. Finished exclusively with child-safe waterborne stains.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] space-y-1">
                <strong className="text-[#19191B] block">Care & Cleaning Instructions:</strong>
                <p>{product.specifications.care}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Parent Reviews */}
        {activeTab === 'reviews' && (
          <div className="pt-6 space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[#19191B]">
                  Verified Parent Feedback
                </h3>
                <p className="text-xs text-[#7A7A80]">
                  Real thoughts from parents whose children play with this toy.
                </p>
              </div>
              <div className="text-right">
                <div className="font-display font-bold text-2xl text-[#19191B]">
                  {product.rating} / 5.0
                </div>
                <div className="text-xs text-[#7A7A80]">Based on {product.reviewCount} reviews</div>
              </div>
            </div>

            <div className="space-y-4">
              {product.reviews.map(review => (
                <div key={review.id} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E9E6DC] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-[#19191B]">{review.author}</strong>
                      {review.verified && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      )}
                      {review.childAge && (
                        <span className="text-[11px] text-[#7A7A80]">({review.childAge})</span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#7A7A80]">{review.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#E9A822]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <h5 className="text-xs font-bold text-[#19191B]">{review.title}</h5>
                  <p className="text-xs text-[#57585C] leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* "Complete the Playroom" Related Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D85A38]">
                Complementary Play
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#19191B]">
                Complete the Playroom
              </h2>
            </div>
            <button
              onClick={() => {
                setQuickFilter({ categories: [product.category] });
                navigate({ type: 'shop' });
              }}
              className="text-xs font-bold text-[#19191B] hover:text-[#D85A38] flex items-center gap-1"
            >
              <span>Explore more in {product.category}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
