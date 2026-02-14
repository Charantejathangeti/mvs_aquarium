
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const App: React.FC = () => {
  // Global Product State - Initialized from storage or fallback constants
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Global Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mvs_aqua_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Simulated "Backend API" Fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const savedProducts = localStorage.getItem('mvs_aqua_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // First time initialization
        setProducts(MOCK_PRODUCTS);
        localStorage.setItem('mvs_aqua_products', JSON.stringify(MOCK_PRODUCTS));
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Persist Cart Changes
  useEffect(() => {
    localStorage.setItem('mvs_aqua_cart', JSON.stringify(cart));
  }, [cart]);

  // Global Product Update Logic (Add/Edit/Delete)
  const updateGlobalProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    // Automatic Persistence
    localStorage.setItem('mvs_aqua_products', JSON.stringify(newProducts));
    
    // NOTE: For a real production site with multiple users:
    // This is where you would call: await fetch('/api/products', { method: 'POST', body: JSON.stringify(newProducts) });
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

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout cartCount={totalItems}>
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
