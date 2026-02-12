
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
  updateQuantity: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQuantity, removeFromCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalWeight = cart.reduce((acc, item) => acc + item.weight * item.quantity, 0);
  
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center bg-white">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 text-slate-200 mb-8 border border-slate-100">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-slate-500 mb-10 max-w-xs mx-auto text-sm font-medium">
          Explore our premium species and add them to your collection.
        </p>
        <Link to="/shop" className="px-10 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-sky-600 transition-all inline-flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest">
          <span>Start Shopping</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        <div className="flex items-center justify-between mb-12">
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
           <Link to="/shop" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 flex items-center gap-2">
              <ChevronLeft size={14} />
              Back to Shop
           </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-6 shadow-sm hover:border-slate-200 transition-all">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-50 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <Link to={`/product/${item.id}`} className="text-sm font-black text-slate-900 hover:text-sky-600 transition-colors line-clamp-1">{item.name}</Link>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{item.category} · {item.weight}kg</p>
                     </div>
                     <p className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg overflow-hidden h-9">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-900"><Minus size={12} /></button>
                      <span className="px-3 font-black text-slate-900 text-[11px] min-w-[32px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-900"><Plus size={12} /></button>
                    </div>
                    
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100">
              <h3 className="text-lg font-black text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <span>Weight</span>
                  <span className="text-slate-900">{totalWeight.toFixed(2)} kg</span>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between items-baseline">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Total Payable</span>
                  <span className="text-3xl font-black text-sky-600 tracking-tighter">₹{subtotal}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-5 bg-slate-900 hover:bg-sky-600 text-white font-black rounded-2xl transition-all flex items-center justify-center space-x-3 text-xs uppercase tracking-widest"
              >
                <span>Continue to Billing</span>
                <ArrowRight size={16} />
              </button>

              <div className="mt-8 space-y-4">
                 <div className="flex items-center gap-3 text-slate-400">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Safe & Secure Logistics</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-400">
                    <Truck size={16} className="text-sky-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Monday Dispatch Policy</span>
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
