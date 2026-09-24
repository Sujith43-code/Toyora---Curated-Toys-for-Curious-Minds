import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle2, Clock, Truck, ShoppingCart } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';

interface OrdersTabProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onSelectOrder,
  onUpdateOrderStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = orders.filter(o => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCustomer = (o.customerName || o.customer?.fullName)?.toLowerCase().includes(q);
      const matchEmail = (o.customerEmail || o.customer?.email)?.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchEmail) return false;
    }

    if (statusFilter !== 'all' && o.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div>
          <h2 className="font-display font-bold text-lg text-[#19191B]">Order Fulfillment Queue</h2>
          <p className="text-xs text-[#7A7A80]">{filteredOrders.length} orders matching current parameters</p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex items-center p-1 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs font-semibold overflow-x-auto self-start sm:self-auto max-w-full">
          {(['all', 'pending', 'processing', 'shipped', 'delivered'] as (OrderStatus | 'all')[]).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors whitespace-nowrap ${
                statusFilter === st ? 'bg-[#19191B] text-white font-bold shadow-2xs' : 'text-[#7A7A80] hover:text-[#19191B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 text-[#7A7A80] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, customer name, email..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E9E6DC] shadow-2xs overflow-hidden">
        {/* Mobile stacked cards */}
        <div className="block md:hidden divide-y divide-[#F4F2EA]">
          {filteredOrders.map(o => (
            <div key={o.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#19191B]">{o.id}</span>
                <span className="text-[10px] text-[#7A7A80]">{o.createdAt}</span>
              </div>

              <div>
                <div className="font-bold text-sm text-[#19191B]">
                  {o.customerName || o.customer?.fullName}
                </div>
                <div className="text-xs text-[#57585C]">
                  {o.shippingAddress?.city || o.customer?.city || 'Bengaluru'} • {o.items.length} items
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F4F2EA]">
                <div className="font-display font-bold text-sm text-[#D85A38]">
                  ₹{(o.totalAmount || o.total).toLocaleString('en-IN')}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={o.status}
                    onChange={e => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className="px-2 py-1 bg-[#FAF9F5] border border-[#E9E6DC] rounded-lg text-xs font-bold capitalize text-[#19191B]"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>

                  <button
                    onClick={() => onSelectOrder(o)}
                    className="p-2 text-[#57585C] hover:text-[#19191B] hover:bg-[#FAF9F5] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E9E6DC] bg-[#FAF9F5] text-[11px] font-bold uppercase text-[#7A7A80]">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2EA] text-xs">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#19191B]">
                    {o.id}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#19191B]">
                      {o.customerName || o.customer?.fullName}
                    </div>
                    <div className="text-[10px] text-[#7A7A80]">
                      {o.customerEmail || o.customer?.email}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#57585C]">
                    {o.createdAt}
                  </td>

                  <td className="py-3.5 px-4 uppercase font-bold text-[10px] text-[#7A7A80]">
                    {o.paymentMethod}
                  </td>

                  <td className="py-3.5 px-4 font-display font-bold text-[#19191B]">
                    ₹{(o.totalAmount || o.total).toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={o.status}
                      onChange={e => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize transition-colors ${
                        o.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : o.status === 'shipped'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : o.status === 'processing'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-gray-50 text-gray-800 border-gray-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectOrder(o)}
                      className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#FAEEE9] hover:text-[#D85A38] border border-[#E9E6DC] rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
