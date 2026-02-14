
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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocalSession, setIsLocalSession] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mvs_aqua_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadRegistry = () => {
      const savedProducts = localStorage.getItem('mvs_aqua_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
        setIsLocalSession(true);
      } else {
        setProducts(MOCK_PRODUCTS);
        setIsLocalSession(false);
      }
      setIsLoading(false);
    };
    loadRegistry();
  }, []);

  useEffect(() => {
    localStorage.setItem('mvs_aqua_cart', JSON.stringify(cart));
  }, [cart]);

  const updateGlobalProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('mvs_aqua_products', JSON.stringify(newProducts));
    setIsLocalSession(true);
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
        <div className="flex flex-col items-center gap-4">
           <div className="w-10 h-10 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Biological Registry Syncing...</p>
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
