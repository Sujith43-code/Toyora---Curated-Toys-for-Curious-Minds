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

const STORAGE_KEY = 'toyora_store_settings';

class SettingsService {
  public async getSettings(): Promise<StoreSettings> {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Error loading settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  }

  public async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving settings to localStorage:', e);
    }
    return updated;
  }
}

export const settingsService = new SettingsService();
