import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  Sparkles, CheckCircle, AlertTriangle, X, LayoutGrid, List 
} from 'lucide-react';
import { Product, ProductCategory, AgeBracket } from '../../../types';

interface ProductsTabProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onPreviewProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

const CATEGORIES: (ProductCategory | 'all')[] = [
  'all',
  'Wooden & Montessori',
  'Building & STEM',
  'Arts & Crafts',
  'Puzzles & Brainteasers',
  'Pretend & Imaginative',
  'Active & Outdoor',
  'Sensory & Plush'
];

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  onOpenAddProduct,
  onEditProduct,
  onPreviewProduct,
  onDeleteProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedAge, setSelectedAge] = useState<AgeBracket | 'all'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filtering
  const filteredProducts = products.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchSku) return false;
    }

    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    if (selectedAge !== 'all' && p.ageBracket !== selectedAge) {
      return false;
    }

    if (stockFilter === 'in_stock' && (!p.inStock || p.stockCount <= 0)) return false;
    if (stockFilter === 'low_stock' && (p.stockCount > 10 || p.stockCount === 0)) return false;
    if (stockFilter === 'out_of_stock' && (p.stockCount > 0 && p.inStock)) return false;

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div>
          <h2 className="font-display font-bold text-lg text-[#19191B]">Product Catalogue</h2>
          <p className="text-xs text-[#7A7A80]">{filteredProducts.length} items shown out of {products.length} total</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View switcher */}
          <div className="inline-flex items-center p-1 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-2xs text-[#19191B]' : 'text-[#7A7A80]'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-2xs text-[#19191B]' : 'text-[#7A7A80]'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2.5 bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7A7A80] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search title, category, SKU..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Age Filter */}
          <div>
            <select
              value={selectedAge}
              onChange={e => setSelectedAge(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
            >
              <option value="all">All Age Groups</option>
              <option value="0-2">0–2 Years</option>
              <option value="3-5">3–5 Years</option>
              <option value="6-8">6–8 Years</option>
              <option value="9-12">9–12 Years</option>
              <option value="12+">12+ Years</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock (&gt;10)</option>
              <option value="low_stock">Low Stock (1–10)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        /* TABLE VIEW FOR DESKTOP, CARDS FOR MOBILE */
        <div className="bg-white rounded-2xl border border-[#E9E6DC] shadow-2xs overflow-hidden">
          {/* Mobile Card Stack */}
          <div className="block md:hidden divide-y divide-[#F4F2EA]">
            {filteredProducts.map(p => (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex gap-3">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#FAF9F5] border border-[#E9E6DC] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#D85A38] uppercase">
                      {p.category} • {p.ageDisplay}
                    </span>
                    <h3 className="font-display font-bold text-sm text-[#19191B] truncate">
                      {p.name}
                    </h3>
                    <div className="font-display font-bold text-xs text-[#19191B] mt-1">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F4F2EA]">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.stockCount <= 0
                      ? 'bg-red-100 text-red-800'
                      : p.stockCount <= 10
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {p.stockCount} in stock
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onPreviewProduct(p)}
                      className="p-2 text-[#57585C] hover:text-[#19191B] hover:bg-[#FAF9F5] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditProduct(p)}
                      className="p-2 text-[#57585C] hover:text-[#D85A38] hover:bg-[#FAEEE9] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Age Focus</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EA] text-xs">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-[#FAF9F5] border border-[#E9E6DC] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-display font-bold text-xs text-[#19191B] truncate max-w-xs">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-[#7A7A80] font-mono">
                            SKU: {p.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#57585C] font-medium">
                      {p.category}
                    </td>

                    <td className="py-3.5 px-4 text-[#57585C]">
                      {p.ageDisplay}
                    </td>

                    <td className="py-3.5 px-4 font-display font-bold text-[#19191B]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.stockCount <= 0
                          ? 'bg-red-100 text-red-800'
                          : p.stockCount <= 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stockCount} in stock
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onPreviewProduct(p)}
                          className="p-1.5 text-[#57585C] hover:text-[#19191B] hover:bg-[#E9E6DC] rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-1.5 text-[#57585C] hover:text-[#D85A38] hover:bg-[#FAEEE9] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#E9E6DC] p-4 space-y-3 shadow-2xs hover:shadow-md transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF9F5] border border-[#E9E6DC] relative">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#19191B] text-white">
                  {p.stockCount} left
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#D85A38]">{p.category}</span>
                <h3 className="font-display font-bold text-sm text-[#19191B] truncate">{p.name}</h3>
                <div className="font-display font-bold text-sm text-[#19191B] mt-1">
                  ₹{p.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F4F2EA] flex items-center justify-between gap-1">
                <button
                  onClick={() => onPreviewProduct(p)}
                  className="p-2 text-[#57585C] hover:text-[#19191B] hover:bg-[#FAF9F5] rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditProduct(p)}
                    className="p-1.5 text-[#57585C] hover:text-[#D85A38] hover:bg-[#FAEEE9] rounded-lg"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
