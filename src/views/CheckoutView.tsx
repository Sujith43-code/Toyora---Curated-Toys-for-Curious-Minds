import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowLeft, CheckCircle2, Lock, CreditCard, 
  Truck, Gift, Tag, Check, ChevronRight, PackageCheck 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const CheckoutView: React.FC = () => {
  const { cart, cartSubtotal, freeShippingThreshold, clearCart, createOrder, navigate, addToast } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    paymentMethod: 'upi' as 'upi' | 'card' | 'cod' | 'netbanking',
    isGift: false,
    giftMessage: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const shippingFee = cartSubtotal >= freeShippingThreshold ? 0 : 99;
  const total = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  // Promo code validation
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'TOYORA10' || code === 'WELCOME10') {
      const disc = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(disc);
      setPromoApplied(true);
      addToast('Promo code applied! 10% discount added.');
    } else if (code === 'PLAY500' && cartSubtotal >= 2000) {
      setDiscountAmount(500);
      setPromoApplied(true);
      addToast('Promo code applied! ₹500 off your order.');
    } else {
      setPromoError('Invalid coupon code. Try "TOYORA10" for 10% off.');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.pincode) {
      addToast('Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          line1: formData.address + (formData.apartment ? `, ${formData.apartment}` : ''),
          city: formData.city || 'Bangalore',
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        discountApplied: discountAmount,
      });

      setConfirmedOrder(order);
    } catch (err: any) {
      addToast(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is completed, show Order Receipt Confirmation screen
  if (confirmedOrder) {
    const customerName = confirmedOrder.customerName || confirmedOrder.customer.fullName;
    const customerEmail = confirmedOrder.customerEmail || confirmedOrder.customer.email;
    const customerPhone = confirmedOrder.customerPhone || confirmedOrder.customer.phone;
    const address = confirmedOrder.shippingAddress || {
      line1: confirmedOrder.customer.addressLine1,
      city: confirmedOrder.customer.city,
      state: confirmedOrder.customer.state,
      pincode: confirmedOrder.customer.pincode
    };

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-[#E9E6DC] p-6 sm:p-10 shadow-sm space-y-8 animate-in zoom-in-95 duration-200">
          
          {/* Header checkmark */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FAEEE9] text-[#D85A38] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D85A38]">
                Order Confirmed
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#19191B]">
                Thank you for your order, {customerName}!
              </h1>
              <p className="text-xs sm:text-sm text-[#57585C]">
                We’ve received your order. Your order details are saved in this browser for this frontend-only demo.
              </p>
            </div>
          </div>

          {/* Key order highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#FAF9F5] rounded-2xl border border-[#E9E6DC] text-xs">
            <div>
              <span className="text-[#7A7A80] block text-[11px] uppercase tracking-wider">Order Reference</span>
              <strong className="font-mono font-bold text-[#19191B] text-sm">{confirmedOrder.id}</strong>
            </div>
            <div>
              <span className="text-[#7A7A80] block text-[11px] uppercase tracking-wider">Estimated Delivery</span>
              <strong className="text-[#19191B]">{confirmedOrder.estimatedDeliveryDate || confirmedOrder.estimatedDelivery}</strong>
            </div>
            <div>
              <span className="text-[#7A7A80] block text-[11px] uppercase tracking-wider">Payment</span>
              <strong className="text-emerald-700 capitalize font-bold">{confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : `${confirmedOrder.paymentMethod} (Demo)`}</strong>
            </div>
          </div>

          {/* Items Purchased Receipt */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-[#19191B] uppercase tracking-wider">
              Items in this Shipment
            </h3>
            <div className="divide-y divide-[#F4F2EA] border border-[#E9E6DC] rounded-2xl overflow-hidden bg-white">
              {confirmedOrder.items.map(item => (
                <div key={item.product.id} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#F4F2EA]"
                    />
                    <div>
                      <h4 className="font-display font-medium text-xs sm:text-sm text-[#19191B]">
                        {item.product.name}
                      </h4>
                      <span className="text-[11px] text-[#7A7A80]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="font-display font-bold text-xs sm:text-sm text-[#19191B]">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping destination summary */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E9E6DC] text-xs space-y-1">
            <strong className="text-[#19191B] block">Delivery Address:</strong>
            <p className="text-[#57585C]">
              {customerName} • {customerPhone}<br />
              {address.line1}, {address.city}, {address.state} - {address.pincode}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate({ type: 'shop' })}
              className="flex-1 py-3.5 px-4 rounded-xl font-display font-bold text-sm tracking-wide bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors shadow-md text-center"
            >
              Continue Exploring Toys
            </button>
            <button
              onClick={() => navigate({ type: 'home' })}
              className="py-3.5 px-6 rounded-xl font-display font-semibold text-sm bg-[#FAF9F5] hover:bg-[#E9E6DC] text-[#19191B] border border-[#D8D4C5] transition-colors text-center"
            >
              Return Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  // If cart is empty and user visited checkout directly
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-display font-bold text-xl text-[#19191B]">No items to checkout</h2>
        <p className="text-xs text-[#7A7A80]">Your cart is currently empty.</p>
        <button
          onClick={() => navigate({ type: 'shop' })}
          className="px-5 py-2.5 rounded-xl bg-[#19191B] text-white text-xs font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E9E6DC]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ type: 'cart' })}
            className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#E9E6DC] text-[#57585C] transition-colors"
            aria-label="Back to cart"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-[#19191B]">
              Secure Express Checkout
            </h1>
            <span className="text-xs text-[#7A7A80]">Guest checkout — no password required</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#7A7A80]">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: 3-Step Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Customer & Shipping Address */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E9E6DC] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F4F2EA]">
              <span className="w-6 h-6 rounded-full bg-[#19191B] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-display font-bold text-base text-[#19191B]">
                Contact & Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full p-2.5 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden focus:border-[#D85A38]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="radhika@example.com"
                  className="w-full p-2.5 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden focus:border-[#D85A38]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-1">
                  Phone Number (for courier updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden focus:border-[#D85A38]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-1">
                  Street Address & House No. *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House 42, 4th Cross, Indiranagar"
                  className="w-full p-2.5 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden focus:border-[#D85A38]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Bengaluru"
                  className="w-full p-2.5 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden focus:border-[#D85A38]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] block mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="560038"
                  className="w-full p-2.5 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden focus:border-[#D85A38]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Method */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E9E6DC] space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F4F2EA]">
              <span className="w-6 h-6 rounded-full bg-[#19191B] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-display font-bold text-base text-[#19191B]">
                Delivery Method
              </h2>
            </div>

            <div className="p-3.5 rounded-xl border border-[#D85A38] bg-[#FAEEE9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#D85A38]" />
                <div>
                  <div className="font-display font-bold text-xs sm:text-sm text-[#19191B]">
                    Toyora Express Courier Dispatch
                  </div>
                  <div className="text-[11px] text-[#7A7A80]">
                    Carefully packaged in FSC plastic-free recyclable cartons • 2–4 business days
                  </div>
                </div>
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#19191B]">
                {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : '₹99'}
              </span>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E9E6DC] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F4F2EA]">
              <span className="w-6 h-6 rounded-full bg-[#19191B] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-display font-bold text-base text-[#19191B]">
                Payment Option
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  formData.paymentMethod === 'upi'
                    ? 'border-[#D85A38] bg-[#FAF9F5] ring-1 ring-[#D85A38]'
                    : 'border-[#E9E6DC] hover:bg-[#FAF9F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'upi'}
                  readOnly
                  className="text-[#D85A38] focus:ring-[#D85A38]"
                />
                <div>
                  <div className="text-xs font-bold text-[#19191B]">UPI / QR Instant</div>
                  <div className="text-[10px] text-[#7A7A80]">Google Pay, PhonePe, Paytm, BHIM</div>
                </div>
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  formData.paymentMethod === 'card'
                    ? 'border-[#D85A38] bg-[#FAF9F5] ring-1 ring-[#D85A38]'
                    : 'border-[#E9E6DC] hover:bg-[#FAF9F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'card'}
                  readOnly
                  className="text-[#D85A38] focus:ring-[#D85A38]"
                />
                <div>
                  <div className="text-xs font-bold text-[#19191B]">Credit / Debit Cards</div>
                  <div className="text-[10px] text-[#7A7A80]">Visa, Mastercard, RuPay</div>
                </div>
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'netbanking' })}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  formData.paymentMethod === 'netbanking'
                    ? 'border-[#D85A38] bg-[#FAF9F5] ring-1 ring-[#D85A38]'
                    : 'border-[#E9E6DC] hover:bg-[#FAF9F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'netbanking'}
                  readOnly
                  className="text-[#D85A38] focus:ring-[#D85A38]"
                />
                <div>
                  <div className="text-xs font-bold text-[#19191B]">Net Banking</div>
                  <div className="text-[10px] text-[#7A7A80]">HDFC, ICICI, SBI, Axis & all banks</div>
                </div>
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  formData.paymentMethod === 'cod'
                    ? 'border-[#D85A38] bg-[#FAF9F5] ring-1 ring-[#D85A38]'
                    : 'border-[#E9E6DC] hover:bg-[#FAF9F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'cod'}
                  readOnly
                  className="text-[#D85A38] focus:ring-[#D85A38]"
                />
                <div>
                  <div className="text-xs font-bold text-[#19191B]">Cash on Delivery</div>
                  <div className="text-[10px] text-[#7A7A80]">Pay at your doorstep</div>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl font-display font-bold text-base tracking-wide bg-[#19191B] hover:bg-[#D85A38] text-white transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Securing your order...</span>
            ) : (
              <span>Place Order • ₹{total.toLocaleString('en-IN')}</span>
            )}
          </button>
        </form>

        {/* Right: Order Summary Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E9E6DC] space-y-5 sticky top-24">
            <h3 className="font-display font-bold text-sm text-[#19191B] uppercase tracking-wider pb-3 border-b border-[#F4F2EA]">
              Order Breakdown ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Item list in checkout */}
            <div className="max-h-56 overflow-y-auto divide-y divide-[#F4F2EA] pr-1 space-y-2">
              {cart.map(item => (
                <div key={item.product.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#F4F2EA] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-display font-medium text-[#19191B] truncate">
                        {item.product.name}
                      </div>
                      <span className="text-[10px] text-[#7A7A80]">Qty {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#19191B]">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-[#F4F2EA]">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#7A7A80] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (e.g. TOYORA10)"
                    disabled={promoApplied}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF9F5] border border-[#E9E6DC] rounded-xl focus:outline-hidden uppercase"
                  />
                </div>
                <button
                  type="submit"
                  disabled={promoApplied || !promoCode.trim()}
                  className="px-3.5 py-2 text-xs font-bold bg-[#19191B] text-white rounded-xl hover:bg-[#D85A38] disabled:opacity-40 transition-colors"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </form>
              {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
            </div>

            {/* Costs calculation */}
            <div className="space-y-2 text-xs pt-2 border-t border-[#F4F2EA]">
              <div className="flex justify-between text-[#57585C]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#19191B]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#57585C]">
                <span>Express Courier Shipping</span>
                <span className="font-semibold text-[#19191B]">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#D85A38] font-bold">
                  <span>Discount Applied</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-[#F4F2EA] flex items-baseline justify-between">
              <span className="font-display font-bold text-sm text-[#19191B]">Total Payable</span>
              <span className="font-display font-bold text-2xl text-[#19191B]">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 text-center text-[11px] text-[#7A7A80] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Certified Safe Play Guarantee • 30-Day Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
