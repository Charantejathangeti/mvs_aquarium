
import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
// Added ShieldCheck to imports
import { Download, CheckCircle2, Home, Printer, Clock, Package, Truck, Check, ChevronRight, ShieldCheck } from 'lucide-react';

const InvoiceView: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-tighter">Session Expired.</h2>
        <Link to="/" className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all rounded-sm">Return Home</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const orderDate = new Date(orderData.date);
  const statusSteps = [
    { label: 'Order Placed', desc: 'Registry logged in system', date: orderDate.toLocaleDateString(), active: true, done: true, icon: Clock },
    { label: 'Processing', desc: 'Biological verification', date: 'Next Working Day', active: true, done: orderData.status !== 'pending', icon: Package },
    { label: 'Order', desc: 'Monday Logistics Protocol', date: 'Upcoming Monday', active: orderData.status === 'shipped' || orderData.status === 'delivered', done: orderData.status === 'shipped' || orderData.status === 'delivered', icon: Truck },
    { label: 'Delivered', desc: 'Consignment arrival', date: 'T+2 Days Expected', active: orderData.status === 'delivered', done: orderData.status === 'delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 pb-24 bg-white">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-emerald-50 text-emerald-600 mb-8 border border-emerald-100 shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight uppercase leading-none">Transmission Confirmed</h1>
        <p className="text-slate-400 font-bold max-w-md mx-auto leading-relaxed text-[9px] uppercase tracking-[0.2em]">
          Reference ID <span className="text-slate-900 font-black">#{id}</span> is secured in the MVS registry.
        </p>
      </div>

      {/* Industrial Order Tracking Timeline */}
      <div className="mb-16 bg-slate-50 border border-slate-200 rounded-sm p-8 lg:p-12 shadow-sm print:hidden">
         <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-4">
            <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Logistics Progression Protocol</h3>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Live Sync</span>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0 relative">
            {/* Background Line */}
            <div className="absolute top-6 left-0 w-full h-px bg-slate-200 hidden md:block" />
            
            {statusSteps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center md:items-start md:px-4">
                 <div className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-all ${
                    step.done ? 'bg-black border-black text-white shadow-lg' : 
                    step.active ? 'bg-white border-sky-500 text-sky-600 shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-300'
                 }`}>
                    <step.icon size={20} />
                 </div>
                 
                 <div className="mt-6 text-center md:text-left">
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-black' : 'text-slate-300'}`}>{step.label}</h4>
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-tight">{step.desc}</p>
                    <div className="mt-3 flex items-center justify-center md:justify-start gap-1.5">
                       <Clock size={8} className="text-slate-300" />
                       <span className="text-[7px] font-black text-sky-600 uppercase tracking-tighter">{step.date}</span>
                    </div>
                 </div>

                 {/* Desktop Separator Arrow */}
                 {i < statusSteps.length - 1 && (
                   <div className="hidden md:block absolute top-5 right-[-10px] text-slate-200">
                      <ChevronRight size={14} />
                   </div>
                 )}
              </div>
            ))}
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-2xl invoice-print-container">
        {/* Header */}
        <div className="bg-black p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-sm bg-sky-500 flex items-center justify-center text-white font-black">M</div>
              <span className="text-2xl font-black tracking-tight uppercase">MVS <span className="text-sky-500">Aqua</span></span>
            </div>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-1">Biological Fulfillment Hub</p>
            <p className="text-slate-400 text-xs font-bold">support@mvsaqua.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black mb-1 uppercase tracking-tighter leading-none">Receipt</h2>
            <p className="text-sky-400 font-black text-sm tracking-widest mt-2">#{id}</p>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em] mt-2">{orderDate.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <h4 className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 border-b border-slate-50 pb-2">Logistics Recipient</h4>
              <p className="text-xl font-black text-slate-900 mb-1 uppercase">{orderData.customerName}</p>
              <p className="text-slate-500 font-bold text-xs">{orderData.phone}</p>
            </div>
            <div className="md:text-right">
              <h4 className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 border-b border-slate-50 pb-2 md:border-none">Shipping Terminal</h4>
              <p className="text-slate-600 font-bold text-xs leading-relaxed uppercase">{orderData.address}</p>
              <p className="text-slate-900 font-black uppercase tracking-widest mt-1">{orderData.city}, {orderData.state} - {orderData.pinCode}</p>
            </div>
          </div>

          <table className="w-full mb-16">
            <thead>
              <tr className="border-b-2 border-slate-50">
                <th className="py-5 text-left font-black text-slate-400 uppercase text-[8px] tracking-[0.2em]">Species Configuration</th>
                <th className="py-5 text-center font-black text-slate-400 uppercase text-[8px] tracking-[0.2em]">Qty</th>
                <th className="py-5 text-right font-black text-slate-400 uppercase text-[8px] tracking-[0.2em]">Net Mass</th>
                <th className="py-5 text-right font-black text-slate-400 uppercase text-[8px] tracking-[0.2em]">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orderData.items.map((item: any, idx: number) => (
                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6">
                    <p className="font-black text-slate-900 text-sm uppercase leading-tight">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                       <span className="text-slate-400 text-[8px] font-bold uppercase tracking-widest">{item.category}</span>
                       {item.selectedVariation && (
                         <span className="text-sky-600 text-[8px] font-black uppercase tracking-widest border border-sky-100 bg-sky-50 px-1 rounded-sm">{item.selectedVariation}</span>
                       )}
                    </div>
                  </td>
                  <td className="py-6 text-center text-slate-900 font-black text-xs">{item.quantity}</td>
                  <td className="py-6 text-right text-slate-500 font-bold text-xs">{(item.weight * item.quantity).toFixed(2)} kg</td>
                  <td className="py-6 text-right font-black text-slate-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-8 border-t border-slate-100">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Species Total</span>
                <span className="text-slate-900 font-black">₹{orderData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex flex-col items-end">
                   <span>Monday Order Protocol</span>
                   <span className="text-[7px] font-black uppercase text-slate-300 mt-0.5">Payload: {orderData.weight.toFixed(2)} kg</span>
                </div>
                <span className="text-slate-900 font-black self-start">₹{orderData.shippingCharge.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-between text-3xl font-black text-sky-600 tracking-tighter">
                <span className="text-[10px] self-center text-slate-400 tracking-widest">COMMITMENT</span>
                <span>₹{orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-12 border-t border-slate-50 text-center space-y-4">
            <div className="flex items-center justify-center gap-6">
               <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Verified Quarantine</span>
               </div>
               <div className="flex items-center gap-1.5 text-slate-300">
                  <Truck size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">ST/Professional Logistics</span>
               </div>
            </div>
            <p className="text-slate-300 text-[8px] font-bold uppercase tracking-[0.2em] leading-loose">
              MVS Aqua · Tirupati Biological Fulfillment Center<br/>
              This digital receipt confirms the finalization of the consignment for shipping protocol.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-16 print:hidden">
        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto px-10 py-4 bg-black hover:bg-slate-800 text-white font-black rounded-sm flex items-center justify-center space-x-3 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
        >
          <Printer size={16} />
          <span className="text-[10px] uppercase tracking-widest">Print Protocol Receipt</span>
        </button>
        <Link to="/" className="w-full sm:w-auto px-10 py-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-sm flex items-center justify-center space-x-3 transition-all shadow-xl shadow-sky-500/20 active:scale-[0.98]">
          <Home size={16} />
          <span className="text-[10px] uppercase tracking-widest">Return to Dashboard</span>
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
