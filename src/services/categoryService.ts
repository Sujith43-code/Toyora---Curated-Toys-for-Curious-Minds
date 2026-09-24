import { ProductCategory } from '../types';
import { PRODUCT_CATEGORIES } from '../data/categories';

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

const STORAGE_KEY = 'toyora_admin_categories';

function getStoredCategories(): AdminCategory[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading categories from localStorage:', e);
  }

  // Default categories from PRODUCT_CATEGORIES
  return PRODUCT_CATEGORIES.map((catName, idx) => ({
    id: `cat_${idx + 1}`,
    name: catName,
    slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Curated collection of ${catName} essentials.`,
    ageBracketFocus: '0–12 Years',
    productCount: 4,
    featuredImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600',
    status: 'active'
  }));
}

function saveStoredCategories(categories: AdminCategory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving categories to localStorage:', e);
  }
}

class CategoryService {
  public async getCategories(): Promise<AdminCategory[]> {
    return getStoredCategories();
  }

  public async createCategory(data: Omit<AdminCategory, 'id' | 'productCount'>): Promise<AdminCategory> {
    const categories = getStoredCategories();
    const newId = `cat_${Date.now()}`;
    const newCat: AdminCategory = {
      ...data,
      id: newId,
      productCount: 0,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    categories.push(newCat);
    saveStoredCategories(categories);
    return newCat;
  }

  public async updateCategory(id: string, updates: Partial<AdminCategory>): Promise<AdminCategory | null> {
    const categories = getStoredCategories();
    const index = categories.findIndex(c => c.id === id || c.slug === id.toLowerCase());
    if (index === -1) return null;

    const updated: AdminCategory = {
      ...categories[index],
      ...updates,
      id: categories[index].id
    };
    categories[index] = updated;
    saveStoredCategories(categories);
    return updated;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const categories = getStoredCategories();
    const filtered = categories.filter(c => c.id !== id && c.slug !== id.toLowerCase());
    if (filtered.length === categories.length) return false;
    saveStoredCategories(filtered);
    return true;
  }
}

export const categoryService = new CategoryService();
