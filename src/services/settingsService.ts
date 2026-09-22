import { api } from '../lib/api';

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  supportPhone: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  estimatedDeliveryDays: string;
  enableCod: boolean;
  enableUpi: boolean;
  enableCards: boolean;
  lowStockAlertThreshold: number;
  emailNotifications: boolean;
  orderDispatchAlerts: boolean;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'TOYORA Wooden & Playroom Essentials',
  storeEmail: 'hello@toyora.in',
  supportPhone: '+91 80 4910 2200',
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: 999,
  standardDeliveryFee: 99,
  estimatedDeliveryDays: '2–4 Business Days',
  enableCod: true,
  enableUpi: true,
  enableCards: true,
  lowStockAlertThreshold: 10,
  emailNotifications: true,
  orderDispatchAlerts: true
};

class SettingsService {
  public async getSettings(): Promise<StoreSettings> {
    try {
      const res = await api.get('/settings');
      if (res.success && res.data) {
        return {
          storeName: res.data.storeName || DEFAULT_SETTINGS.storeName,
          storeEmail: res.data.storeEmail || DEFAULT_SETTINGS.storeEmail,
          supportPhone: res.data.supportPhone || DEFAULT_SETTINGS.supportPhone,
          currency: res.data.currency || DEFAULT_SETTINGS.currency,
          currencySymbol: res.data.currencySymbol || DEFAULT_SETTINGS.currencySymbol,
          freeShippingThreshold: Number(res.data.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold),
          standardDeliveryFee: Number(res.data.standardDeliveryFee ?? DEFAULT_SETTINGS.standardDeliveryFee),
          estimatedDeliveryDays: res.data.estimatedDeliveryDays || DEFAULT_SETTINGS.estimatedDeliveryDays,
          enableCod: res.data.enableCod ?? DEFAULT_SETTINGS.enableCod,
          enableUpi: res.data.enableUpi ?? DEFAULT_SETTINGS.enableUpi,
          enableCards: res.data.enableCards ?? DEFAULT_SETTINGS.enableCards,
          lowStockAlertThreshold: Number(res.data.lowStockAlertThreshold ?? DEFAULT_SETTINGS.lowStockAlertThreshold),
          emailNotifications: res.data.emailNotifications ?? DEFAULT_SETTINGS.emailNotifications,
          orderDispatchAlerts: res.data.orderDispatchAlerts ?? DEFAULT_SETTINGS.orderDispatchAlerts
        };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to fetch settings from API:', error);
      return DEFAULT_SETTINGS;
    }
  }

  public async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    try {
      const res = await api.put('/settings', updates);
      if (res.success && res.data) {
        return {
          storeName: res.data.storeName || DEFAULT_SETTINGS.storeName,
          storeEmail: res.data.storeEmail || DEFAULT_SETTINGS.storeEmail,
          supportPhone: res.data.supportPhone || DEFAULT_SETTINGS.supportPhone,
          currency: res.data.currency || DEFAULT_SETTINGS.currency,
          currencySymbol: res.data.currencySymbol || DEFAULT_SETTINGS.currencySymbol,
          freeShippingThreshold: Number(res.data.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold),
          standardDeliveryFee: Number(res.data.standardDeliveryFee ?? DEFAULT_SETTINGS.standardDeliveryFee),
          estimatedDeliveryDays: res.data.estimatedDeliveryDays || DEFAULT_SETTINGS.estimatedDeliveryDays,
          enableCod: res.data.enableCod ?? DEFAULT_SETTINGS.enableCod,
          enableUpi: res.data.enableUpi ?? DEFAULT_SETTINGS.enableUpi,
          enableCards: res.data.enableCards ?? DEFAULT_SETTINGS.enableCards,
          lowStockAlertThreshold: Number(res.data.lowStockAlertThreshold ?? DEFAULT_SETTINGS.lowStockAlertThreshold),
          emailNotifications: res.data.emailNotifications ?? DEFAULT_SETTINGS.emailNotifications,
          orderDispatchAlerts: res.data.orderDispatchAlerts ?? DEFAULT_SETTINGS.orderDispatchAlerts
        };
      }
      throw new Error(res.message || 'Failed to update store settings');
    } catch (error: any) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();
