import { Product } from '../types';
import { productService } from './productService';

export interface InventoryItem {
  product: Product;
  sku: string;
  stockCount: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

class InventoryService {
  public async getInventoryItems(searchQuery?: string, filterStatus?: string): Promise<InventoryItem[]> {
    const products = await productService.getProducts();
    let items: InventoryItem[] = products.map(product => {
      let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
      if (!product.inStock || product.stockCount === 0) {
        status = 'out_of_stock';
      } else if (product.stockCount <= 10) {
        status = 'low_stock';
      }

      return {
        product,
        sku: product.sku || `TYR-SKU-${product.id}`,
        stockCount: product.stockCount,
        status,
        lastUpdated: 'Live frontend stock'
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

  public async updateStock(productId: string, newStockCount: number): Promise<Product | null> {
    const count = Math.max(0, Math.floor(newStockCount));
    const inStock = count > 0;
    const updated = await productService.updateProduct(productId, {
      stockCount: count,
      inStock
    });
    return updated;
  }
}

export const inventoryService = new InventoryService();
