import { Order, OrderStatus, CartItem } from '../types';

export interface OrderFilterParams {
  searchQuery?: string;
  status?: OrderStatus | 'all';
  paymentMethod?: string | 'all';
  sortBy?: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

const STORAGE_KEY = 'toyora_orders';

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    createdAt: '22 Sep 2026',
    items: [],
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      line1: '42, Prestige Palms, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    subtotal: 2499,
    shipping: 0,
    discount: 0,
    total: 2499,
    totalAmount: 2499,
    paymentMethod: 'upi',
    status: 'processing',
    trackingNumber: 'TRK-IN-99281',
    estimatedDeliveryDate: '25 Sep 2026',
    estimatedDelivery: '25 Sep 2026',
    customer: {
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      addressLine1: '42, Prestige Palms, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    }
  },
  {
    id: 'ORD-8920',
    createdAt: '21 Sep 2026',
    items: [],
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    customerPhone: '+91 91234 56789',
    shippingAddress: {
      line1: '12/4, Green Park Extension',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016'
    },
    subtotal: 1299,
    shipping: 99,
    discount: 0,
    total: 1398,
    totalAmount: 1398,
    paymentMethod: 'cod',
    status: 'pending',
    trackingNumber: '',
    estimatedDeliveryDate: '26 Sep 2026',
    estimatedDelivery: '26 Sep 2026',
    customer: {
      fullName: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 91234 56789',
      addressLine1: '12/4, Green Park Extension',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016'
    }
  }
];

function getStoredOrders(): Order[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading orders from localStorage:', e);
  }
  return SAMPLE_ORDERS;
}

function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage:', e);
  }
}

class OrderService {
  public async getOrders(params?: OrderFilterParams): Promise<Order[]> {
    let orders = getStoredOrders();

    if (params?.searchQuery?.trim()) {
      const q = params.searchQuery.toLowerCase().trim();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.customerEmail || '').toLowerCase().includes(q) ||
        (o.customerPhone || '').includes(q)
      );
    }

    if (params?.status && params.status !== 'all') {
      orders = orders.filter(o => o.status === params.status);
    }

    if (params?.paymentMethod && params.paymentMethod !== 'all') {
      orders = orders.filter(o => o.paymentMethod === params.paymentMethod);
    }

    return orders;
  }

  public async getOrderById(id: string): Promise<Order | null> {
    const orders = getStoredOrders();
    return orders.find(o => o.id === id) || null;
  }

  public async createOrder(orderData: {
    items: CartItem[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: { line1: string; city: string; state: string; pincode: string };
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
    subtotal: number;
    shipping: number;
    discount?: number;
    total: number;
    customerDetails?: any;
  }): Promise<Order> {
    const orders = getStoredOrders();
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const newOrder: Order = {
      id,
      createdAt: today,
      items: orderData.items,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      discount: orderData.discount || 0,
      total: orderData.total,
      totalAmount: orderData.total,
      paymentMethod: orderData.paymentMethod,
      status: 'pending',
      trackingNumber: `TRK-IN-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedDeliveryDate: '2–4 Business Days',
      estimatedDelivery: '2–4 Business Days',
      customer: orderData.customerDetails || {
        fullName: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        addressLine1: orderData.shippingAddress.line1,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        pincode: orderData.shippingAddress.pincode
      }
    };

    orders.unshift(newOrder);
    saveStoredOrders(orders);
    return newOrder;
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const orders = getStoredOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    orders[idx].status = status;
    saveStoredOrders(orders);
    return orders[idx];
  }

  public async updateOrderTracking(orderId: string, trackingNumber: string): Promise<Order | null> {
    const orders = getStoredOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    orders[idx].trackingNumber = trackingNumber;
    saveStoredOrders(orders);
    return orders[idx];
  }
}

export const orderService = new OrderService();
