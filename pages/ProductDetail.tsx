
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Minus, Plus, Weight, ChevronRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface ProductDetailProps {
  addToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 bg-white">
        <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
           <RefreshCw size={48} className="animate-spin-slow" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Species Not Found</h2>
          <p className="text-slate-400 font-medium">The livestock you're looking for might be out of stock.</p>
        </div>
        <Link to="/shop" className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-sky-600 transition-all">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-slate-400 mb-12 overflow-x-auto whitespace-nowrap pb-4 md:pb-0">
          <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-sky-600 transition-colors">Stock</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Left: Images */}
          <div className="space-y-8">
            <div className="relative aspect-square rounded-[3.5rem] overflow-hidden bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute top-10 right-10 flex flex-col gap-4">
                 <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
                    <Weight size={24} className="text-sky-500 mb-1" />
                    <span className="text-[10px] font-black text-slate-900">{product.weight} KG</span>
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 bg-white cursor-pointer hover:border-sky-500 transition-all shadow-sm active:scale-95">
                  <img 
                    src={`https://picsum.photos/seed/aqua_v2_${i + parseInt(product.id)}/400/400`} 
                    alt="" 
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-50 border border-sky-100 rounded-xl text-sky-600 text-[10px] font-black uppercase tracking-widest mb-8 shadow-sm">
                <span>Verified Stock</span>
                <span className="w-1 h-1 rounded-full bg-sky-400" />
                <span>{product.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{product.name}</h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl md:text-5xl font-black text-sky-600 tracking-tighter">₹{product.price.toFixed(0)}</p>
                <div className="flex flex-col items-start border-l border-slate-100 pl-6">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Packaging unit</span>
                   <span className="text-lg font-bold text-slate-700">50 Pieces</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/40 mb-12">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Product Description</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12">
                <div className="flex flex-col space-y-4">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Select Quantity</span>
                  <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm h-16 w-fit overflow-hidden">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-16 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border-r border-slate-100"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-8 font-black text-slate-900 text-xl min-w-[80px] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-16 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border-l border-slate-100"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">In Stock Ready</span>
                  </div>
                  <p className="text-slate-400 text-sm font-bold">{product.stock} sets available today</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow py-6 bg-slate-900 hover:bg-sky-600 text-white font-black rounded-[2rem] flex items-center justify-center space-x-4 transition-all shadow-2xl shadow-slate-900/10 transform active:scale-95"
                >
                  <ShoppingCart size={24} />
                  <span className="text-xl">Add to Cart</span>
                </button>
                <Link 
                  to="/shop" 
                  className="px-10 py-6 bg-white border border-slate-200 text-slate-900 font-black rounded-[2rem] hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
                >
                  Back to Stock
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-16 border-t border-slate-100">
              <div className="flex flex-col items-center text-center p-6 rounded-[2rem] bg-white border border-slate-50 shadow-sm">
                <div className="text-sky-500 mb-4 bg-sky-50 p-4 rounded-2xl shadow-inner shadow-sky-100"><ShieldCheck size={28} /></div>
                <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-widest mb-2">Quality Check</h4>
                <p className="text-slate-400 text-[10px] font-bold">100% Health Guarantee</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-[2rem] bg-white border border-slate-50 shadow-sm">
                <div className="text-sky-500 mb-4 bg-sky-50 p-4 rounded-2xl shadow-inner shadow-sky-100"><Truck size={28} /></div>
                <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-widest mb-2">Live Delivery</h4>
                <p className="text-slate-400 text-[10px] font-bold">Safe Transit Handling</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-[2rem] bg-white border border-slate-50 shadow-sm">
                <div className="text-sky-500 mb-4 bg-sky-50 p-4 rounded-2xl shadow-inner shadow-sky-100"><RefreshCw size={28} /></div>
                <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-widest mb-2">DOA Policy</h4>
                <p className="text-slate-400 text-[10px] font-bold">Instant Replacement Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
