import React, { useState, useEffect } from 'react';
import { Search, Users, Award, Eye, Mail, Phone, MapPin } from 'lucide-react';
import { customerService, AdminCustomer } from '../../../services/customerService';

interface CustomersTabProps {
  onSelectCustomer: (customer: AdminCustomer) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, [searchQuery]);

  const loadCustomers = async () => {
    setIsLoading(true);
    const list = await customerService.getCustomers(searchQuery);
    setCustomers(list);
    setIsLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div>
          <h2 className="font-display font-bold text-lg text-[#19191B]">Customer Directory</h2>
          <p className="text-xs text-[#7A7A80]">{customers.length} customers and buyers</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#7A7A80] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search name, email, city..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-[#E9E6DC] shadow-2xs overflow-hidden">
        {/* Mobile cards */}
        <div className="block md:hidden divide-y divide-[#F4F2EA]">
          {customers.map(c => (
            <div key={c.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-[#19191B]">{c.fullName}</div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  c.status === 'vip' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {c.status.toUpperCase()}
                </span>
              </div>

              <div className="text-xs text-[#57585C] space-y-1">
                <div>{c.email} • {c.phone}</div>
                <div>{c.city}, {c.state}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F4F2EA] text-xs">
                <div>
                  <span className="text-[#7A7A80]">Spent: </span>
                  <span className="font-bold text-[#D85A38]">₹{c.totalSpent.toLocaleString('en-IN')}</span>
                  <span className="text-[#7A7A80]"> ({c.ordersCount} orders)</span>
                </div>

                <button
                  onClick={() => onSelectCustomer(c)}
                  className="p-2 text-[#57585C] hover:text-[#19191B] hover:bg-[#FAF9F5] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="View Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E9E6DC] bg-[#FAF9F5] text-[11px] font-bold uppercase text-[#7A7A80]">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Lifetime Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2EA] text-xs">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#19191B]">
                    {c.fullName}
                  </td>

                  <td className="py-3.5 px-4 text-[#57585C]">
                    <div>{c.email}</div>
                    <div className="text-[10px] text-[#7A7A80]">{c.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#57585C]">
                    {c.city}, {c.state}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[#19191B]">
                    {c.ordersCount} orders
                  </td>

                  <td className="py-3.5 px-4 font-display font-bold text-[#D85A38]">
                    ₹{c.totalSpent.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      c.status === 'vip' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectCustomer(c)}
                      className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#FAEEE9] hover:text-[#D85A38] border border-[#E9E6DC] rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
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
