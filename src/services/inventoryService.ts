import { Product, ProductCategory, AgeBracket, PlayType } from '../types';
import { api } from '../lib/api';
import { mapProductFromApi } from './productService';

export interface InventoryItem {
  product: Product;
  sku: string;
  stockCount: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

class InventoryService {
  public async getInventoryItems(searchQuery?: string, filterStatus?: string): Promise<InventoryItem[]> {
    try {
      const res = await api.get('/inventory');
      if (res.success && Array.isArray(res.data)) {
        let items: InventoryItem[] = res.data.map((item: any) => {
          let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
          if (!item.inStock || item.stockCount === 0) {
            status = 'out_of_stock';
          } else if (item.isLowStock || item.stockCount <= 10) {
            status = 'low_stock';
          }

          const product: Product = {
            id: item.productId || (item.id ? String(item.id) : 'toy_01'),
            slug: item.productId || (item.id ? String(item.id) : 'toy_01'),
            sku: item.sku || `TYR-${(item.category || 'TOY').substring(0, 3).toUpperCase()}-101`,
            name: item.name,
            tagline: '',
            category: (item.category || 'Wooden & Montessori') as ProductCategory,
            ageBracket: '3-5' as AgeBracket,
            ageDisplay: '3 Years+',
            playType: 'Create' as PlayType,
            price: Number(item.price || 0),
            originalPrice: Number(item.price || 0),
            rating: Number(item.rating || 5.0),
            reviewCount: 0,
            inStock: Boolean(item.inStock),
            stockCount: Number(item.stockCount || 0),
            description: '',
            developmentalBenefits: [],
            features: [],
            specifications: { material: '', dimensions: '', safetyStandards: '', care: '', boxContents: '' },
            images: item.image ? [item.image] : ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'],
            reviews: []
          };

          return {
            product,
            sku: item.sku || `TYR-${(item.category || 'TOY').substring(0, 3).toUpperCase()}-101`,
            stockCount: Number(item.stockCount || 0),
            status,
            lastUpdated: 'Live from DB'
          };
        });

        if (searchQuery?.trim()) {
          const q = searchQuery.toLowerCase().trim();
          items = items.filter(item =>
            item.product.name.toLowerCase().includes(q) ||
            item.sku.toLowerCase().includes(q) ||
            item.product.category.toLowerCase().includes(q)
          );
        }

        if (filterStatus && filterStatus !== 'all') {
          items = items.filter(item => item.status === filterStatus);
        }

        return items;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch inventory from API:', error);
      return [];
    }
  }

  public async updateStock(productId: string, newStockCount: number): Promise<Product | null> {
    try {
      const count = Math.max(0, Math.floor(newStockCount));
      const res = await api.patch(`/inventory/${encodeURIComponent(productId)}`, { stockCount: count });
      if (res.success && res.data) {
        return mapProductFromApi(res.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to update stock for ${productId}:`, error);
      return null;
    }
  }
}

export const inventoryService = new InventoryService();
