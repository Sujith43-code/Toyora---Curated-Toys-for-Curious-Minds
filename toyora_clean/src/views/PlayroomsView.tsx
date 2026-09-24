import React, { useState } from 'react';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PLAYROOM_STORIES } from '../data/categories';
import { ProductCard } from '../components/ProductCard';

export const PlayroomsView: React.FC = () => {
  const { products, addToCart, navigate } = useStore();
  const [selectedPlayroomId, setSelectedPlayroomId] = useState(PLAYROOM_STORIES[0].id);

  const selectedPlayroom = PLAYROOM_STORIES.find(p => p.id === selectedPlayroomId) || PLAYROOM_STORIES[0];
  const playroomProducts = products.filter(p => selectedPlayroom.featuredProductIds.includes(p.id));

  const handleAddBundleToCart = () => {
    playroomProducts.forEach(prod => {
      addToCart(prod, 1, false);
    });
    navigate({ type: 'cart' });
  };

  const bundleTotal = playroomProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D85A38] bg-[#FAEEE9] px-3 py-1 rounded-full inline-block">
          Curated Contextual Shopping
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#19191B]">
          Shop the Playroom
        </h1>
        <p className="text-xs sm:text-sm text-[#57585C]">
          Instead of disjointed products in empty grids, explore thoughtfully paired open-ended environments designed to grow with your child.
        </p>
      </div>

      {/* Playroom Tabs / Selector Pills */}
      <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
        {PLAYROOM_STORIES.map(story => (
          <button
            key={story.id}
            onClick={() => setSelectedPlayroomId(story.id)}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-all ${
              selectedPlayroomId === story.id
                ? 'bg-[#19191B] text-white shadow-md'
                : 'bg-white text-[#57585C] hover:text-[#19191B] border border-[#E9E6DC]'
            }`}
          >
            {story.title}
          </button>
        ))}
      </div>

      {/* Active Playroom Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#E9E6DC] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
        <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] bg-[#F4F2EA]">
          <img
            src={selectedPlayroom.heroImage || selectedPlayroom.image}
            alt={selectedPlayroom.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-[#19191B]/85 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
            {selectedPlayroom.suggestedAge || selectedPlayroom.ageRecommendation}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#D85A38] uppercase tracking-wider">
              {selectedPlayroom.subtitle || selectedPlayroom.theme}
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
              {selectedPlayroom.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#57585C] leading-relaxed">
              {selectedPlayroom.description}
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E9E6DC] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#7A7A80] uppercase tracking-wider block">
                  Complete Playroom Bundle
                </span>
                <span className="font-display font-bold text-xl text-[#19191B]">
                  ₹{bundleTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-md">
                {playroomProducts.length} Items Included
              </span>
            </div>

            <button
              onClick={handleAddBundleToCart}
              className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Complete Playroom to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products included in this playroom */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-xl text-[#19191B]">
            Toys Featured in {selectedPlayroom.title}
          </h3>
          <span className="text-xs text-[#7A7A80]">
            Individual items can also be purchased separately
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {playroomProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};
