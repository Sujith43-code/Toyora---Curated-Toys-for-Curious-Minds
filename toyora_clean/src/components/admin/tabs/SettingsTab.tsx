import React, { useState, useEffect } from 'react';
import { Save, Check, Store, Truck, CreditCard, Bell, Shield } from 'lucide-react';
import { settingsService, StoreSettings } from '../../../services/settingsService';

export const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await settingsService.getSettings();
    setSettings(s);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      await settingsService.updateSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div>
          <h2 className="font-display font-bold text-lg text-[#19191B]">Toyora Store Settings</h2>
          <p className="text-xs text-[#7A7A80]">Configure currency, logistics, and payment preferences</p>
        </div>

        {isSaved && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full inline-flex items-center gap-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: STORE PROFILE */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F4F2EA]">
            <Store className="w-4 h-4 text-[#D85A38]" />
            <h3 className="font-display font-bold text-sm text-[#19191B]">Store Brand Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#19191B] mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19191B] mb-1">Support Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={e => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: SHIPPING & LOGISTICS */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F4F2EA]">
            <Truck className="w-4 h-4 text-[#D85A38]" />
            <h3 className="font-display font-bold text-sm text-[#19191B]">Shipping & Delivery Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#19191B] mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs font-bold text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19191B] mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.standardDeliveryFee}
                onChange={e => setSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs font-bold text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19191B] mb-1">Estimated Delivery Timeframe</label>
              <input
                type="text"
                value={settings.estimatedDeliveryDays}
                onChange={e => setSettings({ ...settings, estimatedDeliveryDays: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: PAYMENT GATEWAYS */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E6DC] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F4F2EA]">
            <CreditCard className="w-4 h-4 text-[#D85A38]" />
            <h3 className="font-display font-bold text-sm text-[#19191B]">Storefront Payment Methods</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] cursor-pointer">
              <span className="text-xs font-bold text-[#19191B]">Enable UPI Instant Payment (GPay, PhonePe)</span>
              <input
                type="checkbox"
                checked={settings.enableUpi}
                onChange={e => setSettings({ ...settings, enableUpi: e.target.checked })}
                className="rounded border-[#E9E6DC] text-[#D85A38] focus:ring-[#D85A38]"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] cursor-pointer">
              <span className="text-xs font-bold text-[#19191B]">Enable Credit / Debit Card Gateway</span>
              <input
                type="checkbox"
                checked={settings.enableCards}
                onChange={e => setSettings({ ...settings, enableCards: e.target.checked })}
                className="rounded border-[#E9E6DC] text-[#D85A38] focus:ring-[#D85A38]"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] cursor-pointer">
              <span className="text-xs font-bold text-[#19191B]">Enable Cash on Delivery (COD)</span>
              <input
                type="checkbox"
                checked={settings.enableCod}
                onChange={e => setSettings({ ...settings, enableCod: e.target.checked })}
                className="rounded border-[#E9E6DC] text-[#D85A38] focus:ring-[#D85A38]"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
