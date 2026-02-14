
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingCart, Search, Plus, Minus, Layers, Weight, Filter, Grid3X3 } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product } from '../types';

interface ShopProps {
  products: Product[];
  addToCart: (product: Product, quantity: number) => void;
}

const Shop: React.FC<ShopProps> = ({ products, addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const catParam = searchParams.get('cat');
    setCategory(catParam || 'All');
  }, [searchParams]);

  const shopCategories = useMemo(() => ['All', ...CATEGORIES], []);

  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      const matchCat = category === 'All' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search, products]);

  const updateLocalQty = (productId: string, delta: number) => {
    setLocalQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Compact */}
      <div className="bg-slate-50 border-b border-slate-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <Grid3X3 size={16} className="text-black" />
             <h1 className="text-[14px] font-black text-black uppercase tracking-widest">Livestock Stocklist</h1>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-sm text-[11px] font-bold focus:border-black outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Compact */}
        <aside className="w-full lg:w-40 shrink-0">
          <div className="flex items-center gap-2 mb-3">
             <Filter size={12} className="text-slate-400" />
             <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Class</h3>
          </div>
          <div className="flex flex-wrap lg:flex-col gap-1">
            {shopCategories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setSearchParams(cat === 'All' ? {} : { cat }); }}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-left rounded-sm transition-all border ${
                  category === cat ? 'bg-black text-white border-black' : 'bg-white text-slate-700 border-slate-100 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Dense Product Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((product: Product) => {
              const qty = localQuantities[product.id] || 1;
              return (
                <div key={product.id} className="border border-slate-200 bg-white rounded-sm flex flex-col hover:border-black transition-colors group">
                  <Link to={`/product/${product.id}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
                     <img 
                        src={product.image} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        alt={product.name} 
                     />
                     <div className="absolute top-1 left-1">
                        <span className="px-1.5 py-0.5 bg-black/90 text-white text-[7px] font-black uppercase tracking-tighter">
                          {product.category}
                        </span>
                     </div>
                  </Link>

                  <div className="p-2 flex flex-col flex-grow">
                    <Link to={`/product/${product.id}`} className="mb-1.5 block">
                      <h3 className="text-[10px] font-black text-black leading-tight uppercase tracking-tight line-clamp-2 min-h-[1.5rem] group-hover:text-sky-600">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[11px] font-black text-black">₹{product.price}</span>
                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{product.weight}kg</span>
                    </div>

                    <div className="mt-auto flex flex-col gap-1.5">
                       <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-sm h-6">
                          <button onClick={() => updateLocalQty(product.id, -1)} className="w-6 h-full flex items-center justify-center text-slate-400 hover:text-black"><Minus size={10} /></button>
                          <span className="text-[10px] font-black text-black">{qty}</span>
                          <button onClick={() => updateLocalQty(product.id, 1)} className="w-6 h-full flex items-center justify-center text-slate-400 hover:text-black"><Plus size={10} /></button>
                       </div>
                       <button 
                          onClick={() => addToCart(product, qty)}
                          className="w-full py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                       >
                          <ShoppingCart size={10} />
                          <span>Add</span>
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filtered.length === 0 && (
            <div className="py-20 text-center border border-dashed border-slate-200 rounded-sm">
               <Layers size={32} className="mx-auto text-slate-200 mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching species found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
