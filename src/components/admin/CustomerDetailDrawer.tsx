import React from 'react';
import { X, Mail, Phone, MapPin, ShoppingBag, Calendar, Award } from 'lucide-react';
import { AdminCustomer } from '../../services/customerService';

interface CustomerDetailDrawerProps {
  customer: AdminCustomer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white h-[100dvh] shadow-2xl flex flex-col border-l border-[#E9E6DC] animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E9E6DC] flex items-center justify-between bg-[#FAF9F5] shrink-0">
          <div>
            <h2 className="font-display font-bold text-base text-[#19191B]">Customer Profile</h2>
            <p className="text-xs text-[#7A7A80]">Account details & purchase history</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#57585C] hover:text-[#19191B] hover:bg-[#E9E6DC] rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* Main Badge Card */}
          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E9E6DC] text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#19191B] text-white font-display font-bold text-xl flex items-center justify-center shadow-md">
              {customer.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#19191B]">{customer.fullName}</h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                customer.status === 'vip' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <Award className="w-3 h-3" /> {customer.status === 'vip' ? 'VIP Toyora Patron' : 'Active Customer'}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-4 rounded-xl border border-[#E9E6DC] space-y-2.5 text-xs text-[#57585C]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#7A7A80] shrink-0" />
              <span className="font-medium text-[#19191B]">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#7A7A80] shrink-0" />
              <span className="font-medium text-[#19191B]">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#7A7A80] shrink-0" />
              <span className="font-medium text-[#19191B]">{customer.city}, {customer.state}</span>
            </div>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#F4F2EA]">
              <Calendar className="w-4 h-4 text-[#7A7A80] shrink-0" />
              <span>Registered: {customer.joinedDate}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E9E6DC]">
              <span className="text-[10px] font-bold uppercase text-[#7A7A80]">Total Orders</span>
              <div className="font-display font-bold text-xl text-[#19191B] mt-1">
                {customer.ordersCount}
              </div>
            </div>
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E9E6DC]">
              <span className="text-[10px] font-bold uppercase text-[#7A7A80]">Lifetime Spent</span>
              <div className="font-display font-bold text-xl text-[#D85A38] mt-1">
                ₹{customer.totalSpent.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E9E6DC] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
