
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
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          
          {/* Left: Billing Details */}
          <div className="space-y-12">
            <div>
              <Link to="/cart" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 flex items-center gap-2 mb-8">
                <ChevronLeft size={14} />
                Return to Cart
              </Link>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Billing details</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name *</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name *</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Street Address *</label>
              <textarea required rows={2} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all resize-none" placeholder="House number and street name" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City *</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">PIN Code *</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone *</label>
                <input required type="tel" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address *</label>
                <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-bold transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sticky Card */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Order Summary</h3>
              
              <div className="divide-y divide-slate-200">
                <div className="py-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">{item.name} <span className="text-slate-900 font-black ml-1">× {item.quantity}</span></span>
                      <span className="text-slate-900 font-black">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="py-5 flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{subtotal}</span>
                </div>

                <div className="py-5 flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Shipping</span>
                    <span className="text-[9px] text-sky-600 font-black uppercase mt-1 tracking-widest">Weight: {totalWeight.toFixed(2)} kg</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">₹{shippingCharge}</span>
                </div>

                <div className="py-8 flex justify-between items-baseline">
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-black text-sky-600 tracking-tighter">₹{total}</span>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/10 rounded-full blur-2xl" />
                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed relative z-10">
                   <Lock className="inline-block mr-2 text-sky-500" size={14} />
                   All payments are PREPAID ONLY. We do not support Cash on Delivery. Billing is finalized on WhatsApp.
                 </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-10 py-6 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl shadow-sky-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <MessageCircle size={20} />
                    <span className="text-xs uppercase tracking-widest">Confirm & Pay on WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
