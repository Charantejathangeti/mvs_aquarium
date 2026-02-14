
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Minus, 
  Plus, 
  Weight, 
  ChevronLeft, 
  ShieldCheck, 
  Truck
} from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, q: number, variation?: string) => void;
  removeFromCart: (id: string, variation?: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQuantity, removeFromCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => {
    const varPrice = item.variations?.find(v => v.name === item.selectedVariation)?.priceModifier || 0;
    return acc + (item.price + varPrice) * item.quantity;
  }, 0);
  
  const totalWeight = cart.reduce((acc, item) => acc + item.weight * item.quantity, 0);
  
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center bg-white">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 text-slate-200 mb-8 border border-slate-100 rounded-sm">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-3xl font-black text-black mb-4 tracking-tighter uppercase leading-none">Your basket is empty</h2>
        <p className="text-slate-400 mb-10 max-w-xs mx-auto text-[10px] font-bold uppercase tracking-widest">
          Explore our premium species and add them to your collection.
        </p>
        <Link to="/shop" className="px-10 py-4 bg-black text-white font-black rounded-sm hover:bg-sky-600 transition-all inline-flex items-center justify-center space-x-3 text-[10px] uppercase tracking-widest">
          <span>Start Browsing</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        <div className="flex items-center justify-between mb-12">
           <h1 className="text-4xl font-black text-black tracking-tighter uppercase leading-none">Consignment Basket</h1>
           <Link to="/shop" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black flex items-center gap-2">
              <ChevronLeft size={14} />
              Return to Catalog
           </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => {
              const varPrice = item.variations?.find(v => v.name === item.selectedVariation)?.priceModifier || 0;
              const unitPrice = item.price + varPrice;
              
              return (
                <div key={`${item.id}-${item.selectedVariation}`} className="bg-white border border-slate-200 rounded-sm p-5 flex items-center gap-6 shadow-sm hover:border-black transition-all group">
                  <div className="w-24 h-24 overflow-hidden bg-slate-50 border border-slate-100 rounded-sm shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <Link to={`/product/${item.id}`} className="text-[11px] font-black text-black hover:text-sky-600 transition-colors uppercase leading-tight line-clamp-1">{item.name}</Link>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{item.category}</span>
                            {item.selectedVariation && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-sm">Option: {item.selectedVariation}</span>
                              </>
                            )}
                          </div>
                       </div>
                       <p className="text-xs font-black text-black">₹{(unitPrice * item.quantity).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-sm overflow-hidden h-8">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariation)} className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-black"><Minus size={12} /></button>
                        <span className="px-4 font-black text-black text-[10px] min-w-[32px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariation)} className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-black"><Plus size={12} /></button>
                      </div>
                      
                      <button onClick={() => removeFromCart(item.id, item.selectedVariation)} className="text-slate-300 hover:text-red-600 transition-colors flex items-center gap-1.5">
                        <Trash2 size={14} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-black text-white rounded-sm p-8 shadow-2xl">
              <h3 className="text-xs font-black mb-8 tracking-[0.2em] uppercase border-b border-white/10 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span>Species Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span>Total Mass</span>
                  <span className="text-white">{totalWeight.toFixed(2)} KG</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Payable</span>
                  <span className="text-4xl font-black text-sky-400 tracking-tighter">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-black font-black rounded-sm transition-all flex items-center justify-center space-x-3 text-[10px] uppercase tracking-widest shadow-xl shadow-sky-900/10 active:scale-[0.98]"
              >
                <span>Commit to Billing</span>
                <ArrowRight size={16} />
              </button>

              <div className="mt-8 space-y-4 pt-6 border-t border-white/10">
                 <div className="flex items-center gap-3 text-slate-500">
                    <ShieldCheck size={14} className="text-sky-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Professional Packaging</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-500">
                    <Truck size={14} className="text-sky-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Monday Logistics Protocol</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
