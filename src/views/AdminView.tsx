import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus } from '../types';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { authService, AdminUser } from '../services/authService';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminTopbar } from '../components/admin/AdminTopbar';
import { AdminLogin } from '../components/admin/AdminLogin';
import { DashboardTab } from '../components/admin/tabs/DashboardTab';
import { ProductsTab } from '../components/admin/tabs/ProductsTab';
import { OrdersTab } from '../components/admin/tabs/OrdersTab';
import { CustomersTab } from '../components/admin/tabs/CustomersTab';
import { CategoriesTab } from '../components/admin/tabs/CategoriesTab';
import { InventoryTab } from '../components/admin/tabs/InventoryTab';
import { ReviewsTab } from '../components/admin/tabs/ReviewsTab';
import { SettingsTab } from '../components/admin/tabs/SettingsTab';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { ProductPreviewModal } from '../components/admin/ProductPreviewModal';
import { DeleteConfirmModal } from '../components/admin/DeleteConfirmModal';
import { OrderDetailDrawer } from '../components/admin/OrderDetailDrawer';
import { CustomerDetailDrawer } from '../components/admin/CustomerDetailDrawer';
import { AdminCustomer } from '../services/customerService';
import { Loader2 } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { products, orders, deleteProduct: contextDeleteProduct, setProducts } = useStore();

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Modal & Drawer States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const [localOrders, setLocalOrders] = useState<Order[]>(orders);

  // Check admin session on mount
  useEffect(() => {
    checkAdminAuth();

    const handleUnauthorized = () => {
      setAdminUser(null);
    };

    window.addEventListener('toyora_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('toyora_unauthorized', handleUnauthorized);
  }, []);

  const checkAdminAuth = async () => {
    setIsCheckingAuth(true);
    try {
      const user = await authService.getMe();
      setAdminUser(user);
    } catch {
      setAdminUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadOrders();
    }
  }, [orders, adminUser]);

  const loadOrders = async () => {
    const list = await orderService.getOrders();
    setLocalOrders(list);
  };

  const handleLogout = () => {
    authService.logout();
    setAdminUser(null);
  };

  // Product Actions
  const handleSaveProduct = async (productData: any) => {
    if (editingProduct) {
      const updated = await productService.updateProduct(editingProduct.id, productData);
      if (updated) {
        const freshList = await productService.getProducts();
        setProducts(freshList);
      }
    } else {
      await productService.createProduct(productData);
      const freshList = await productService.getProducts();
      setProducts(freshList);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = async () => {
    if (deletingProduct) {
      contextDeleteProduct(deletingProduct.id);
      await productService.deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, status);
    loadOrders();
  };

  // Auth Loading State
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#2D5A27] animate-spin" />
        <p className="text-sm font-medium text-[#666660]">Verifying admin session...</p>
      </div>
    );
  }

  // Render Login screen if unauthenticated
  if (!adminUser) {
    return <AdminLogin onLoginSuccess={(user) => setAdminUser(user)} />;
  }

  // Counts for Badges
  const activeOrdersCount = localOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const lowStockCount = products.filter(p => p.stockCount <= 10 || !p.inStock).length;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#19191B] font-sans flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileDrawerOpen={isMobileDrawerOpen}
        setIsMobileDrawerOpen={setIsMobileDrawerOpen}
        activeOrdersCount={activeOrdersCount}
        lowStockCount={lowStockCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <AdminTopbar
          activeTab={activeTab}
          setIsMobileDrawerOpen={setIsMobileDrawerOpen}
          adminUser={adminUser}
          onLogout={handleLogout}
          onSelectProduct={(id) => {
            const p = products.find(x => x.id === id);
            if (p) setPreviewProduct(p);
          }}
          onSelectOrder={(id) => {
            const o = localOrders.find(x => x.id === id);
            if (o) setSelectedOrder(o);
          }}
        />

        {/* Tab View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardTab
              orders={localOrders}
              products={products}
              setActiveTab={setActiveTab}
              onOpenAddProduct={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onSelectOrder={setSelectedOrder}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              onOpenAddProduct={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onEditProduct={(p) => {
                setEditingProduct(p);
                setIsProductModalOpen(true);
              }}
              onPreviewProduct={setPreviewProduct}
              onDeleteProduct={setDeletingProduct}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={localOrders}
              onSelectOrder={setSelectedOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersTab
              onSelectCustomer={setSelectedCustomer}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab />
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab />
          )}

          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      <ProductPreviewModal
        product={previewProduct}
        isOpen={previewProduct !== null}
        onClose={() => setPreviewProduct(null)}
      />

      <DeleteConfirmModal
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Catalogue Product"
        itemName={deletingProduct?.name}
        message="This will remove the product listing from storefront catalog view and backend database."
      />

      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      <CustomerDetailDrawer
        customer={selectedCustomer}
        isOpen={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
};
