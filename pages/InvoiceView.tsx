
import React, { useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router';
import { Printer, Home, CheckCircle2, Clock, Package, Truck, ShieldCheck, ChevronRight } from 'lucide-react';

const InvoiceView: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tighter">Session Expired.</h2>
        <Link to="/" className="px-6 py-3 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-sky-600 rounded-sm">Return Home</Link>
      </div>
    );
  }

  const handlePrint = () => { window.print(); };
  const orderDate = new Date(orderData.date);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-16 bg-white">
      {/* Visual Status (Screen Only) */}
      <div className="mb-8 bg-slate-50 border border-slate-200 rounded-sm p-6 print:hidden">
         <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Order Logistics Status</h3>
            <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-sm">Active Shipment</span>
         </div>
         <div className="flex justify-between items-center text-center">
            {['Order Logged', 'Verified', 'Dispatched', 'Delivered'].map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-2 opacity-40 group first:opacity-100">
                <div className={`w-8 h-8 rounded-sm border flex items-center justify-center ${i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}`}>
                  {i === 0 ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Main Printable Card */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-2xl invoice-print-container">
        <div className="bg-slate-900 p-8 md:p-12 text-white flex flex-col sm:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-sky-600 flex items-center justify-center text-white font-black text-sm">M</div>
              <span className="text-2xl font-black uppercase tracking-tighter">MVS AQUA</span>
            </div>
            <div className="space-y-1">
               <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em]">Premium Aquatic Logistics</p>
               <p className="text-slate-400 text-xs font-bold">support@mvsaqua.com</p>
            </div>
          </div>
          <div className="sm:text-right">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Order Invoice</h2>
            <p className="text-sky-400 font-black text-sm tracking-[0.2em] mt-3">#{id}</p>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2">{orderDate.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
            <div className="space-y-2">
              <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-2">Customer Details</h4>
              <p className="text-base font-black text-slate-900 uppercase">{orderData.customerName}</p>
              <p className="text-slate-500 font-bold text-[11px] tracking-widest">{orderData.phone}</p>
            </div>
            <div className="sm:text-right space-y-2">
              <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 sm:border-none">Shipping Destination</h4>
              <p className="text-slate-600 font-bold text-[11px] leading-relaxed uppercase">{orderData.address}</p>
              <p className="text-slate-900 font-black uppercase tracking-widest mt-2 text-[10px]">{orderData.city}, {orderData.state} - {orderData.pinCode}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mb-10 min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-slate-50">
                  <th className="py-4 text-left font-black text-slate-400 uppercase text-[9px] tracking-widest">Product Description</th>
                  <th className="py-4 text-center font-black text-slate-400 uppercase text-[9px] tracking-widest">Quantity</th>
                  <th className="py-4 text-right font-black text-slate-400 uppercase text-[9px] tracking-widest">Weight (kg)</th>
                  <th className="py-4 text-right font-black text-slate-400 uppercase text-[9px] tracking-widest">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orderData.items.map((item: any, idx: number) => (
                  <tr key={idx} className="group">
                    <td className="py-4">
                      <p className="font-black text-slate-900 text-sm uppercase leading-tight">{item.name}</p>
                      <span className="text-slate-300 text-[8px] font-black uppercase tracking-widest block mt-1">LIVESTOCK_ASSET</span>
                    </td>
                    <td className="py-4 text-center text-slate-900 font-black text-sm">{item.quantity}</td>
                    <td className="py-4 text-right text-slate-400 font-bold text-[11px]">{(item.weight * item.quantity).toFixed(2)} kg</td>
                    <td className="py-4 text-right font-black text-slate-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <div className="w-full max-w-[240px] space-y-3">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-slate-900">₹{orderData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Shipping Fee</span>
                <span className="text-slate-900">₹{orderData.shippingCharge.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-100 my-2" />
              <div className="flex justify-between items-baseline text-sky-600">
                <span className="text-[10px] font-black uppercase tracking-widest">Grand Total</span>
                <span className="text-3xl font-black tracking-tighter">₹{orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-50 text-center space-y-4">
            <div className="flex items-center justify-center gap-10 opacity-30">
               <div className="flex items-center gap-2"><ShieldCheck size={12}/><span className="text-[8px] font-black uppercase tracking-widest">Verified Health Check</span></div>
               <div className="flex items-center gap-2"><Truck size={12}/><span className="text-[8px] font-black uppercase tracking-widest">Specialized Transit</span></div>
            </div>
            <p className="text-slate-300 text-[8px] font-bold uppercase tracking-[0.4em] leading-loose">
              MVS Aqua Enterprises · Tirupati Logistics Hub · Secure Fulfillment Protocol
            </p>
          </div>
        </div>
      </div>

      {/* Action Controls (Screen Only) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 print:hidden">
        <button onClick={handlePrint} className="w-full sm:w-auto px-10 py-4 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">
          <Printer size={16} />
          <span className="text-[11px] font-black uppercase tracking-widest">Print Receipt</span>
        </button>
        <Link to="/" className="w-full sm:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
          <Home size={16} />
          <span className="text-[11px] font-black uppercase tracking-widest">Back to Store</span>
        </Link>
      </div>
      
      <style>{`
        @media print {
          nav, footer, header, .print-hidden { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .invoice-print-container { box-shadow: none !important; border: 1px solid #eee !important; border-radius: 0 !important; margin: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
