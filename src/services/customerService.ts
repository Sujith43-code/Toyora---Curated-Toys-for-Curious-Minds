import { Order } from '../types';
import { orderService } from './orderService';

export interface AdminCustomer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  joinedDate: string;
  status: 'active' | 'vip' | 'inactive';
}

class CustomerService {
  public async getCustomers(searchQuery?: string): Promise<AdminCustomer[]> {
    const orders = await orderService.getOrders();
    const customerMap = new Map<string, AdminCustomer>();

    orders.forEach(o => {
      const email = (o.customerEmail || o.customer?.email || 'customer@example.com').toLowerCase();
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: `cust_${email.replace(/[^a-z0-9]/g, '_')}`,
          fullName: o.customerName || o.customer?.fullName || 'Customer',
          email,
          phone: o.customerPhone || o.customer?.phone || '+91 90000 00000',
          city: o.shippingAddress?.city || o.customer?.city || 'Bengaluru',
          state: o.shippingAddress?.state || o.customer?.state || 'Karnataka',
          ordersCount: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          joinedDate: 'Jan 2026',
          status: 'active'
        });
      }
      const cust = customerMap.get(email)!;
      cust.ordersCount += 1;
      cust.totalSpent += o.total || o.totalAmount || 0;
      if (cust.totalSpent > 5000) {
        cust.status = 'vip';
      }
    });

    let customers = Array.from(customerMap.values());

    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase().trim();
      customers = customers.filter(c =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }

    return customers;
  }

  public async getCustomerById(id: string): Promise<{ customer: AdminCustomer; orders: Order[] } | null> {
    const customers = await this.getCustomers();
    const customer = customers.find(c => c.id === id);
    if (!customer) return null;

    const allOrders = await orderService.getOrders();
    const orders = allOrders.filter(o => (o.customerEmail || o.customer?.email || '').toLowerCase() === customer.email.toLowerCase());

    return { customer, orders };
  }
}

export const customerService = new CustomerService();
