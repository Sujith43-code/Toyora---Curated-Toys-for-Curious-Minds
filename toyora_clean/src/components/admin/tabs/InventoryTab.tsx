import React, { useState, useEffect } from 'react';
import { Search, Boxes, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { inventoryService, InventoryItem } from '../../../services/inventoryService';

export const InventoryTab: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingStockMap, setEditingStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    loadInventory();
  }, [searchQuery, filterStatus]);

  const loadInventory = async () => {
    const list = await inventoryService.getInventoryItems(searchQuery, filterStatus);
    setItems(list);
  };

  const handleStockChange = (productId: string, val: number) => {
    setEditingStockMap(prev => ({
      ...prev,
      [productId]: val
    }));
  };

  const handleSaveStock = async (productId: string) => {
    const newStock = editingStockMap[productId];
    if (newStock !== undefined) {
      await inventoryService.updateStock(productId, newStock);
      // clear local edit state
      setEditingStockMap(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      loadInventory();
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div>
          <h2 className="font-display font-bold text-lg text-[#19191B]">Inventory Control & Stock Audit</h2>
          <p className="text-xs text-[#7A7A80]">Update stock counts and monitor low inventory warnings</p>
        </div>

        <button
          onClick={loadInventory}
          className="px-3.5 py-2 bg-[#FAF9F5] hover:bg-[#FAEEE9] hover:text-[#D85A38] border border-[#E9E6DC] text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7A7A80] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search product, SKU, category..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
          >
            <option value="all">All Inventory Statuses</option>
            <option value="in_stock">In Stock (&gt;10)</option>
            <option value="low_stock">Low Stock Warning (1–10)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#E9E6DC] shadow-2xs overflow-hidden">
        {/* Mobile cards */}
        <div className="block md:hidden divide-y divide-[#F4F2EA]">
          {items.map(item => {
            const currentStock = editingStockMap[item.product.id] ?? item.stockCount;
            const isModified = editingStockMap[item.product.id] !== undefined && editingStockMap[item.product.id] !== item.stockCount;

            return (
              <div key={item.product.id} className="p-4 space-y-3">
                <div className="flex gap-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-[#FAF9F5] border border-[#E9E6DC]" />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-xs text-[#19191B] truncate">{item.product.name}</div>
                    <div className="text-[10px] text-[#7A7A80] font-mono">SKU: {item.sku}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F4F2EA]">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={currentStock}
                      onChange={e => handleStockChange(item.product.id, Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-[#FAF9F5] rounded-lg border border-[#E9E6DC] text-xs font-bold text-center"
                    />
                    {isModified && (
                      <button
                        onClick={() => handleSaveStock(item.product.id)}
                        className="px-2.5 py-1 bg-[#19191B] text-white text-xs font-bold rounded-lg"
                      >
                        Save
                      </button>
                    )}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'out_of_stock'
                      ? 'bg-red-100 text-red-800'
                      : item.status === 'low_stock'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E9E6DC] bg-[#FAF9F5] text-[11px] font-bold uppercase text-[#7A7A80]">
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Last Audit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2EA] text-xs">
              {items.map(item => {
                const currentStock = editingStockMap[item.product.id] ?? item.stockCount;
                const isModified = editingStockMap[item.product.id] !== undefined && editingStockMap[item.product.id] !== item.stockCount;

                return (
                  <tr key={item.product.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 rounded-xl object-cover bg-[#FAF9F5] border border-[#E9E6DC]" />
                        <div>
                          <div className="font-display font-bold text-xs text-[#19191B]">{item.product.name}</div>
                          <div className="text-[10px] text-[#7A7A80] font-mono">SKU: {item.sku}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#57585C]">
                      {item.product.category}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'out_of_stock'
                          ? 'bg-red-100 text-red-800'
                          : item.status === 'low_stock'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        value={currentStock}
                        onChange={e => handleStockChange(item.product.id, Number(e.target.value))}
                        className="w-20 px-2.5 py-1 bg-[#FAF9F5] focus:bg-white rounded-lg border border-[#E9E6DC] text-xs font-bold text-[#19191B] text-center"
                      />
                    </td>

                    <td className="py-3.5 px-4 text-[#7A7A80]">
                      {item.lastUpdated}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isModified ? (
                        <button
                          onClick={() => handleSaveStock(item.product.id)}
                          className="px-3 py-1.5 bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-[#7A7A80]">Synced</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
