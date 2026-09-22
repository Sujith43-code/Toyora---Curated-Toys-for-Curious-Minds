export type AgeBracket = '0-2' | '3-5' | '6-8' | '9-12' | '12+';

export type PlayType = 'Build' | 'Create' | 'Explore' | 'Imagine' | 'Move';

export type ProductCategory = 
  | 'Wooden & Montessori'
  | 'Building & STEM'
  | 'Arts & Crafts'
  | 'Puzzles & Brainteasers'
  | 'Pretend & Imaginative'
  | 'Active & Outdoor'
  | 'Sensory & Plush';

export interface ProductReview {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  date: string;
  title: string;
  comment: string;
  childAge?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  ageBracket: AgeBracket;
  ageDisplay: string; // e.g. "3–6 Years" or "18M+"
  playType: PlayType;
  playroomCollection?: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isStaffPick?: boolean;
  isEcoFriendly?: boolean;
  description: string;
  developmentalBenefits: string[];
  features: string[];
  specifications: {
    material: string;
    dimensions: string;
    pieceCount?: number;
    safetyStandards: string; // e.g. "BIS IS-9873, ASTM F963, CE Certified"
    care: string;
    boxContents: string;
  };
  images: string[];
  reviews: ProductReview[];
}

export interface PlayroomStory {
  id: string;
  title: string;
  subtitle: string;
  theme?: string;
  description: string;
  heroImage: string;
  image?: string;
  playTypes: PlayType[];
  suggestedAge: string;
  ageRecommendation?: string;
  featuredProductIds: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  categories: ProductCategory[];
  ageBrackets: AgeBracket[];
  playTypes: PlayType[];
  minPrice: number;
  maxPrice: number;
  minRating: number | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  bestSellersOnly: boolean;
  playroom?: string | null;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface OrderCustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryNotes?: string;
  isGift?: boolean;
  giftMessage?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'confirmed';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: OrderCustomerDetails;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  totalAmount?: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  status: OrderStatus;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  estimatedDelivery?: string;
}

export type ViewRoute = 
  | { type: 'home' }
  | { type: 'shop'; category?: ProductCategory; age?: AgeBracket; play?: PlayType; collection?: string; search?: string }
  | { type: 'product'; id: string }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'wishlist' }
  | { type: 'playrooms' }
  | { type: 'gift-finder' }
  | { type: 'order-success'; orderId: string }
  | { type: 'admin' };
