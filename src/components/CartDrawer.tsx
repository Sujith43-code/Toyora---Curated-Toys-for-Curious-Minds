import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Gift, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    freeShippingThreshold,
    navigate
  } = useStore();

  const [isGiftWrapSelected, setIsGiftWrapSelected] = useState(false);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate({ type: 'checkout' });
  };

  const handleViewFullCart = () => {
    setIsCartOpen(false);
    navigate({ type: 'cart' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col border-l border-[#E9E6DC] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#E9E6DC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D85A38]" />
              <h2 className="font-display font-bold text-lg text-[#19191B]">Your Play Cart</h2>
              <span className="text-xs font-semibold text-[#7A7A80] bg-[#F4F2EA] px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="p-1.5 text-[#7A7A80] hover:text-[#19191B] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#FAEEE9] px-4 py-3 border-b border-[#F3D4C6] text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-medium text-[#9F361A]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Add <strong className="font-bold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for Free Delivery!
                  </span>
                  <span>{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D85A38] rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-bold text-[#22382E]">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>You’ve unlocked Free Express Delivery!</span>
              </div>
            )}
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F4F2EA] flex items-center justify-center text-[#7A7A80]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#19191B]">Your cart is currently empty</h3>
                  <p className="text-xs text-[#7A7A80] mt-1 max-w-xs">
                    Explore our curated collection of wooden toys, STEM kits, and creative playrooms.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate({ type: 'shop' });
                  }}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#19191B] text-white hover:bg-[#D85A38] transition-colors"
                >
                  Start Discovering
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.product.id}
                  className="bg-white p-3 rounded-xl border border-[#E9E6DC] flex gap-3.5 relative"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-[#F4F2EA] flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate({ type: 'product', id: item.product.id });
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate({ type: 'product', id: item.product.id });
                          }}
                          className="font-display font-medium text-xs sm:text-[13px] text-[#19191B] hover:text-[#D85A38] transition-colors line-clamp-2 cursor-pointer"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label="Remove item"
                          className="text-[#A0A0A5] hover:text-red-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#7A7A80] font-medium block mt-0.5">
                        {item.product.ageDisplay} • {item.product.playType}
                      </span>
                    </div>

                    {/* Quantity + Price Row */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#FAF9F5]">
                      <div className="flex items-center border border-[#E9E6DC] rounded-md bg-[#FAF9F5]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1 hover:text-[#D85A38] text-[#57585C]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#19191B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1 hover:text-[#D85A38] text-[#57585C]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-display font-bold text-sm text-[#19191B]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#E9E6DC] space-y-3">
              {/* Gift Wrap Addon Option */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E9E6DC] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isGiftWrapSelected}
                  onChange={(e) => setIsGiftWrapSelected(e.target.checked)}
                  className="rounded text-[#D85A38] focus:ring-[#D85A38]"
                />
                <Gift className="w-4 h-4 text-[#D85A38]" />
                <span className="text-[#2C2D30] font-medium">
                  Add complimentary Toyora gift packaging & tag
                </span>
              </label>

              {/* Subtotal */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#57585C]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#19191B]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#57585C]">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-[#19191B]">
                    {cartSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      '₹99'
                    )}
                  </span>
                </div>
              </div>

              {/* Total & Checkout button */}
              <div className="pt-2 border-t border-[#F4F2EA]">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-display font-bold text-sm text-[#19191B]">Total (incl. taxes)</span>
                  <span className="font-display font-bold text-lg text-[#19191B]">
                    ₹{(cartSubtotal + (cartSubtotal >= freeShippingThreshold ? 0 : 99)).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm tracking-wide bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleViewFullCart}
                    className="w-full py-2 text-xs font-semibold text-[#57585C] hover:text-[#19191B] text-center"
                  >
                    View detailed cart & order notes
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A7A80] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe 256-bit encrypted checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
