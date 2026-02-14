
import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router';
import { ShieldCheck, Loader2, MessageCircle, Lock, Truck, ChevronLeft, CreditCard } from 'lucide-react';
import { CartItem, Order } from '../types';
import { WHATSAPP_NUMBER, SHIPPING_RATE_PER_KG } from '../constants';

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
  // Added onOrderComplete and orders props to resolve type errors in App.tsx
  onOrderComplete: (orders: Order[]) => Promise<boolean>;
  orders: Order[];
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart, onOrderComplete, orders }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Andhra Pradesh',
    pinCode: '',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalWeight = cart.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
  const shippingCharge = Math.max(80, Math.ceil(totalWeight) * SHIPPING_RATE_PER_KG);
  const total = subtotal + shippingCharge;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Artificial delay to mimic secure processing
    setTimeout(async () => {
      const orderId = 'MVS' + Math.floor(100000 + Math.random() * 900000);
      
      const newOrder: Order = {
        id: orderId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        country: 'India',
        items: cart,
        subtotal,
        shippingCharge,
        total,
        weight: totalWeight,
        date: new Date().toISOString(),
        status: 'pending'
      };

      // Push to Global Registry instead of direct localStorage manipulation
      await onOrderComplete([...orders, newOrder]);

      // WhatsApp Message Generation
      const productList = cart.map(i => `• ${i.name} x ${i.quantity} (₹${i.price})`).join('\n');
      const message = `*NEW ORDER: #${orderId}*

*Customer Details:*
Name: ${newOrder.customerName}
Phone: ${newOrder.phone}
Address: ${newOrder.address}, ${newOrder.city}, ${newOrder.state} - ${newOrder.pinCode}

*Items:*
${productList}

*Summary:*
Subtotal: ₹${subtotal}
Shipping: ₹${shippingCharge}
*Grand Total: ₹${total}*

_Payment is PREPAID ONLY via GPay/PhonePe. Please send screenshot after payment for order processing._`;
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      
      clearCart();
      setIsProcessing(false);
      navigate(`/invoice/${orderId}`, { state: { orderData: newOrder } });
    }, 1200);
  };

  if (cart.length === 0) return <Navigate to="/shop" />;

  return (
    <div className="bg-white min-h-screen border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Billing Details */}
          <div className="lg:col-span-7 space-y-10 animate-fade-in">
            <div className="pb-6 border-b border-slate-100">
              <Link to="/cart" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black flex items-center gap-2 mb-6 transition-all">
                <ChevronLeft size={14} />
                Return to Basket
              </Link>
              <h2 className="text-3xl font-black text-black tracking-tighter leading-none uppercase">Checkout Protocol</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Logistics & Biological Fulfillment Data</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">First Name *</label>
                <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black font-bold transition-all text-xs" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Last Name *</label>
                <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black font-bold transition-all text-xs" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Delivery Address *</label>
              <textarea required rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black font-bold transition-all resize-none text-xs" placeholder="Full street details..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">City *</label>
                <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black font-bold transition-all text-xs" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">State *</label>
                <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black font-bold transition-all text-xs" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">PIN Code *</label>
                <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black font-bold transition-all text-xs" value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">WhatsApp Phone *</label>
                <input required type="tel" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black font-bold transition-all text-xs" placeholder="+91..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Email Address *</label>
                <input required type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black font-bold transition-all text-xs" placeholder="name@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Right: Order Summary - Sharp Black Box */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <div className="bg-black text-white rounded-sm p-8 shadow-2xl animate-fade-in">
              <h3 className="text-xs font-black mb-8 tracking-[0.2em] uppercase border-b border-white/10 pb-4">Consignment Summary</h3>
              
              <div className="space-y-6">
                <div className="max-h-48 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-[11px] leading-tight uppercase">{item.name}</span>
                        <span className="text-[8px] font-black uppercase text-slate-500 mt-1 tracking-widest">Qty: {item.quantity}</span>
                      </div>
                      <span className="text-sky-400 font-black text-xs">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span>Species Total</span>
                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Logistics Fee</span>
                      <span className="text-[7px] text-sky-500 font-black uppercase tracking-widest">{totalWeight.toFixed(2)} KG Consignment</span>
                    </div>
                    <span className="text-white font-black text-xs">₹{shippingCharge}</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Payable</span>
                  <span className="text-4xl font-black text-sky-400 tracking-tighter">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded-sm">
                 <p className="text-[8px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest flex items-start gap-3">
                   <Lock className="text-sky-500 shrink-0" size={12} />
                   <span>Prepaid Orders only. Redirection to WhatsApp for GPay/PhonePe fulfillment after confirmation.</span>
                 </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-8 py-4 bg-sky-500 hover:bg-sky-400 text-black font-black rounded-sm transition-all flex items-center justify-center space-x-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <MessageCircle size={18} />
                    <span className="text-[10px] uppercase tracking-[0.2em]">Confirm & Order</span>
                  </>
                )}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-6 text-slate-600">
                 <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    <span className="text-[7px] font-black uppercase tracking-widest">Secure Gateway</span>
                 </div>
                 <div className="w-1 h-1 bg-slate-800 rounded-full" />
                 <div className="flex items-center gap-1.5">
                    <Truck size={12} />
                    <span className="text-[7px] font-black uppercase tracking-widest">Express Transit</span>
                 </div>
              </div>
            </div>
          </div>

        </form>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0284c7;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
