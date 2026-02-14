
import React, { useState, useMemo } from 'react';
/* Update to react-router unified package */
import { useParams, useNavigate, Link } from 'react-router';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Minus, Plus, Weight, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  products: Product[];
  addToCart: (product: Product, quantity: number, variation?: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    return products.find((p: Product) => p.id === id);
  }, [id, products]);

  const [selectedVar, setSelectedVar] = useState<string | undefined>(
    product?.variations?.[0]?.name
  );

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 bg-white">
        <div className="w-24 h-24 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 rounded-sm">
           <RefreshCw size={48} className="animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Species Not Found</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">The livestock you're looking for might be out of stock.</p>
        </div>
        <Link to="/shop" className="px-10 py-4 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 transition-all rounded-sm">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const currentVariation = product.variations?.find(v => v.name === selectedVar);
  const finalPrice = product.price + (currentVariation?.priceModifier || 0);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVar);
    navigate('/cart');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-10 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-black transition-colors">Stock</Link>
          <ChevronRight size={10} />
          <span className="text-black uppercase">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-white border border-slate-100 shadow-sm overflow-hidden group rounded-sm">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute top-6 right-6">
                 <div className="px-3 py-2 bg-black/80 backdrop-blur-sm text-white rounded-sm border border-white/10 flex flex-col items-center">
                    <Weight size={14} className="text-sky-400 mb-1" />
                    <span className="text-[9px] font-black tracking-widest uppercase">{product.weight} KG</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-500 text-[8px] font-black uppercase tracking-widest mb-6">
                <span>Verified Stock</span>
                <span className="w-1 h-1 rounded-full bg-sky-500" />
                <span>{product.category}</span>
              </div>
              <h1 className="text-4xl font-black text-black mb-4 tracking-tighter leading-none uppercase">{product.name}</h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl font-black text-sky-600 tracking-tighter">₹{finalPrice.toLocaleString()}</p>
                <div className="flex flex-col items-start border-l border-slate-200 pl-6">
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Biological ID</span>
                   <span className="text-[10px] font-black text-black uppercase tracking-widest">#{product.id.slice(-6)}</span>
                </div>
              </div>
            </div>

            {/* Variation Selector */}
            {product.variations && product.variations.length > 0 && (
              <div className="mb-10 animate-fade-in">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Select Configuration</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedVar(v.name)}
                      className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all rounded-sm ${
                        selectedVar === v.name
                          ? 'bg-black text-white border-black shadow-lg'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-black'
                      }`}
                    >
                      {v.name}
                      {v.priceModifier ? ` (+₹${v.priceModifier})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-100 rounded-sm p-8 mb-10">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Biological Description</h3>
              <p className="text-slate-600 text-[11px] leading-relaxed font-bold uppercase tracking-tight">
                {product.description}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12">
                <div className="flex flex-col space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Quantity Batch</span>
                  <div className="flex items-center bg-white border border-slate-200 rounded-sm h-12 w-fit overflow-hidden">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-50 transition-all border-r border-slate-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-6 font-black text-black text-sm min-w-[60px] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-50 transition-all border-l border-slate-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Available for Shipment</span>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="px-12 py-5 bg-black text-white font-black rounded-sm hover:bg-sky-600 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-[0.98]"
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Basket</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="text-sky-600" size={20} />
                  <div>
                    <p className="text-[9px] font-black uppercase text-black tracking-widest">Guaranteed Life</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Verified Healthy</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Truck className="text-sky-600" size={20} />
                  <div>
                    <p className="text-[9px] font-black uppercase text-black tracking-widest">Cold Chain Transit</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Mon Dispatch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
