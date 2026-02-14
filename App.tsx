
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

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mvs_aqua_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mvs_aqua_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1, selectedVariation?: string) => {
    setCart(prev => {
      // Find item with same ID AND same variation
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

  return (
    <HashRouter>
      <Layout cartCount={totalItems}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
