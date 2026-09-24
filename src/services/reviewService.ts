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

const STORAGE_KEY = 'toyora_admin_reviews';

const SAMPLE_REVIEWS: AdminReview[] = [
  {
    id: 'rev-01',
    productId: 'toy-01',
    productName: 'Nordic Solid Beech Rainbow Stacker',
    productImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=300',
    customerName: 'Ananya S.',
    customerEmail: 'ananya@example.com',
    rating: 5,
    title: 'Outstanding quality and endless play',
    comment: 'My 2-year-old builds bridges and tunnels daily. Heirloom-level craftsmanship.',
    date: '14 Jan 2026',
    verifiedPurchase: true,
    status: 'approved'
  },
  {
    id: 'rev-02',
    productId: 'toy-02',
    productName: 'Magna-Architect 100-Piece Magnetic Builder',
    productImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=300',
    customerName: 'Rohan M.',
    customerEmail: 'rohan@example.com',
    rating: 5,
    title: 'Hours of engineering fun',
    comment: 'Strong magnets and brilliant colors. Highly recommended!',
    date: '02 Feb 2026',
    verifiedPurchase: true,
    status: 'approved'
  }
];

function getStoredReviews(): AdminReview[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading reviews from localStorage:', e);
  }
  return SAMPLE_REVIEWS;
}

function saveStoredReviews(reviews: AdminReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Error saving reviews to localStorage:', e);
  }
}

class ReviewService {
  public async getReviews(statusFilter?: string): Promise<AdminReview[]> {
    let reviews = getStoredReviews();
    if (statusFilter && statusFilter !== 'all') {
      reviews = reviews.filter(r => r.status === statusFilter);
    }
    return reviews;
  }

  public async getProductReviews(productId: string): Promise<AdminReview[]> {
    const reviews = getStoredReviews();
    return reviews.filter(r => r.productId === productId && r.status === 'approved');
  }

  public async createReview(reviewData: {
    productId: string;
    productName?: string;
    productImage?: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    title: string;
    comment: string;
  }): Promise<AdminReview> {
    const reviews = getStoredReviews();
    const newRev: AdminReview = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      productName: reviewData.productName || 'Toyora Educational Toy',
      productImage: reviewData.productImage || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=300',
      customerName: reviewData.customerName,
      customerEmail: reviewData.customerEmail,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      verifiedPurchase: true,
      status: 'pending'
    };
    reviews.unshift(newRev);
    saveStoredReviews(reviews);
    return newRev;
  }

  public async updateReviewStatus(id: string, status: 'approved' | 'pending' | 'hidden'): Promise<AdminReview | null> {
    const reviews = getStoredReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;

    reviews[idx].status = status;
    saveStoredReviews(reviews);
    return reviews[idx];
  }

  public async deleteReview(id: string): Promise<boolean> {
    const reviews = getStoredReviews();
    const filtered = reviews.filter(r => r.id !== id);
    if (filtered.length === reviews.length) return false;
    saveStoredReviews(filtered);
    return true;
  }
}

export const reviewService = new ReviewService();
