
import React, { useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router';
import { Printer, Home, CheckCircle2, Clock, Package, Truck, ShieldCheck, ChevronRight, Download } from 'lucide-react';

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
        <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">Record Lost.</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Verification Protocol Required to Restore View</p>
        <Link to="/" className="px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all">Hub Gateway</Link>
      </div>
    );
  }

  const handlePrint = () => { window.print(); };
  const orderDate = new Date(orderData.date);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 bg-white font-sans">
      {/* Visual Status (Screen Only) */}
      <div className="mb-12 bg-slate-50 border border-slate-200 p-8 print:hidden flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className={`w-14 h-14 flex items-center justify-center border-2 border-emerald-500 text-emerald-500 rounded-sm`}>
               <CheckCircle2 size={32} />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Consignment Confirmed</h3>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Logistics ID: #{orderData.id}</p>
            </div>
         </div>
         <div className="flex gap-3">
            <button onClick={handlePrint} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-cyan-600 transition-all">
              <Download size={16}/> Download PDF
            </button>
            <Link to="/" className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:border-slate-900 transition-all"><Home size={16}/> Hub</Link>
         </div>
      </div>

      {/* Main Printable Card */}
      <div className="bg-white border-2 border-slate-900 overflow-hidden shadow-2xl invoice-print-container">
        <div className="bg-slate-900 p-10 md:p-14 text-white flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-600 flex items-center justify-center text-black font-black text-lg">M</div>
              <span className="text-3xl font-black uppercase tracking-tighter leading-none">MVS AQUA</span>
            </div>
            <div className="space-y-1">
               <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em]">Biological Fulfillment Node</p>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">support@mvsaqua.com · Tirupati Hub</p>
            </div>
          </div>
          <div className="md:text-right flex flex-col gap-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none border-b-4 border-cyan-600 pb-2">INVOICE</h2>
            <div>
               <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Registry Identifier</p>
               <p className="text-white font-black text-lg tracking-widest mt-1">#{id}</p>
            </div>
          </div>
        </div>

        <div className="p-10 md:p-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 mb-16">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-2">Client Profile</h4>
              <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{orderData.customerName}</p>
              <div className="flex flex-col gap-1">
                 <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">T: {orderData.phone}</p>
                 <p className="text-slate-500 font-bold text-xs lowercase tracking-tight">{orderData.email}</p>
              </div>
            </div>
            <div className="sm:text-right space-y-4">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-2">Dispatch Destination</h4>
              <p className="text-slate-700 font-bold text-xs leading-relaxed uppercase">{orderData.address}</p>
              <p className="text-slate-900 font-black uppercase tracking-widest mt-2 text-xs">{orderData.city}, {orderData.state} - {orderData.pinCode}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mb-12">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-5 text-left font-black text-slate-900 uppercase text-[10px] tracking-widest">Biological Description</th>
                  <th className="py-5 text-center font-black text-slate-900 uppercase text-[10px] tracking-widest">Qty</th>
                  <th className="py-5 text-right font-black text-slate-900 uppercase text-[10px] tracking-widest">Mass (kg)</th>
                  <th className="py-5 text-right font-black text-slate-900 uppercase text-[10px] tracking-widest">Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderData.items.map((item: any, idx: number) => (
                  <tr key={idx} className="group">
                    <td className="py-6">
                      <p className="font-black text-slate-900 text-sm uppercase leading-tight">{item.name}</p>
                      <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] block mt-1.5">{item.category} / Asset v2.0</span>
                    </td>
                    <td className="py-6 text-center text-slate-900 font-black text-sm">{item.quantity}</td>
                    <td className="py-6 text-right text-slate-400 font-bold text-xs">{(item.weight * item.quantity).toFixed(2)} KG</td>
                    <td className="py-6 text-right font-black text-slate-900 text-sm tracking-tight">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-10 pt-10 border-t-2 border-slate-900">
            <div className="max-w-xs space-y-4">
               <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Biological Disclaimer</h5>
               <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed italic">
                 "Live organisms included. Shipment is packed for a 72-hour life span in sealed aquatic environment. Maintain cold chain upon reception."
               </p>
            </div>
            <div className="w-full md:max-w-[320px] space-y-4">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Stock Subtotal</span>
                <span className="text-slate-900">₹{orderData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Logistics Factor ({orderData.weight.toFixed(1)}kg)</span>
                <span className="text-slate-900">₹{orderData.shippingCharge.toLocaleString()}</span>
              </div>
              <div className="h-0.5 bg-slate-100 my-4" />
              <div className="flex justify-between items-baseline text-slate-900">
                <span className="text-[11px] font-black uppercase tracking-widest">Grand Total</span>
                <span className="text-4xl font-black tracking-tighter">₹{orderData.total.toLocaleString()}</span>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                 <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300">Transaction Finalized</span>
                 <div className="flex items-center gap-2 text-emerald-500"><ShieldCheck size={12}/> <span className="text-[8px] font-black uppercase tracking-widest">Encrypted Payment</span></div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-100 text-center space-y-6">
            <div className="flex items-center justify-center gap-12 opacity-40 grayscale">
               <div className="flex items-center gap-3"><Package size={14}/><span className="text-[8px] font-black uppercase tracking-widest">Triple Sealed</span></div>
               <div className="flex items-center gap-3"><Truck size={14}/><span className="text-[8px] font-black uppercase tracking-widest">Cold Dispatch</span></div>
            </div>
            <p className="text-slate-300 text-[8px] font-black uppercase tracking-[0.6em] leading-loose">
              MVS Aqua Enterprises · Tirupati Logistics Hub · AP 517507 · India
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          nav, footer, header, .print-hidden { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .invoice-print-container { box-shadow: none !important; border-width: 2px !important; border-radius: 0 !important; margin: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
