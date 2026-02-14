
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
        <Link to="/" className="px-6 py-3 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-sky-600 rounded-sm">Return Home</Link>
      </div>
    );
  }

  const handlePrint = () => { window.print(); };
  const orderDate = new Date(orderData.date);

  return (
    <div className="max-w-3xl mx-auto px-3 py-6 md:py-12 bg-white">
      {/* Visual Status (Screen Only) */}
      <div className="mb-6 bg-slate-50 border border-slate-200 rounded-sm p-4 print:hidden">
         <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
            <h3 className="text-[8px] font-black text-black uppercase tracking-[0.2em]">Registry Tracking Protocol</h3>
            <span className="text-[6px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">Verified Live</span>
         </div>
         <div className="flex justify-between items-center text-center">
            {['Logged', 'Verified', 'Dispatched', 'Finalized'].map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1.5 opacity-40 group first:opacity-100">
                <div className={`w-6 h-6 rounded-sm border flex items-center justify-center ${i === 0 ? 'bg-black text-white' : 'bg-slate-100 text-slate-300'}`}>
                  {i === 0 ? <CheckCircle2 size={10} /> : <div className="w-1 h-1 rounded-full bg-slate-300" />}
                </div>
                <span className="text-[6px] font-black uppercase tracking-widest">{label}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Main Printable Card */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-2xl invoice-print-container">
        <div className="bg-black p-6 md:p-8 text-white flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-sky-500 flex items-center justify-center text-white font-black text-xs">M</div>
              <span className="text-lg font-black uppercase tracking-tighter">MVS AQUA</span>
            </div>
            <div className="space-y-0.5">
               <p className="text-slate-400 text-[6px] font-black uppercase tracking-[0.3em]">Biological Fulfillment Hub</p>
               <p className="text-slate-400 text-[8px] font-bold">support@mvsaqua.com</p>
            </div>
          </div>
          <div className="sm:text-right">
            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Receipt</h2>
            <p className="text-sky-400 font-black text-[10px] tracking-[0.2em] mt-1.5">#{id}</p>
            <p className="text-slate-500 text-[6px] font-black uppercase tracking-[0.4em] mt-1">{orderDate.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div className="space-y-1">
              <h4 className="text-[6px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-1">Logistics Consignee</h4>
              <p className="text-sm font-black text-slate-900 uppercase">{orderData.customerName}</p>
              <p className="text-slate-500 font-black text-[9px] tracking-widest">{orderData.phone}</p>
            </div>
            <div className="sm:text-right space-y-1">
              <h4 className="text-[6px] font-black text-slate-300 uppercase tracking-widest mb-1 sm:border-none">Delivery Destination</h4>
              <p className="text-slate-600 font-bold text-[9px] leading-relaxed uppercase">{orderData.address}</p>
              <p className="text-slate-900 font-black uppercase tracking-widest mt-1 text-[8px]">{orderData.city}, {orderData.state} - {orderData.pinCode}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mb-8 min-w-[400px]">
              <thead>
                <tr className="border-b-2 border-slate-50">
                  <th className="py-3 text-left font-black text-slate-400 uppercase text-[6px] tracking-widest">Biological Description</th>
                  <th className="py-3 text-center font-black text-slate-400 uppercase text-[6px] tracking-widest">Qty</th>
                  <th className="py-3 text-right font-black text-slate-400 uppercase text-[6px] tracking-widest">Mass (kg)</th>
                  <th className="py-3 text-right font-black text-slate-400 uppercase text-[6px] tracking-widest">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orderData.items.map((item: any, idx: number) => (
                  <tr key={idx} className="group">
                    <td className="py-3">
                      <p className="font-black text-slate-900 text-[10px] uppercase leading-tight">{item.name}</p>
                      <span className="text-slate-300 text-[6px] font-black uppercase tracking-widest block">REG_ASSET</span>
                    </td>
                    <td className="py-3 text-center text-slate-900 font-black text-[10px]">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-400 font-bold text-[8px]">{(item.weight * item.quantity).toFixed(2)} kg</td>
                    <td className="py-3 text-right font-black text-slate-900 text-[10px]">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <div className="w-full max-w-[200px] space-y-2">
              <div className="flex justify-between text-[7px] font-black text-slate-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-slate-900">₹{orderData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[7px] font-black text-slate-400 uppercase tracking-widest">
                <span>Logistics Protocol</span>
                <span className="text-slate-900">₹{orderData.shippingCharge.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex justify-between items-baseline text-sky-600">
                <span className="text-[7px] font-black uppercase tracking-widest">Final Bill</span>
                <span className="text-2xl font-black tracking-tighter">₹{orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-50 text-center space-y-3">
            <div className="flex items-center justify-center gap-6 opacity-30">
               <div className="flex items-center gap-1.5"><ShieldCheck size={8}/><span className="text-[6px] font-black uppercase">Verified Quarantine</span></div>
               <div className="flex items-center gap-1.5"><Truck size={8}/><span className="text-[6px] font-black uppercase">Monday Dispatch Only</span></div>
            </div>
            <p className="text-slate-200 text-[6px] font-bold uppercase tracking-[0.3em] leading-loose">
              MVS Aqua Enterprises · Tirupati biological Node · 2024 Protocol
            </p>
          </div>
        </div>
      </div>

      {/* Micro Controls (Screen Only) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 print:hidden">
        <button onClick={handlePrint} className="w-full sm:w-auto px-8 py-3 bg-sky-500 hover:bg-sky-400 text-black font-black rounded-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]">
          <Printer size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Print Receipt</span>
        </button>
        <Link to="/admin" className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-slate-800 text-white font-black rounded-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          <Home size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Operator Portal</span>
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
