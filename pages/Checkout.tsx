
import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Loader2, MessageCircle, Lock, Truck, ChevronLeft } from 'lucide-react';
import { CartItem, Order } from '../types';
import { WHATSAPP_NUMBER, SHIPPING_RATE_PER_KG } from '../constants';

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pinCode: '',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalWeight = cart.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
  const shippingCharge = Math.max(80, Math.ceil(totalWeight) * SHIPPING_RATE_PER_KG);
  const total = subtotal + shippingCharge;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
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

      // Save record
      const existingOrders = JSON.parse(localStorage.getItem('mvs_aqua_orders') || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem('mvs_aqua_orders', JSON.stringify(existingOrders));

      // WhatsApp Message
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

_Payment is PREPAID ONLY via GPay/PhonePe. Please send screenshot after payment for dispatch next Monday._`;
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      
      clearCart();
      setIsProcessing(false);
      navigate(`/invoice/${orderId}`, { state: { orderData: newOrder } });
    }, 1200);
  };

  if (cart.length === 0) return <Navigate to="/shop" />;

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-28">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          
          {/* Left: Billing Details */}
          <div className="bg-white p-12 lg:p-16 rounded-[4rem] shadow-2xl shadow-slate-200/50 space-y-16">
            <div>
              <Link to="/cart" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-cyan-600 flex items-center gap-2 mb-10 group transition-all">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Return to Basket
              </Link>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Checkout <br/><span className="text-cyan-600">Protocol.</span></h2>
              <p className="text-slate-400 text-base font-medium mt-4">Provide authenticated delivery details.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">First Identity *</label>
                <input required placeholder="First Name" className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-cyan-500 font-bold transition-all shadow-sm focus:ring-8 focus:ring-cyan-500/5 text-lg" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Last Identity *</label>
                <input required placeholder="Last Name" className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-cyan-500 font-bold transition-all shadow-sm focus:ring-8 focus:ring-cyan-500/5 text-lg" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Physical Delivery Point *</label>
              <textarea required rows={3} className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-cyan-500 font-bold transition-all shadow-sm focus:ring-8 focus:ring-cyan-500/5 resize-none placeholder:text-slate-300 text-lg" placeholder="Street Address, Landmark..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Town / City *</label>
                <input required placeholder="City Name" className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-cyan-500 font-bold transition-all shadow-sm focus:ring-8 focus:ring-cyan-500/5 text-lg" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Logistics ZIP/PIN *</label>
                <input required placeholder="6-Digit Code" className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-cyan-500 font-bold transition-all shadow-sm focus:ring-8 focus:ring-cyan-500/5 text-lg" value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Primary Telecom *</label>
                <input required type="tel" placeholder="+91..." className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-cyan-500 font-bold transition-all shadow-sm focus:ring-8 focus:ring-cyan-500/5 text-lg" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Digital Mail *</label>
                <input required type="email" placeholder="email@address.com" className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-cyan-500 font-bold transition-all shadow-sm focus:ring-8 focus:ring-cyan-500/5 text-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sticky Card */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-slate-900 border border-slate-800 rounded-[4rem] p-14 text-white shadow-3xl shadow-slate-900/40">
              <h3 className="text-3xl font-black mb-12 tracking-tighter uppercase">Order Summary</h3>
              
              <div className="divide-y divide-slate-800">
                <div className="pb-10 space-y-8">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-start group">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-black text-base leading-tight group-hover:text-cyan-400 transition-colors">{item.name}</span>
                        <span className="text-[10px] font-black uppercase text-slate-500 mt-2 tracking-[0.2em]">Quantity: {item.quantity}</span>
                      </div>
                      <span className="text-cyan-500 font-black text-lg">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="py-8 flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                  <span>Species Subtotal</span>
                  <span className="text-slate-200">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="py-8 flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Logistics Rate</span>
                    <span className="text-[10px] text-cyan-400 font-black uppercase mt-2 tracking-widest">Verified Weight: {totalWeight.toFixed(2)} KG</span>
                  </div>
                  <span className="text-slate-200 font-black text-lg">₹{shippingCharge}</span>
                </div>

                <div className="py-12 flex justify-between items-baseline">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Grand Total</span>
                  <span className="text-6xl font-black text-cyan-400 tracking-tighter">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 p-10 bg-slate-950 rounded-[3rem] border border-slate-800/50">
                 <p className="text-[11px] text-slate-500 font-black leading-loose uppercase tracking-widest flex items-start gap-4">
                   <Lock className="text-cyan-500 shrink-0 mt-1" size={20} />
                   <span>SECURE PREPAID FULFILLMENT. AFTER CONFIRMATION, YOU WILL BE REDIRECTED TO WHATSAPP TO FINALIZE PAYMENT VIA GPAY/PHONEPE.</span>
                 </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-12 py-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-[2.5rem] transition-all flex items-center justify-center space-x-5 shadow-2xl shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 text-base"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  <>
                    <MessageCircle size={26} />
                    <span className="text-xs uppercase tracking-[0.3em]">Authorize on WhatsApp</span>
                  </>
                )}
              </button>
              
              <div className="mt-10 flex items-center justify-center gap-6 text-slate-600">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Verified Order</span>
                 </div>
                 <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                 <div className="flex items-center gap-2">
                    <Truck size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Express Logistics</span>
                 </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
