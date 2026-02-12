
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Plus,
  Minus,
  Layers,
  Package,
  Weight,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import { Product } from '../types';

interface ShopProps {
  addToCart: (product: Product, quantity: number) => void;
}

type SortOption = 'default' | 'price-low' | 'price-high' | 'name-asc';

const Shop: React.FC<ShopProps> = ({ addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const catParam = searchParams.get('cat');
    if (catParam) setCategory(catParam);
    else setCategory('All');
  }, [searchParams]);

  const shopCategories = useMemo(() => ['All', ...CATEGORIES], []);

  const filteredAndSorted = useMemo(() => {
    const savedProducts = JSON.parse(localStorage.getItem('mvs_aqua_products') || JSON.stringify(MOCK_PRODUCTS));
    let result = savedProducts.filter((p: Product) => {
      const matchCat = category === 'All' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') result.sort((a: Product, b: Product) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a: Product, b: Product) => b.price - a.price);
    if (sortBy === 'name-asc') result.sort((a: Product, b: Product) => a.name.localeCompare(b.name));

    return result;
  }, [category, search, sortBy]);

  const updateLocalQty = (productId: string, delta: number) => {
    setLocalQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Header with Search */}
      <div className="bg-slate-50/50 border-b border-slate-100 pt-12 pb-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Live Stock</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
               <Layers size={14} className="text-[#0ea5e9]" />
               Professionally Quarantined Species
            </p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-sky-500/5 focus:border-[#0ea5e9] outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Enhanced Filtering Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 text-slate-900">
                 <Filter size={16} />
                 <h3 className="text-[10px] font-black uppercase tracking-widest">Species Filter</h3>
              </div>
              <div className="flex flex-col space-y-1.5">
                {shopCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setSearchParams(cat === 'All' ? {} : { cat }); }}
                    className={`flex items-center justify-between px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      category === cat ? 'bg-[#0ea5e9] text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-sky-50 rounded-[2.5rem] border border-sky-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-[#0ea5e9]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
               <div className="flex items-center gap-3 text-[#0ea5e9] mb-4">
                  <Package size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Shipment Status</span>
               </div>
               <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                 All livestock dispatched on Mondays via ST/Professional Courier for guaranteed health.
               </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
               <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                  Discovered <span className="text-slate-900">{filteredAndSorted.length}</span> Results
               </div>
               <div className="flex items-center gap-4">
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#0ea5e9] shadow-sm cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredAndSorted.map((product: Product) => {
                const qty = localQuantities[product.id] || 1;
                return (
                  <div key={product.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden group hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-500/10 transition-all flex flex-col p-4">
                    
                    {/* Compact Image */}
                    <Link to={`/product/${product.id}`} className="block relative aspect-square bg-slate-50 rounded-[2rem] overflow-hidden mb-5">
                       <img 
                         src={product.image} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                         alt={product.name} 
                       />
                       <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[8px] font-black uppercase tracking-[0.15em] rounded-lg shadow-sm border border-slate-100">
                            {product.category}
                          </span>
                       </div>
                    </Link>

                    {/* Metadata */}
                    <div className="flex flex-col flex-grow px-1">
                      <Link to={`/product/${product.id}`} className="mb-3">
                        <h3 className="text-sm font-black text-slate-900 leading-[1.3] group-hover:text-[#0ea5e9] transition-colors line-clamp-2 min-h-[2.5rem] tracking-tight">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Price and Weight Section */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                           <span className="text-lg font-black text-[#0ea5e9] tracking-tighter">₹{product.price}</span>
                           <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Unit Rate</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-600 rounded-full border border-sky-100 transition-all group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600">
                            <Weight size={13} className="stroke-[3]" />
                            <span className="text-[10px] font-black tracking-tight">{product.weight} kg</span>
                          </div>
                          <span className="text-[7px] text-slate-300 font-black uppercase tracking-widest mt-1">Payload</span>
                        </div>
                      </div>

                      {/* Controls Area */}
                      <div className="mt-auto space-y-4">
                         <div className="grid grid-cols-2 gap-2">
                           <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-1 py-1">
                              <button 
                                onClick={() => updateLocalQty(product.id, -1)} 
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-xs font-black text-slate-900">{qty}</span>
                              <button 
                                onClick={() => updateLocalQty(product.id, 1)} 
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                              >
                                <Plus size={14} />
                              </button>
                           </div>

                           <button 
                              onClick={() => addToCart(product, qty)}
                              className="w-full py-3 bg-slate-900 hover:bg-[#0ea5e9] text-white rounded-xl flex items-center justify-center transition-all active:scale-[0.95] shadow-lg shadow-slate-900/10"
                           >
                              <ShoppingCart size={18} />
                           </button>
                         </div>
                         
                         <div className="flex items-center justify-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{product.stock} Units Available</span>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Shop;
