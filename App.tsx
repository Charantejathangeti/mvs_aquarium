
import React, { useState, useEffect, useCallback } from 'react';
/* Unified react-router import for v7 compatibility */
import { HashRouter, Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Cart from './pages/Cart.tsx';
import Checkout from './pages/Checkout.tsx';
import Tracking from './pages/Tracking.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import InvoiceView from './pages/InvoiceView.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import { Product, CartItem } from './types.ts';
import { MOCK_PRODUCTS } from './constants.ts';

const GLOBAL_SYNC_BIN = '043f82e16fdf9e246988'; 

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mvs_aqua_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Global Sync Handshake - Visible to All Visitors
  const fetchGlobalRegistry = useCallback(async () => {
    try {
      const response = await fetch(`https://api.npoint.io/${GLOBAL_SYNC_BIN}`, { 
        headers: { 
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      if (response.ok) {
        const cloudData = await response.json();
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          setProducts(cloudData);
          localStorage.setItem('mvs_aqua_products', JSON.stringify(cloudData));
          return true;
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const success = await fetchGlobalRegistry();
      if (!success) {
        const local = localStorage.getItem('mvs_aqua_products');
        setProducts(local ? JSON.parse(local) : MOCK_PRODUCTS);
      }
      setIsLoading(false);
    };
    init();

    // Periodic Background Sync for Visitors (every 60s)
    const interval = setInterval(fetchGlobalRegistry, 60000);
    return () => clearInterval(interval);
  }, [fetchGlobalRegistry]);

  useEffect(() => {
    localStorage.setItem('mvs_aqua_cart', JSON.stringify(cart));
  }, [cart]);

  const updateGlobalProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('mvs_aqua_products', JSON.stringify(newProducts));
  };

  const addToCart = (product: Product, quantity: number = 1, selectedVariation?: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && item.selectedVariation === selectedVariation
      );
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedVariation === selectedVariation)
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedVariation }];
    });
  };

  const removeFromCart = (productId: string, variation?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && item.selectedVariation === variation)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, variation?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variation);
      return;
    }
    setCart(prev => prev.map(item =>
      (item.id === productId && item.selectedVariation === variation) 
        ? { ...item, quantity } 
        : item
    ));
  };

  const clearCart = () => setCart([]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-12 h-12 border-4 border-slate-100 border-t-sky-600 rounded-full animate-spin" />
           <div className="text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">MVS AQUA Registry</p>
             <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Downloading Biological Assets...</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}>
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/shop" element={<Shop products={products} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard products={products} setProducts={updateGlobalProducts} />} />
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
