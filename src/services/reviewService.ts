import { api } from '../lib/api';

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'hidden';
}

export function mapReviewFromApi(rev: any): AdminReview {
  const id = rev.reviewId || (rev._id ? String(rev._id) : rev.id);
  const createdDate = rev.createdAt ? new Date(rev.createdAt) : new Date();
  const dateStr = createdDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return {
    id,
    productId: rev.productId || (rev.product ? String(rev.product) : ''),
    productName: rev.productName || 'Toyora Product',
    productImage: rev.productImage || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=300',
    customerName: rev.customerName || 'Verified Customer',
    customerEmail: rev.customerEmail || '',
    rating: Number(rev.rating || 5),
    title: rev.title || '',
    comment: rev.comment || '',
    date: dateStr,
    verifiedPurchase: rev.verifiedPurchase ?? true,
    status: rev.status || 'pending'
  };
}

class ReviewService {
  public async getReviews(statusFilter?: string): Promise<AdminReview[]> {
    try {
      const queryParams: Record<string, string> = {};
      if (statusFilter && statusFilter !== 'all') {
        queryParams.status = statusFilter;
      }

      const res = await api.get('/reviews', queryParams);
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapReviewFromApi);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch reviews from API:', error);
      return [];
    }
  }

  public async getProductReviews(productId: string): Promise<AdminReview[]> {
    try {
      const res = await api.get(`/reviews/product/${encodeURIComponent(productId)}`);
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapReviewFromApi);
      }
      return [];
    } catch (error) {
      console.error(`Failed to fetch reviews for product ${productId}:`, error);
      return [];
    }
  }

  public async createReview(reviewData: {
    productId: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    title: string;
    comment: string;
    childAge?: string;
  }): Promise<AdminReview> {
    try {
      const res = await api.post('/reviews', reviewData);
      if (res.success && res.data) {
        return mapReviewFromApi(res.data);
      }
      throw new Error(res.message || 'Failed to submit review');
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  }

  public async updateReviewStatus(id: string, status: 'approved' | 'pending' | 'hidden'): Promise<AdminReview | null> {
    try {
      const res = await api.patch(`/reviews/${encodeURIComponent(id)}/moderation`, { status });
      if (res.success && res.data) {
        return mapReviewFromApi(res.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to update review moderation ${id}:`, error);
      return null;
    }
  }

  public async deleteReview(id: string): Promise<boolean> {
    try {
      const res = await api.delete(`/reviews/${encodeURIComponent(id)}`);
      return Boolean(res.success);
    } catch (error) {
      console.error(`Failed to delete review ${id}:`, error);
      return false;
    }
  }
}

export const reviewService = new ReviewService();
