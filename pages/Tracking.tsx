
import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';

const Tracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate lookup
    setTimeout(() => {
      setResult({
        id: orderId,
        status: 'Dispatched',
        carrier: 'Professional Courier / ST Courier',
        trackingUrl: 'https://www.tpcindia.com/',
        steps: [
          { status: 'Order Confirmed', date: 'Processing', completed: true },
          { status: 'Dispatched', date: 'Monday Dispatch', completed: true },
          { status: 'In Transit', date: 'Track via Link Above', completed: false },
        ]
      });
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white mb-4">Track Package</h1>
        <p className="text-slate-400 font-medium">Professional & ST Courier Tracking Service</p>
      </div>

      <div className="bg-[#0b1220] border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 shadow-xl mb-12">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              required
              className="w-full pl-12 pr-4 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/30 font-bold"
              placeholder="Enter Order ID (e.g. ORD-12345)"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching}
            className="px-10 py-5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#020617] font-black rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : <><Search size={20} /><span>Track</span></>}
          </button>
        </form>
      </div>

      <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] mb-12 flex flex-col md:flex-row items-center gap-6">
         <AlertTriangle className="text-amber-500 shrink-0" size={40} />
         <div>
           <h3 className="text-white font-bold mb-1">Hi Everyone!</h3>
           <p className="text-slate-400 text-sm leading-relaxed">
             All parcels dispatched every Monday via <span className="text-white font-bold">ST Courier & Professional Courier</span>. Tracking IDs are sent to your registered WhatsApp numbers. Please track & collect tomorrow morning. Due to peak summer season, we advise against waiting for delivery attempts. Track & collect your parcel directly tomorrow.
           </p>
         </div>
      </div>

      {result && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-[#0b1220] border border-slate-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Current Status</p>
              <h3 className="text-3xl font-black text-[#38bdf8]">{result.status}</h3>
            </div>
            <a 
              href={result.trackingUrl} 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-[#38bdf8] text-white font-bold rounded-2xl flex items-center space-x-3 transition-all"
            >
              <span>Track at TPC Website</span>
              <ExternalLink size={18} />
            </a>
          </div>

          <div className="bg-[#0b1220] border border-slate-800 p-10 rounded-[2.5rem]">
            <h3 className="text-xl font-bold text-white mb-10 flex items-center space-x-3">
              <Truck className="text-[#38bdf8]" />
              <span>Journey Progress</span>
            </h3>
            <div className="relative space-y-12 ml-4">
              <div className="absolute left-4 top-0 w-1 h-full bg-slate-800 -z-10" />
              {result.steps.map((step: any, i: number) => (
                <div key={i} className="flex items-start space-x-8">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    step.completed ? 'bg-[#38bdf8] text-[#020617]' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {step.completed ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 rounded-full bg-slate-600" />}
                  </div>
                  <div>
                    <h4 className={`text-lg font-black ${step.completed ? 'text-white' : 'text-slate-500'}`}>{step.status}</h4>
                    <p className="text-sm text-slate-500">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
               <h4 className="text-white font-bold mb-2">Collection Note</h4>
               <p className="text-slate-400 text-xs leading-relaxed">
                 Track and collect your parcel tomorrow morning; don’t wait for door delivery to ensure livestock safety.
               </p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
               <h4 className="text-white font-bold mb-2">Unboxing Video</h4>
               <p className="text-slate-400 text-xs leading-relaxed">
                 No replacement accepted without an unboxing video 💯. In case of damages, 45% refund provided.
               </p>
            </div>
          </div>
        </div>
      )}
      
      {!result && !isSearching && (
        <div className="mt-20 text-center">
           <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Need help with your order?</p>
           <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
             If you recently placed an order and don’t see it yet, please contact us on WhatsApp with your name and phone number.
           </p>
           <a href={`https://wa.me/6302382280`} className="text-[#38bdf8] font-black hover:underline">Contact via WhatsApp</a>
        </div>
      )}
    </div>
  );
};

export default Tracking;
