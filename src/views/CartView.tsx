import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Gift, Truck, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartView: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartSubtotal, 
    freeShippingThreshold, 
    navigate 
  } = useStore();

  const [orderNotes, setOrderNotes] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  const shippingFee = cartSubtotal >= freeShippingThreshold ? 0 : 99;
  const total = cartSubtotal + shippingFee;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F4F2EA] flex items-center justify-center text-[#7A7A80] mx-auto">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
            Your Play Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7A80] max-w-sm mx-auto">
            Explore our curated collections of heirloom wooden toys, magnetic builders, and STEM discoveries.
          </p>
        </div>
        <button
          onClick={() => navigate({ type: 'shop' })}
          className="px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors"
        >
          Explore All Toys
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E9E6DC]">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
            Shopping Cart
          </h1>
          <p className="text-xs text-[#7A7A80] mt-0.5">
            Review your selected items before proceeding to secure checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#7A7A80] hover:text-red-600 underline"
        >
          Clear cart
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-[#FAEEE9] p-4 rounded-2xl border border-[#F3D4C6] flex items-center justify-between text-xs font-medium text-[#9F361A]">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4" />
          {remainingForFreeShipping > 0 ? (
            <span>Add <strong>₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more to qualify for <strong>Free Express Shipping</strong>!</span>
          ) : (
            <span className="text-emerald-800 font-bold">Your order qualifies for Free Express Delivery!</span>
          )}
        </div>
        <button
          onClick={() => navigate({ type: 'shop' })}
          className="text-xs font-bold underline"
        >
          Keep Shopping
        </button>
      </div>

      {/* Main Grid: Items Table + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E9E6DC] overflow-hidden">
            <div className="divide-y divide-[#F4F2EA]">
              {cart.map(item => (
                <div key={item.product.id} className="p-4 sm:p-5 flex gap-4 items-start sm:items-center justify-between">
                  {/* Image & Title */}
                  <div className="flex gap-4 items-center min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      onClick={() => navigate({ type: 'product', id: item.product.id })}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-[#F4F2EA] flex-shrink-0 cursor-pointer"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="text-[11px] font-bold text-[#D85A38] uppercase tracking-wide">
                        {item.product.category} • {item.product.ageDisplay}
                      </div>
                      <h3
                        onClick={() => navigate({ type: 'product', id: item.product.id })}
                        className="font-display font-medium text-sm sm:text-base text-[#19191B] hover:text-[#D85A38] cursor-pointer transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </h3>
                      <div className="text-xs font-semibold text-[#57585C]">
                        ₹{item.product.price.toLocaleString('en-IN')} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                    <div className="flex items-center border border-[#E9E6DC] rounded-xl bg-[#FAF9F5] p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:text-[#D85A38] text-[#57585C]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-[#19191B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:text-[#D85A38] text-[#57585C]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="font-display font-bold text-sm sm:text-base text-[#19191B]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-[#A0A0A5] hover:text-red-600 rounded-md transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gift Message & Special Instructions Accordion */}
          <div className="bg-white rounded-2xl border border-[#E9E6DC] p-5 space-y-4">
            <label className="flex items-center gap-2 text-xs font-bold text-[#19191B] cursor-pointer">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="rounded text-[#D85A38] focus:ring-[#D85A38]"
              />
              <Gift className="w-4 h-4 text-[#D85A38]" />
              <span>Is this order a gift? Add a free personalized card & handwritten note</span>
            </label>

            {giftWrap && (
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Write your heartfelt message to the recipient here (e.g. 'Happy 4th Birthday Kabir! With love from Maasi')..."
                className="w-full p-3 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden focus:border-[#D85A38]"
                rows={3}
              />
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-1.5">
                Special Delivery Notes (Optional)
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Leave with building security if unavailable"
                className="w-full py-2 px-3 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E9E6DC] p-6 space-y-5 sticky top-24">
            <h2 className="font-display font-bold text-base text-[#19191B] uppercase tracking-wider pb-3 border-b border-[#F4F2EA]">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#57585C]">
                <span>Items Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                <span className="font-semibold text-[#19191B]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#57585C]">
                <span>Express Delivery</span>
                <span className="font-semibold text-[#19191B]">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              {giftWrap && (
                <div className="flex justify-between text-[#57585C]">
                  <span>Gift Packaging & Tag</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#F4F2EA] flex justify-between items-baseline">
              <span className="font-display font-bold text-sm text-[#19191B]">Estimated Total</span>
              <span className="font-display font-bold text-2xl text-[#19191B]">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate({ type: 'checkout' })}
              className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm tracking-wide bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                onClick={() => navigate({ type: 'shop' })}
                className="text-xs font-semibold text-[#57585C] hover:text-[#19191B] inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#F4F2EA] flex items-center justify-center gap-2 text-[11px] text-[#7A7A80]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-bit encrypted secure checkout</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
