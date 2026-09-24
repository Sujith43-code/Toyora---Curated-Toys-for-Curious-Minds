import React from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, FolderTree, 
  Boxes, Star, Settings, ArrowLeft, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'customers' 
  | 'categories' 
  | 'inventory' 
  | 'reviews' 
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  activeOrdersCount?: number;
  lowStockCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
  activeOrdersCount = 0,
  lowStockCount = 0
}) => {
  const { navigate } = useStore();

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Products', icon: Package },
    { 
      id: 'orders' as AdminTab, 
      label: 'Orders', 
      icon: ShoppingCart, 
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-[#D85A38] text-white'
    },
    { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
    { id: 'categories' as AdminTab, label: 'Categories', icon: FolderTree },
    { 
      id: 'inventory' as AdminTab, 
      label: 'Inventory', 
      icon: Boxes, 
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300'
    },
    { id: 'reviews' as AdminTab, label: 'Reviews', icon: Star },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#FAF9F5] border-r border-[#E9E6DC]">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E9E6DC] flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#19191B] text-white font-display font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
            TY
          </div>
          {(!isCollapsed || isMobileDrawerOpen) && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-sm tracking-tight text-[#19191B]">TOYORA</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#19191B] text-white">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-[#7A7A80] truncate">Store Operations</p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileDrawerOpen(false)}
          className="lg:hidden p-1.5 text-[#57585C] hover:text-[#19191B] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 text-[#7A7A80] hover:text-[#19191B] hover:bg-[#FAF9F5] rounded-lg transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overscroll-contain">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${
                isActive
                  ? 'bg-[#FAEEE9] text-[#D85A38] shadow-2xs'
                  : 'text-[#57585C] hover:text-[#19191B] hover:bg-white'
              } ${isCollapsed && !isMobileDrawerOpen ? 'justify-center px-0' : ''}`}
              title={isCollapsed && !isMobileDrawerOpen ? item.label : undefined}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#D85A38] rounded-r-full" />
              )}

              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D85A38]' : 'text-[#7A7A80] group-hover:text-[#19191B]'}`} />

              {(!isCollapsed || isMobileDrawerOpen) && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {item.badge !== undefined && (!isCollapsed || isMobileDrawerOpen) && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Exit to Storefront */}
      <div className="p-3 border-t border-[#E9E6DC] bg-white shrink-0">
        <button
          onClick={() => navigate({ type: 'home' })}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#19191B] bg-[#FAF9F5] hover:bg-[#FAEEE9] hover:text-[#D85A38] border border-[#E9E6DC] transition-colors ${
            isCollapsed && !isMobileDrawerOpen ? 'justify-center px-0' : ''
          }`}
          title="Exit Admin to Storefront"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#7A7A80]" />
          {(!isCollapsed || isMobileDrawerOpen) && <span className="truncate">Exit to Storefront</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block h-screen sticky top-0 transition-all duration-200 z-30 ${
        isCollapsed ? 'w-18' : 'w-60'
      }`}>
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Sheet */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-start">
          <div 
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            aria-hidden="true"
          />
          <div 
            className="relative w-[85vw] max-w-[280px] h-[100dvh] max-h-[100dvh] bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200"
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
          >
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
