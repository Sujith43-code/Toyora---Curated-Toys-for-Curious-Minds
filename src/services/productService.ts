import { Product, ProductCategory, AgeBracket, PlayType } from '../types';
import { api } from '../lib/api';

export interface ProductFilterParams {
  searchQuery?: string;
  category?: ProductCategory | 'all';
  stockStatus?: 'all' | 'in_stock' | 'out_of_stock' | 'low_stock';
  ageBracket?: AgeBracket | 'all';
  playType?: PlayType | 'all';
  sortBy?: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'rating-desc';
}

export function mapProductFromApi(item: any): Product {
  const id = item.productId || (item._id ? String(item._id) : item.id);
  return {
    id,
    slug: item.slug || String(id).toLowerCase(),
    sku: item.sku || `TYR-${(item.category || 'TOY').substring(0, 3).toUpperCase()}-${String(id).slice(-4).toUpperCase()}`,
    name: item.name,
    tagline: item.tagline || '',
    category: item.category as ProductCategory,
    ageBracket: item.ageBracket as AgeBracket,
    ageDisplay: item.ageDisplay || (item.ageBracket === '0-2' ? '0–2 Years' : item.ageBracket === '3-5' ? '3–5 Years' : item.ageBracket === '6-8' ? '6–8 Years' : item.ageBracket === '9-12' ? '9–12 Years' : '12+ Years'),
    playType: item.playType as PlayType,
    playroomCollection: item.playroomCollection || '',
    price: Number(item.price),
    originalPrice: item.originalPrice !== undefined ? Number(item.originalPrice) : Number(item.price),
    discountPercent: item.discountPercent,
    rating: item.rating !== undefined ? Number(item.rating) : 5.0,
    reviewCount: item.reviewCount !== undefined ? Number(item.reviewCount) : 0,
    inStock: Boolean(item.inStock),
    stockCount: Number(item.stockCount ?? 0),
    isBestSeller: Boolean(item.isBestSeller),
    isNewArrival: Boolean(item.isNewArrival),
    isStaffPick: Boolean(item.isStaffPick),
    isEcoFriendly: Boolean(item.isEcoFriendly),
    description: item.description || '',
    developmentalBenefits: Array.isArray(item.developmentalBenefits) ? item.developmentalBenefits : [],
    features: Array.isArray(item.features) ? item.features : [],
    specifications: item.specifications || {
      material: 'Sustainably Sourced Material',
      dimensions: 'Standard Size',
      safetyStandards: 'BIS IS-9873, ASTM F963',
      care: 'Wipe clean with a soft cloth',
      boxContents: 'Play set with guide'
    },
    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'],
    reviews: Array.isArray(item.reviews) ? item.reviews : []
  };
}

class ProductService {
  public async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    try {
      const queryParams: Record<string, string> = {};

      if (params?.searchQuery?.trim()) {
        queryParams.search = params.searchQuery.trim();
      }

      if (params?.category && params.category !== 'all') {
        queryParams.category = params.category;
      }

      if (params?.ageBracket && params.ageBracket !== 'all') {
        queryParams.age = params.ageBracket;
      }

      if (params?.playType && params.playType !== 'all') {
        queryParams.play = params.playType;
      }

      if (params?.stockStatus === 'in_stock') {
        queryParams.inStock = 'true';
      }

      if (params?.sortBy) {
        if (params.sortBy === 'price-asc') queryParams.sortBy = 'price-asc';
        else if (params.sortBy === 'price-desc') queryParams.sortBy = 'price-desc';
        else if (params.sortBy === 'rating-desc') queryParams.sortBy = 'rating';
      }

      const res = await api.get('/products', queryParams);
      if (res.success && Array.isArray(res.data)) {
        let products = res.data.map(mapProductFromApi);

        // Apply client-side refine filters if backend query parameters didn't cover stock status or client-only sort
        if (params?.stockStatus) {
          if (params.stockStatus === 'out_of_stock') {
            products = products.filter((p: Product) => !p.inStock || p.stockCount === 0);
          } else if (params.stockStatus === 'low_stock') {
            products = products.filter((p: Product) => p.stockCount > 0 && p.stockCount <= 10);
          }
        }

        if (params?.sortBy) {
          switch (params.sortBy) {
            case 'name-asc':
              products.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
              break;
            case 'name-desc':
              products.sort((a: Product, b: Product) => b.name.localeCompare(a.name));
              break;
            case 'stock-asc':
              products.sort((a: Product, b: Product) => a.stockCount - b.stockCount);
              break;
            case 'stock-desc':
              products.sort((a: Product, b: Product) => b.stockCount - a.stockCount);
              break;
          }
        }

        return products;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch products from API:', error);
      return [];
    }
  }

  public async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await api.get(`/products/${encodeURIComponent(id)}`);
      if (res.success && res.data) {
        return mapProductFromApi(res.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch product ${id} from API:`, error);
      return null;
    }
  }

  public async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    try {
      const res = await api.post('/products', productData);
      if (res.success && res.data) {
        return mapProductFromApi(res.data);
      }
      throw new Error(res.message || 'Failed to create product');
    } catch (error: any) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await api.put(`/products/${encodeURIComponent(id)}`, updates);
      if (res.success && res.data) {
        return mapProductFromApi(res.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      return null;
    }
  }

  public async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await api.delete(`/products/${encodeURIComponent(id)}`);
      return Boolean(res.success);
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      return false;
    }
  }
}

export const productService = new ProductService();
