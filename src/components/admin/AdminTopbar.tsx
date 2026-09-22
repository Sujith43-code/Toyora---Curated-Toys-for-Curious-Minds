import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ExternalLink, LogOut, ShieldCheck, X } from 'lucide-react';
import { AdminTab } from './AdminSidebar';
import { useStore } from '../../context/StoreContext';
import { AdminUser } from '../../services/authService';

interface AdminTopbarProps {
  activeTab: AdminTab;
  setIsMobileDrawerOpen: (open: boolean) => void;
  onSelectProduct?: (productId: string) => void;
  onSelectOrder?: (orderId: string) => void;
  adminUser?: AdminUser | null;
  onLogout?: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  activeTab,
  setIsMobileDrawerOpen,
  onSelectProduct,
  onSelectOrder,
  adminUser,
  onLogout,
}) => {
  const { products, orders, navigate } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching products & orders for instant search
  const matchedProducts = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const matchedOrders = searchQuery.trim()
    ? orders.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || (o.customerName || o.customer?.fullName)?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Operations Dashboard', subtitle: 'Store performance metrics and sales overview' },
    products: { title: 'Product Catalogue', subtitle: 'Manage toy inventory, attributes, and listings' },
    orders: { title: 'Order Fulfillment', subtitle: 'Track customer purchases, dispatch queues, and invoices' },
    customers: { title: 'Customer Directory', subtitle: 'Registered customer profiles and order histories' },
    categories: { title: 'Toy Categories', subtitle: 'Manage storefront categories and age focus groupings' },
    inventory: { title: 'Inventory Control', subtitle: 'Real-time stock counts, SKUs, and low stock warnings' },
    reviews: { title: 'Customer Reviews', subtitle: 'Moderate storefront product reviews and ratings' },
    settings: { title: 'Store Settings', subtitle: 'Preferences, shipping rates, and notification controls' }
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Admin', subtitle: 'Toyora Operations' };

  // Sample Notifications
  const sampleNotifications = [
    { id: 1, title: 'New order #TYR-928410 received', time: '10m ago', unread: true },
    { id: 2, title: 'Low stock alert: Wooden Play Gym (4 left)', time: '1h ago', unread: true },
    { id: 3, title: '5-star review submitted for Magnetic Tiles', time: '3h ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E9E6DC] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="lg:hidden p-2 text-[#57585C] hover:text-[#19191B] rounded-xl hover:bg-[#FAF9F5] border border-[#E9E6DC] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="truncate">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7A7A80] uppercase tracking-wider">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#D85A38]">{activeTab}</span>
          </div>
          <h1 className="font-display font-bold text-base sm:text-lg text-[#19191B] truncate">
            {currentTabInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile, Logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Input */}
        <div ref={searchRef} className="relative hidden md:block w-48 lg:w-64">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7A7A80] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search products, orders..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAF9F5] focus:bg-white rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:border-[#D85A38] focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7A7A80] hover:text-[#19191B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Autocomplete Overlay */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-[#E9E6DC] p-3 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              {matchedProducts.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#7A7A80] mb-1.5">Matched Products</div>
                  <div className="space-y-1">
                    {matchedProducts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProduct?.(p.id);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#FAF9F5] transition-colors flex items-center gap-2 text-xs"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-7 h-7 rounded object-cover bg-[#FAF9F5]" />
                        <span className="truncate font-semibold text-[#19191B]">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedOrders.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#7A7A80] mb-1.5">Matched Orders</div>
                  <div className="space-y-1">
                    {matchedOrders.map(o => (
                      <button
                        key={o.id}
                        onClick={() => {
                          onSelectOrder?.(o.id);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#FAF9F5] transition-colors flex items-center justify-between text-xs font-mono font-bold text-[#19191B]"
                      >
                        <span>{o.id}</span>
                        <span className="font-sans text-[11px] text-[#7A7A80]">{o.customerName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedProducts.length === 0 && matchedOrders.length === 0 && (
                <div className="text-xs text-[#7A7A80] text-center py-2">
                  No matching items found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-[#57585C] hover:text-[#19191B] hover:bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] transition-colors relative min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D85A38]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#E9E6DC] p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-[#F4F2EA]">
                <span className="font-display font-bold text-xs text-[#19191B]">Admin Notifications</span>
                <span className="text-[10px] text-[#D85A38] font-bold bg-[#FAEEE9] px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="space-y-2">
                {sampleNotifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E9E6DC] text-xs space-y-0.5">
                    <div className="font-bold text-[#19191B]">{n.title}</div>
                    <div className="text-[10px] text-[#7A7A80]">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Storefront Button */}
        <button
          onClick={() => navigate({ type: 'home' })}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold transition-colors shadow-2xs"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Profile Avatar & Admin Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E9E6DC]">
          <div className="w-8 h-8 rounded-xl bg-[#FAEEE9] text-[#D85A38] font-bold text-xs flex items-center justify-center border border-[#E9E6DC] shrink-0">
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="font-bold text-xs text-[#19191B]">{adminUser?.name || 'Admin'}</div>
            <div className="text-[10px] text-[#7A7A80]">{adminUser?.email || 'admin@toyora.in'}</div>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-[#E9E6DC] transition-colors flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
