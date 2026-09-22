import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickSearchModal } from './components/QuickSearchModal';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { WishlistView } from './views/WishlistView';
import { PlayroomsView } from './views/PlayroomsView';
import { GiftFinderView } from './views/GiftFinderView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { currentRoute, toasts } = useStore();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentRoute]);

  const renderCurrentView = () => {
    switch (currentRoute.type) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product':
        return <ProductDetailView productId={currentRoute.id} />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'wishlist':
        return <WishlistView />;
      case 'playrooms':
        return <PlayroomsView />;
      case 'gift-finder':
        return <GiftFinderView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#19191B] font-sans antialiased selection:bg-[#FAEEE9] selection:text-[#D85A38]">
      {/* Global Header with mega-menu & utility alerts */}
      <Header />

      {/* Dynamic View Component */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Fast Global Search Modal */}
      <QuickSearchModal />

      {/* Floating Toast Alerts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className="bg-[#19191B] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-[#2C2D30] animate-in slide-in-from-bottom-2 flex items-center justify-between pointer-events-auto"
            >
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
