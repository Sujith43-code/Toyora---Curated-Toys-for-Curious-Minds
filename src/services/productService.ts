import { Product, ProductCategory, AgeBracket, PlayType } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

export interface ProductFilterParams {
  searchQuery?: string;
  category?: ProductCategory | 'all';
  stockStatus?: 'all' | 'in_stock' | 'out_of_stock' | 'low_stock';
  ageBracket?: AgeBracket | 'all';
  playType?: PlayType | 'all';
  sortBy?: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'rating-desc';
}

const STORAGE_KEY = 'toyora_admin_products';

function getStoredProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading products from localStorage:', e);
  }
  return INITIAL_PRODUCTS;
}

function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
}

class ProductService {
  public async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    let products = getStoredProducts();

    if (params?.searchQuery?.trim()) {
      const q = params.searchQuery.trim().toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (params?.category && params.category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
    }

    if (params?.ageBracket && params.ageBracket !== 'all') {
      products = products.filter(p => p.ageBracket === params.ageBracket);
    }

    if (params?.playType && params.playType !== 'all') {
      products = products.filter(p => p.playType?.toLowerCase() === params.playType?.toLowerCase());
    }

    if (params?.stockStatus) {
      if (params.stockStatus === 'in_stock') {
        products = products.filter(p => p.inStock && p.stockCount > 0);
      } else if (params.stockStatus === 'out_of_stock') {
        products = products.filter(p => !p.inStock || p.stockCount === 0);
      } else if (params.stockStatus === 'low_stock') {
        products = products.filter(p => p.stockCount > 0 && p.stockCount <= 10);
      }
    }

    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'name-asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'stock-asc':
          products.sort((a, b) => a.stockCount - b.stockCount);
          break;
        case 'stock-desc':
          products.sort((a, b) => b.stockCount - a.stockCount);
          break;
      }
    }

    return products;
  }

  public async getProductById(id: string): Promise<Product | null> {
    const products = getStoredProducts();
    const product = products.find(p => p.id === id || p.slug === id.toLowerCase());
    return product || null;
  }

  public async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const products = getStoredProducts();
    const newId = `toy-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: productData.sku || `TYR-TOY-${Math.floor(1000 + Math.random() * 9000)}`
    };
    products.unshift(newProduct);
    saveStoredProducts(products);
    return newProduct;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = getStoredProducts();
    const index = products.findIndex(p => p.id === id || p.slug === id.toLowerCase());
    if (index === -1) return null;

    const updated: Product = {
      ...products[index],
      ...updates,
      id: products[index].id // preserve id
    };
    products[index] = updated;
    saveStoredProducts(products);
    return updated;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const products = getStoredProducts();
    const filtered = products.filter(p => p.id !== id && p.slug !== id.toLowerCase());
    if (filtered.length === products.length) return false;
    saveStoredProducts(filtered);
    return true;
  }
}

export const productService = new ProductService();
