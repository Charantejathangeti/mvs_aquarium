
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import InvoiceView from './pages/InvoiceView';
import About from './pages/About';
import Contact from './pages/Contact';
import { Product, CartItem, Order } from './types';
import { MOCK_PRODUCTS } from './constants';

/**
 * MVS GLOBAL MASTER REGISTRY (Cloud Database)
 * Using npoint.io as a reliable serverless JSON registry.
 */
const DATABASE_URI = 'https://api.npoint.io/043f82e16fdf9e246988';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline' | 'syncing'>('syncing');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  
  const isInitialMount = useRef(true);
  const isSyncingRef = useRef(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mvs_aqua_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const fetchGlobalRegistry = useCallback(async (isInitial = false) => {
    // Block fetch if we are currently in the middle of a push operation
    if (isSyncingRef.current) return;

    setCloudStatus('syncing');
    try {
      const response = await fetch(`${DATABASE_URI}?_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      if (response.status === 404) {
        if (isInitial) {
          setProducts(MOCK_PRODUCTS);
          setOrders([]);
        }
        setCloudStatus('online');
        setLastSyncTime('STANDBY');
        return true;
      }

      if (response.ok) {
        const data = await response.json();
        // Double check we didn't start syncing during the fetch request
        if (data && typeof data === 'object' && !isSyncingRef.current) {
          if (Array.isArray(data.products)) setProducts(data.products);
          if (Array.isArray(data.orders)) setOrders(data.orders);
          
          setCloudStatus('online');
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          return true;
        }
      }
      throw new Error(`Connectivity Warning: ${response.status}`);
    } catch (err) {
      setCloudStatus('offline');
      if (isInitial && products.length === 0) setProducts(MOCK_PRODUCTS);
      return false;
    }
  }, [products.length]);

  const pushToGlobalRegistry = async (newProducts: Product[], newOrders: Order[]) => {
    isSyncingRef.current = true;
    setCloudStatus('syncing');
    
    // Optimistic Local Update
    setProducts(newProducts);
    setOrders(newOrders);

    try {
      const payload = {
        products: newProducts,
        orders: newOrders,
        lastUpdated: new Date().toISOString()
      };

      const response = await fetch(DATABASE_URI, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setCloudStatus('online');
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        isSyncingRef.current = false;
        return true;
      }
      throw new Error("Commit Access Denied");
    } catch (err) {
      setCloudStatus('offline');
      isSyncingRef.current = false;
      return false;
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      fetchGlobalRegistry(true).then(() => setIsLoading(false));
      isInitialMount.current = false;
    }

    const heartbeat = setInterval(() => {
      if (document.visibilityState === 'visible' && !isSyncingRef.current) {
        fetchGlobalRegistry();
      }
    }, 60000);

    return () => clearInterval(heartbeat);
  }, [fetchGlobalRegistry]);

  useEffect(() => {
    localStorage.setItem('mvs_aqua_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1, selectedVariation?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedVariation === selectedVariation);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.selectedVariation === selectedVariation) ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity, selectedVariation }];
    });
  };

  const removeFromCart = (productId: string, variation?: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedVariation === variation)));
  };

  const updateQuantity = (productId: string, quantity: number, variation?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variation);
      return;
    }
    setCart(prev => prev.map(item => (item.id === productId && item.selectedVariation === variation) ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);
  
  const dbUpdateProducts = (newP: Product[]) => pushToGlobalRegistry(newP, orders);
  const dbUpdateOrders = (newO: Order[]) => pushToGlobalRegistry(products, newO);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-slate-100 border-t-cyan-500 rounded-sm animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 animate-pulse">Initializing Master Registry</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} cloudStatus={cloudStatus} lastSync={lastSyncTime}>
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/shop" element={<Shop products={products} addToCart={addToCart} cloudStatus={cloudStatus} lastSync={lastSyncTime} onRefresh={() => fetchGlobalRegistry()} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} onOrderComplete={dbUpdateOrders} orders={orders} />} />
          <Route path="/tracking" element={<Tracking orders={orders} />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard products={products} setProducts={dbUpdateProducts} orders={orders} setOrders={dbUpdateOrders} cloudStatus={cloudStatus} onReconnect={() => fetchGlobalRegistry()} />} />
          <Route path="/invoice/:id" element={<InvoiceView />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
