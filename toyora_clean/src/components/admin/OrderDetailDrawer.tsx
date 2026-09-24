import React, { useState, useEffect } from 'react';
import { X, Truck, Check, Package, MapPin, Phone, Mail, CreditCard, Printer, User, Save } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { orderService } from '../../services/orderService';

interface OrderDetailDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateTracking?: (orderId: string, trackingNumber: string) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateTracking
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  const [trackingNo, setTrackingNo] = useState('');
  const [trackingSaved, setTrackingSaved] = useState(false);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
      setTrackingNo(order.trackingNumber || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatus(order.id, newStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white h-[100dvh] shadow-2xl flex flex-col border-l border-[#E9E6DC] animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E9E6DC] flex items-center justify-between bg-[#FAF9F5] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#19191B]">{order.id}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAEEE9] text-[#D85A38]">
                {order.paymentMethod}
              </span>
            </div>
            <p className="text-xs text-[#7A7A80] mt-0.5">Placed on {order.createdAt}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrint}
              className="p-2 text-[#57585C] hover:text-[#19191B] hover:bg-[#E9E6DC] rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#57585C] hover:text-[#19191B] hover:bg-[#E9E6DC] rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 min-h-0">
          {/* Order Status Control */}
          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E9E6DC] space-y-2">
            <label className="block text-xs font-bold text-[#19191B]">Fulfillment Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['pending', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map(st => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                    currentStatus === st
                      ? 'bg-[#19191B] text-white border-[#19191B] shadow-2xs'
                      : 'bg-white text-[#57585C] border-[#E9E6DC] hover:border-[#19191B]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Customer Details
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E9E6DC] space-y-2 text-xs">
              <div className="font-bold text-sm text-[#19191B]">
                {order.customerName || order.customer?.fullName}
              </div>
              <div className="flex items-center gap-2 text-[#57585C]">
                <Mail className="w-3.5 h-3.5 text-[#7A7A80]" />
                <span>{order.customerEmail || order.customer?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[#57585C]">
                <Phone className="w-3.5 h-3.5 text-[#7A7A80]" />
                <span>{order.customerPhone || order.customer?.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-[#57585C] pt-2 border-t border-[#F4F2EA]">
                <MapPin className="w-3.5 h-3.5 text-[#7A7A80] mt-0.5 shrink-0" />
                <div>
                  <div>{order.shippingAddress?.line1 || order.customer?.addressLine1}</div>
                  <div>
                    {order.shippingAddress?.city || order.customer?.city},{' '}
                    {order.shippingAddress?.state || order.customer?.state} -{' '}
                    {order.shippingAddress?.pincode || order.customer?.pincode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Products */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A80] flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Ordered Items ({order.items.length})
            </div>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E9E6DC]">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#F4F2EA] border border-[#E9E6DC]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-xs text-[#19191B] truncate">
                      {item.product.name}
                    </div>
                    <div className="text-[10px] text-[#7A7A80]">
                      {item.product.category} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-display font-bold text-xs text-[#19191B]">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E9E6DC] space-y-2 text-xs text-[#57585C]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#19191B]">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charge</span>
              <span className="font-semibold text-[#19191B]">
                {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="font-semibold">-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-[#E9E6DC] font-display font-bold text-sm text-[#19191B]">
              <span>Total Amount</span>
              <span className="text-[#D85A38]">
                ₹{(order.totalAmount || order.total).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Courier Tracking Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#19191B] flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#D85A38]" /> Tracking Reference Number
              </label>
              {trackingSaved && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingNo}
                onChange={e => {
                  setTrackingNo(e.target.value);
                  setTrackingSaved(false);
                }}
                placeholder="e.g. EXP-IN-94817263"
                className="flex-1 px-3.5 py-2 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs font-mono text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={async () => {
                  await orderService.updateOrderTracking(order.id, trackingNo);
                  onUpdateTracking?.(order.id, trackingNo);
                  setTrackingSaved(true);
                  setTimeout(() => setTrackingSaved(false), 2500);
                }}
                className="px-3.5 py-2 bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs inline-flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E9E6DC] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Close Order View
          </button>
        </div>
      </div>
    </div>
  );
};
