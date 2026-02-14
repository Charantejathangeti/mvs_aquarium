
import React, { useState, useEffect, useCallback } from 'react';
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
import { Product, CartItem } from './types';
import { MOCK_PRODUCTS } from './constants';

const GLOBAL_SYNC_BIN = '043f82e16fdf9e246988'; 

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mvs_aqua_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchGlobalRegistry = useCallback(async () => {
    try {
      const response = await fetch(`https://api.npoint.io/${GLOBAL_SYNC_BIN}?nocache=${Date.now()}`, { 
        headers: { 
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      if (response.ok) {
        const cloudData = await response.json();
        if (Array.isArray(cloudData)) {
          setProducts(cloudData);
          localStorage.setItem('mvs_aqua_products', JSON.stringify(cloudData));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("MVS Global Registry Link Failure:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      const cloudSuccess = await fetchGlobalRegistry();
      if (!cloudSuccess) {
        const local = localStorage.getItem('mvs_aqua_products');
        setProducts(local ? JSON.parse(local) : MOCK_PRODUCTS);
      }
      setIsLoading(false);
    };
    initApp();

    const interval = setInterval(fetchGlobalRegistry, 60000);
    return () => clearInterval(interval);
  }, [fetchGlobalRegistry]);

  useEffect(() => {
    localStorage.setItem('mvs_aqua_cart', JSON.stringify(cart));
  }, [cart]);

  const updateGlobalProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('mvs_aqua_products', JSON.stringify(newProducts));
    
    try {
      await fetch(`https://api.npoint.io/${GLOBAL_SYNC_BIN}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });
    } catch (err) {
      console.error("Cloud broadcast failed. Current view is local-only.", err);
    }
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-sky-600 rounded-full animate-spin mb-6" />
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">MVS Aqua Registry</p>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">Connecting to Global Feed...</p>
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
