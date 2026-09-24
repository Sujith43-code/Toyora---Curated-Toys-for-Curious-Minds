import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Product, CartItem, FilterState, Order, OrderCustomerDetails, 
  ViewRoute, ProductCategory, AgeBracket, PlayType, OrderStatus 
} from '../types';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info';
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  categories: [],
  ageBrackets: [],
  playTypes: [],
  minPrice: 0,
  maxPrice: 5000,
  minRating: null,
  inStockOnly: false,
  onSaleOnly: false,
  bestSellersOnly: false,
  playroom: null,
  sortBy: 'featured'
};

interface CreateOrderParams {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  discountApplied?: number;
}

interface StoreContextType {
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  currentRoute: ViewRoute;
  navigate: (route: ViewRoute) => void;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  // Search modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setQuickFilter: (filterUpdate: Partial<FilterState>) => void;
  // Orders
  orders: Order[];
  refreshOrders: () => Promise<void>;
  placeOrder: (details: OrderCustomerDetails, paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod') => Promise<Order>;
  createOrder: (params: CreateOrderParams) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  // Admin Product Edits
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  // Toast notifications
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const list = await productService.getProducts();
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products in context:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Navigation route parsing based on window location (pathname and hash)
  const parseRoute = (rawHash: string, rawPathname: string): ViewRoute => {
    try {
      const cleanHash = decodeURIComponent(rawHash.replace(/^#\/?/, '').split('?')[0]);
      const cleanPath = decodeURIComponent(rawPathname.replace(/^\/+|\/+$/g, '').split('?')[0]);
      const routeStr = cleanHash || cleanPath;

      if (!routeStr) return { type: 'home' };
      if (routeStr === 'shop') return { type: 'shop' };
      if (routeStr.startsWith('product/')) {
        const id = routeStr.split('/')[1];
        return id ? { type: 'product', id } : { type: 'shop' };
      }
      if (routeStr === 'cart') return { type: 'cart' };
      if (routeStr === 'checkout') return { type: 'checkout' };
      if (routeStr === 'wishlist') return { type: 'wishlist' };
      if (routeStr === 'playrooms') return { type: 'playrooms' };
      if (routeStr === 'gift-finder') return { type: 'gift-finder' };
      if (routeStr === 'admin') return { type: 'admin' };
      return { type: 'home' };
    } catch {
      return { type: 'home' };
    }
  };

  const [currentRoute, setCurrentRoute] = useState<ViewRoute>(() => {
    return parseRoute(window.location.hash, window.location.pathname);
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('toyora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toyora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search UI
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toyora_recent_searches');
      return saved ? JSON.parse(saved) : ['magnetic tiles', 'wooden stacker', 'botanical clay', 'solar rover'];
    } catch {
      return ['magnetic tiles', 'wooden stacker'];
    }
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = async () => {
    try {
      const list = await orderService.getOrders();
      setOrders(list);
    } catch (err: any) {
      console.error('Failed to load orders in context:', err);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync transient client state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('toyora_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('toyora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Sync route to URL hash
  const navigate = (route: ViewRoute) => {
    setCurrentRoute(route);
    let hash = '';
    switch (route.type) {
      case 'home':
        hash = '';
        break;
      case 'shop':
        hash = 'shop';
        break;
      case 'product':
        hash = `product/${route.id}`;
        break;
      case 'cart':
        hash = 'cart';
        break;
      case 'checkout':
        hash = 'checkout';
        break;
      case 'wishlist':
        hash = 'wishlist';
        break;
      case 'playrooms':
        hash = 'playrooms';
        break;
      case 'gift-finder':
        hash = 'gift-finder';
        break;
      case 'admin':
        hash = 'admin';
        break;
    }
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to hash and popstate changes
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(parseRoute(window.location.hash, window.location.pathname));
    };
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, openDrawer = true) => {
    const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + safeQty }
            : item
        );
      }
      return [...prev, { product, quantity: safeQty }];
    });
    addToast(`Added "${product.name}" to cart`);
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const safeQty = Math.floor(Number(quantity));
    if (isNaN(safeQty) || safeQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const freeShippingThreshold = 999;

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from saved wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const wishlistCount = wishlist.length;

  // Recent Searches
  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem('toyora_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const setQuickFilter = (filterUpdate: Partial<FilterState>) => {
    setFilters(prev => ({
      ...DEFAULT_FILTERS,
      ...filterUpdate
    }));
  };

  // Place Order
  const placeOrder = async (
    details: OrderCustomerDetails, 
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod'
  ): Promise<Order> => {
    const subtotal = cartSubtotal;
    const shipping = subtotal >= freeShippingThreshold ? 0 : 99;
    const total = subtotal + shipping;

    const createdOrder = await orderService.createOrder({
      items: cart,
      customerName: details.fullName,
      customerEmail: details.email,
      customerPhone: details.phone,
      shippingAddress: {
        line1: details.addressLine1,
        city: details.city,
        state: details.state,
        pincode: details.pincode
      },
      paymentMethod,
      subtotal,
      shipping,
      total,
      customerDetails: details
    });

    setOrders(prev => [createdOrder, ...prev]);
    clearCart();
    refreshProducts();
    return createdOrder;
  };

  // Create Order (convenience helper for checkout)
  const createOrder = async (params: CreateOrderParams): Promise<Order> => {
    const subtotal = cartSubtotal;
    const shipping = subtotal >= freeShippingThreshold ? 0 : 99;
    const discount = params.discountApplied || 0;
    const total = subtotal + shipping - discount;

    const createdOrder = await orderService.createOrder({
      items: cart,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      shippingAddress: params.shippingAddress,
      paymentMethod: params.paymentMethod,
      subtotal,
      shipping,
      discount,
      total
    });

    setOrders(prev => [createdOrder, ...prev]);
    clearCart();
    refreshProducts();
    return createdOrder;
  };

  // Update order status in local browser storage
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, status);
    if (updated) {
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      addToast(`Order ${orderId} marked as ${status}`);
    }
  };

  // Admin product edits in local browser storage
  const updateProduct = async (updatedProduct: Product) => {
    const result = await productService.updateProduct(updatedProduct.id, updatedProduct);
    if (result) {
      setProducts(prev => prev.map(p => p.id === result.id ? result : p));
      addToast(`Product "${result.name}" updated`);
    }
  };

  const addProduct = async (newProduct: Product) => {
    const result = await productService.createProduct(newProduct);
    if (result) {
      setProducts(prev => [result, ...prev]);
      addToast(`New product "${result.name}" created`);
    }
  };

  const deleteProduct = async (productId: string) => {
    const success = await productService.deleteProduct(productId);
    if (success) {
      setProducts(prev => {
        const prod = prev.find(p => p.id === productId);
        if (prod) {
          addToast(`Product "${prod.name}" removed`, 'info');
        }
        return prev.filter(p => p.id !== productId);
      });
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        refreshProducts,
        currentRoute,
        navigate,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        freeShippingThreshold,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        isSearchOpen,
        setIsSearchOpen,
        recentSearches,
        addRecentSearch,
        filters,
        setFilters,
        resetFilters,
        setQuickFilter,
        orders,
        refreshOrders,
        placeOrder,
        createOrder,
        updateOrderStatus,
        setProducts,
        updateProduct,
        addProduct,
        deleteProduct,
        toasts,
        addToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
