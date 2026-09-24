import React from 'react';
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist, navigate } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach(product => {
      addToCart(product, 1, false);
    });
    navigate({ type: 'cart' });
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#F4F2EA] flex items-center justify-center text-[#7A7A80] mx-auto">
          <Heart className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-[#19191B]">
            Your Saved Toys list is empty
          </h1>
          <p className="text-xs text-[#7A7A80] mt-1">
            Tap the heart icon on any toy to save it for birthdays, holidays, or future playrooms.
          </p>
        </div>
        <button
          onClick={() => navigate({ type: 'shop' })}
          className="px-6 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors"
        >
          Discover Toys
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E6DC]">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
            Saved Wishlist ({wishlistedProducts.length})
          </h1>
          <p className="text-xs text-[#7A7A80] mt-0.5">
            Your saved favorites and birthday gift ideas.
          </p>
        </div>

        <button
          onClick={handleAddAllToCart}
          className="px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors shadow-sm flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Move All to Cart</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
};
