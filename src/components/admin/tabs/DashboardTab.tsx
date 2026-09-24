import React from 'react';
import { 
  TrendingUp, ShoppingBag, Package, DollarSign, AlertTriangle, 
  ArrowRight, Plus, Users, Star, Eye, CheckCircle2, Clock 
} from 'lucide-react';
import { SalesChart } from '../SalesChart';
import { Order, Product } from '../../../types';
import { AdminTab } from '../AdminSidebar';

interface DashboardTabProps {
  orders: Order[];
  products: Product[];
  setActiveTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
  onSelectOrder: (order: Order) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  orders,
  products,
  setActiveTab,
  onOpenAddProduct,
  onSelectOrder
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockProducts = products.filter(p => p.stockCount <= 10 || !p.inStock);

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#7A7A80]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl text-[#19191B]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs prev week</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#7A7A80]">
            <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAEEE9] text-[#D85A38] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl text-[#19191B]">
            {totalOrders}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.0% volume growth</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#7A7A80]">
            <span className="text-xs font-bold uppercase tracking-wider">Catalogue Items</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl text-[#19191B]">
            {products.length} Products
          </div>
          <div className="text-xs text-amber-800 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{lowStockProducts.length} low in stock</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#7A7A80]">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl text-[#19191B]">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#7A7A80]">
            Across active transactions
          </div>
        </div>
      </div>

      {/* Main Row: Sales Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 Cols) */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Quick Actions & Stock Alerts (1 Col) */}
        <div className="space-y-4">
          {/* Quick Action Buttons */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-3">
            <h3 className="font-display font-bold text-sm text-[#19191B]">Quick Admin Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenAddProduct}
                className="p-3 bg-[#FAF9F5] hover:bg-[#FAEEE9] hover:text-[#D85A38] border border-[#E9E6DC] rounded-xl text-left text-xs font-bold transition-colors space-y-1.5"
              >
                <Plus className="w-4 h-4 text-[#D85A38]" />
                <div>Add Product</div>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="p-3 bg-[#FAF9F5] hover:bg-[#FAEEE9] hover:text-[#D85A38] border border-[#E9E6DC] rounded-xl text-left text-xs font-bold transition-colors space-y-1.5"
              >
                <ShoppingBag className="w-4 h-4 text-[#D85A38]" />
                <div>Fulfill Orders</div>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className="p-3 bg-[#FAF9F5] hover:bg-[#FAEEE9] hover:text-[#D85A38] border border-[#E9E6DC] rounded-xl text-left text-xs font-bold transition-colors space-y-1.5"
              >
                <Package className="w-4 h-4 text-[#D85A38]" />
                <div>Stock Audit</div>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className="p-3 bg-[#FAF9F5] hover:bg-[#FAEEE9] hover:text-[#D85A38] border border-[#E9E6DC] rounded-xl text-left text-xs font-bold transition-colors space-y-1.5"
              >
                <Star className="w-4 h-4 text-[#D85A38]" />
                <div>Reviews</div>
              </button>
            </div>
          </div>

          {/* Low Stock Warning Card */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Low Inventory Warnings</span>
              </div>
              <div className="space-y-2 pt-1">
                {lowStockProducts.slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-xl border border-amber-200">
                    <span className="font-medium text-[#19191B] truncate max-w-[140px]">{p.name}</span>
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
                      {p.stockCount} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-[#E9E6DC] p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F2EA]">
          <div>
            <h3 className="font-display font-bold text-base text-[#19191B]">Recent Store Orders</h3>
            <p className="text-xs text-[#7A7A80]">Latest customer purchases requiring fulfillment</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#D85A38] hover:underline inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Responsive Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E9E6DC] text-[11px] font-bold uppercase text-[#7A7A80]">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2EA] text-xs">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#19191B]">
                    {o.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#19191B]">
                      {o.customerName || o.customer?.fullName}
                    </div>
                    <div className="text-[10px] text-[#7A7A80]">
                      {o.shippingAddress?.city || o.customer?.city || 'Bengaluru'}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#57585C]">
                    {o.createdAt}
                  </td>
                  <td className="py-3 px-3 font-display font-bold text-[#19191B]">
                    ₹{(o.totalAmount || o.total).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize inline-flex items-center gap-1 ${
                      o.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : o.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : o.status === 'processing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {o.status === 'delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectOrder(o)}
                      className="p-1.5 text-[#57585C] hover:text-[#19191B] hover:bg-[#E9E6DC] rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
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
