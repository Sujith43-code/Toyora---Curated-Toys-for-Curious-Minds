import { Order } from '../types';
import { api } from '../lib/api';
import { mapOrderFromApi } from './orderService';

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

export function mapCustomerFromApi(cust: any): AdminCustomer {
  const id = cust._id ? String(cust._id) : (cust.id || `cust_${cust.email}`);
  const lastDate = cust.lastOrderDate ? new Date(cust.lastOrderDate) : null;
  const lastDateStr = lastDate ? lastDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
  const joinedDate = cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Jan 2026';

  return {
    id,
    fullName: cust.fullName || 'Customer',
    email: cust.email || '',
    phone: cust.phone || '',
    city: cust.city || '',
    state: cust.state || '',
    ordersCount: Number(cust.ordersCount ?? 0),
    totalSpent: Number(cust.totalSpent ?? 0),
    lastOrderDate: lastDateStr,
    joinedDate,
    status: cust.status || (cust.totalSpent > 5000 ? 'vip' : 'active')
  };
}

class CustomerService {
  public async getCustomers(searchQuery?: string): Promise<AdminCustomer[]> {
    try {
      const queryParams: Record<string, string> = {};
      if (searchQuery?.trim()) {
        queryParams.search = searchQuery.trim();
      }

      const res = await api.get('/customers', queryParams);
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapCustomerFromApi);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch customers from API:', error);
      return [];
    }
  }

  public async getCustomerById(id: string): Promise<{ customer: AdminCustomer; orders: Order[] } | null> {
    try {
      const res = await api.get(`/customers/${encodeURIComponent(id)}`);
      if (res.success && res.data) {
        const customer = mapCustomerFromApi(res.data.customer);
        const orders = Array.isArray(res.data.orders) ? res.data.orders.map(mapOrderFromApi) : [];
        return { customer, orders };
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch customer profile ${id}:`, error);
      return null;
    }
  }
}

export const customerService = new CustomerService();
