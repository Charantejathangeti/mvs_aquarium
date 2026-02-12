
import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Download, CheckCircle2, Home, Printer } from 'lucide-react';

const InvoiceView: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Invoice missing or expired.</h2>
        <Link to="/" className="text-[#0ea5e9] font-bold hover:underline">Return Home</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 pb-24">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 mb-8 border border-emerald-100 shadow-sm">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Order Placed!</h1>
        <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
          Order <span className="text-slate-900 font-black">#{id}</span> is confirmed. Check WhatsApp for dispatch updates next Monday.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl invoice-print-container">
        {/* Header */}
        <div className="bg-slate-900 p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0ea5e9] flex items-center justify-center text-white font-black">M</div>
              <span className="text-2xl font-black tracking-tight">MVS <span className="text-[#0ea5e9]">Aqua</span></span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Livestock Partner</p>
            <p className="text-slate-400 text-sm font-medium">support@mvsaqua.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black mb-1 uppercase tracking-tighter">Receipt</h2>
            <p className="text-[#0ea5e9] font-black text-sm">{id}</p>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Customer Details</h4>
              <p className="text-xl font-black text-slate-900 mb-1">{orderData.name}</p>
              <p className="text-slate-500 font-medium">{orderData.phone}</p>
            </div>
            <div className="md:text-right">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Shipping Path</h4>
              <p className="text-slate-600 font-medium leading-relaxed">{orderData.address}</p>
              <p className="text-slate-900 font-black">{orderData.city}</p>
            </div>
          </div>

          <table className="w-full mb-16">
            <thead>
              <tr className="border-b-2 border-slate-50">
                <th className="py-5 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Item Species</th>
                <th className="py-5 text-center font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Qty</th>
                <th className="py-5 text-right font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Weight</th>
                <th className="py-5 text-right font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orderData.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-8">
                    <p className="font-black text-slate-900 text-lg leading-tight">{item.name}</p>
                    <p className="text-slate-400 text-xs font-bold uppercase mt-1">{item.category}</p>
                  </td>
                  <td className="py-8 text-center text-slate-900 font-black">{item.quantity}</td>
                  <td className="py-8 text-right text-slate-500 font-bold">{(item.weight * item.quantity).toFixed(2)} kg</td>
                  <td className="py-8 text-right font-black text-slate-900 text-lg">₹{(item.price * item.quantity).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-12 border-t border-slate-100">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Base Stock Total</span>
                <span className="text-slate-900 font-black">₹{(orderData.total - orderData.shippingCharge).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <div className="flex flex-col">
                   <span>Shipping (T.S./A.P)</span>
                   <span className="text-[10px] font-black uppercase text-slate-300">Payload: {orderData.weight.toFixed(2)} kg</span>
                </div>
                <span className="text-slate-900 font-black">₹{orderData.shippingCharge.toFixed(0)}</span>
              </div>
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-between text-4xl font-black text-[#0ea5e9] tracking-tighter">
                <span>Grand Total</span>
                <span>₹{orderData.total.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-12 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">MVS Aqua · Tirupati Enterprise</p>
            <p className="text-slate-300 text-[10px] mt-4 italic font-medium">This is a system generated order receipt for livestock fulfillment.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-16 print:hidden">
        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-xl shadow-slate-900/10"
        >
          <Printer size={20} />
          <span>Print Receipt</span>
        </button>
        <Link to="/" className="w-full sm:w-auto px-10 py-4 bg-[#0ea5e9] hover:bg-[#0369a1] text-white font-black rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-xl shadow-sky-500/20">
          <Home size={20} />
          <span>Home</span>
        </Link>
      </div>
      
      <style>{`
        @media print {
          nav, footer, .print-hidden {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
          }
          .invoice-print-container {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
