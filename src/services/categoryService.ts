import { ProductCategory } from '../types';
import { api } from '../lib/api';

export interface AdminCategory {
  id: string;
  name: ProductCategory;
  slug: string;
  description: string;
  ageBracketFocus: string;
  productCount: number;
  featuredImage: string;
  status: 'active' | 'archived';
}

export function mapCategoryFromApi(cat: any): AdminCategory {
  const id = cat.slug || (cat._id ? String(cat._id) : cat.id);
  return {
    id,
    name: cat.name as ProductCategory,
    slug: cat.slug || String(cat.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: cat.description || '',
    ageBracketFocus: cat.ageBracketFocus || '0–12 Years',
    productCount: Number(cat.productCount ?? 0),
    featuredImage: cat.featuredImage || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600',
    status: cat.status || 'active',
  };
}

class CategoryService {
  public async getCategories(): Promise<AdminCategory[]> {
    try {
      const res = await api.get('/categories');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapCategoryFromApi);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch categories from API:', error);
      return [];
    }
  }

  public async createCategory(data: Omit<AdminCategory, 'id' | 'productCount'>): Promise<AdminCategory> {
    try {
      const res = await api.post('/categories', data);
      if (res.success && res.data) {
        return mapCategoryFromApi(res.data);
      }
      throw new Error(res.message || 'Failed to create category');
    } catch (error: any) {
      console.error('Failed to create category:', error);
      throw error;
    }
  }

  public async updateCategory(id: string, updates: Partial<AdminCategory>): Promise<AdminCategory | null> {
    try {
      const res = await api.put(`/categories/${encodeURIComponent(id)}`, updates);
      if (res.success && res.data) {
        return mapCategoryFromApi(res.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      return null;
    }
  }

  public async deleteCategory(id: string): Promise<boolean> {
    try {
      const res = await api.delete(`/categories/${encodeURIComponent(id)}`);
      if (!res.success && res.message) {
        throw new Error(res.message);
      }
      return Boolean(res.success);
    } catch (error: any) {
      console.error(`Failed to delete category ${id}:`, error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
