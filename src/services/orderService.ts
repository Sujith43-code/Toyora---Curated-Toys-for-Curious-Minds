import { Order, OrderStatus, CartItem, Product } from '../types';
import { api } from '../lib/api';
import { mapProductFromApi } from './productService';

export interface OrderFilterParams {
  searchQuery?: string;
  status?: OrderStatus | 'all';
  paymentMethod?: string | 'all';
  sortBy?: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

export function mapOrderFromApi(item: any): Order {
  const id = item.orderId || (item._id ? String(item._id) : item.id);
  const createdDate = item.createdAt ? new Date(item.createdAt) : new Date();
  const dateStr = createdDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const items: CartItem[] = Array.isArray(item.items)
    ? item.items.map((it: any) => {
        let product: Product;
        if (it.product && typeof it.product === 'object' && it.product.name) {
          product = mapProductFromApi(it.product);
        } else {
          product = {
            id: it.productId || (it.product ? String(it.product) : 'toy_01'),
            slug: it.productId || 'toy_01',
            sku: `TYR-TOY-${(it.productId || '01').slice(-3).toUpperCase()}`,
            name: it.name || 'Toyora Educational Toy',
            tagline: 'Quality playroom essential',
            category: 'Wooden & Montessori',
            ageBracket: '3-5',
            ageDisplay: '3 Years+',
            playType: 'Create',
            price: Number(it.price || 0),
            originalPrice: Number(it.price || 0),
            rating: 4.9,
            reviewCount: 12,
            inStock: true,
            stockCount: 10,
            description: 'Thoughtfully designed playroom essential.',
            developmentalBenefits: ['Fine motor skills', 'Creativity'],
            features: ['Eco-friendly', 'Non-toxic finish'],
            specifications: {
              material: 'FSC Certified Wood',
              dimensions: '25 x 15 cm',
              safetyStandards: 'BIS IS-9873',
              care: 'Wipe clean',
              boxContents: 'Play set'
            },
            images: it.image ? [it.image] : ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'],
            reviews: []
          };
        }
        return {
          product,
          quantity: Number(it.quantity || 1)
        };
      })
    : [];

  const customerDetails = item.customerDetails || item.customer || {};
  const customer = {
    fullName: customerDetails.fullName || item.customerName || 'Customer',
    email: customerDetails.email || item.customerEmail || 'customer@example.com',
    phone: customerDetails.phone || item.customerPhone || '+91 90000 00000',
    addressLine1: customerDetails.addressLine1 || item.shippingAddress?.line1 || '',
    addressLine2: customerDetails.addressLine2 || '',
    city: customerDetails.city || item.shippingAddress?.city || 'Bengaluru',
    state: customerDetails.state || item.shippingAddress?.state || 'Karnataka',
    pincode: customerDetails.pincode || item.shippingAddress?.pincode || '560001',
    deliveryNotes: customerDetails.deliveryNotes || '',
    isGift: Boolean(customerDetails.isGift),
    giftMessage: customerDetails.giftMessage || ''
  };

  const subtotal = Number(item.subtotal ?? 0);
  const shipping = Number(item.shipping ?? 0);
  const discount = Number(item.discount ?? 0);
  const total = Number(item.total ?? item.totalAmount ?? (subtotal + shipping - discount));

  return {
    id,
    createdAt: dateStr,
    items,
    customer,
    customerName: customer.fullName,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    shippingAddress: {
      line1: customer.addressLine1,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode
    },
    subtotal,
    shipping,
    discount,
    total,
    totalAmount: total,
    paymentMethod: item.paymentMethod || 'cod',
    status: item.status || 'pending',
    trackingNumber: item.trackingNumber || '',
    estimatedDeliveryDate: item.estimatedDeliveryDate || item.estimatedDelivery || '2–4 Business Days',
    estimatedDelivery: item.estimatedDelivery || item.estimatedDeliveryDate || '2–4 Business Days'
  };
}

class OrderService {
  public async getOrders(params?: OrderFilterParams): Promise<Order[]> {
    try {
      const queryParams: Record<string, string> = {};

      if (params?.searchQuery?.trim()) {
        queryParams.search = params.searchQuery.trim();
      }

      if (params?.status && params.status !== 'all') {
        queryParams.status = params.status;
      }

      const res = await api.get('/orders', queryParams);

      if (res.success && Array.isArray(res.data)) {
        let orders = res.data.map(mapOrderFromApi);

        if (params?.paymentMethod && params.paymentMethod !== 'all') {
          orders = orders.filter((o: Order) => o.paymentMethod === params.paymentMethod);
        }

        if (params?.sortBy) {
          switch (params.sortBy) {
            case 'date-desc':
              orders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              break;
            case 'date-asc':
              orders.sort((a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
              break;
            case 'amount-desc':
              orders.sort((a: Order, b: Order) => (b.totalAmount || b.total) - (a.totalAmount || a.total));
              break;
            case 'amount-asc':
              orders.sort((a: Order, b: Order) => (a.totalAmount || a.total) - (b.totalAmount || b.total));
              break;
          }
        }

        return orders;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch orders from API:', error);
      return [];
    }
  }

  public async getOrderById(id: string): Promise<Order | null> {
    try {
      const res = await api.get(`/orders/${encodeURIComponent(id)}`);
      if (res.success && res.data) {
        return mapOrderFromApi(res.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      return null;
    }
  }

  public async createOrder(orderPayload: {
    customer: any;
    items: { productId: string; quantity: number }[];
    paymentMethod: string;
    isGift?: boolean;
    giftMessage?: string;
    deliveryNotes?: string;
    discount?: number;
  }): Promise<Order> {
    try {
      const res = await api.post('/orders', orderPayload);
      if (res.success && res.data) {
        return mapOrderFromApi(res.data);
      }
      throw new Error(res.message || 'Failed to create order');
    } catch (error: any) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  public async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    try {
      const res = await api.put(`/orders/${encodeURIComponent(id)}/status`, { status });
      if (res.success && res.data) {
        return mapOrderFromApi(res.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to update status for order ${id}:`, error);
      return null;
    }
  }

  public async updateOrderTracking(id: string, trackingNumber: string, estimatedDeliveryDate?: string): Promise<Order | null> {
    try {
      const res = await api.put(`/orders/${encodeURIComponent(id)}/tracking`, {
        trackingNumber,
        estimatedDeliveryDate
      });
      if (res.success && res.data) {
        return mapOrderFromApi(res.data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to update tracking for order ${id}:`, error);
      return null;
    }
  }
}

export const orderService = new OrderService();
