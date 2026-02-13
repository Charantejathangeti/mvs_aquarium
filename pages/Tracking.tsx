
import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, MapPin, ExternalLink, AlertTriangle, ShieldCheck, Box, Calendar } from 'lucide-react';

const Tracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setResult({
        id: orderId,
        status: 'Dispatched',
        carrier: 'Professional Courier / ST Courier',
        trackingUrl: 'https://www.tpcindia.com/',
        dispatchDate: 'Monday, March 11',
        estimatedCollection: 'Tuesday Morning',
        steps: [
          { status: 'Order Verified', date: 'March 09', completed: true },
          { status: 'Health Quarantine', date: 'March 10', completed: true },
          { status: 'Dispatched from Tirupati', date: 'March 11', completed: true },
          { status: 'Available for Collection', date: 'Pending', completed: false },
        ]
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase">Track Dispatch</h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            Professional & ST Courier Logistics Network Tracking
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10">
        {/* Search Bar */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200/50 mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Box className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input
                required
                className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-500/5 font-bold text-lg placeholder:text-slate-300"
                placeholder="Enter Consignment ID (e.g. MVS123456)"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="px-12 py-5 bg-slate-900 hover:bg-sky-600 text-white font-black rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {isSearching ? 'Processing...' : <><Search size={22} /><span className="text-xs uppercase tracking-widest">Track Now</span></>}
            </button>
          </form>
        </div>

        {/* Summer Season Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-8 lg:p-10 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
           <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
             <AlertTriangle size={32} />
           </div>
           <div>
             <h3 className="text-amber-900 font-black text-lg mb-2 uppercase tracking-tight">Summer Dispatch Protocol</h3>
             <p className="text-amber-700/80 text-sm leading-relaxed font-medium">
               Parcels are dispatched every Monday. Due to high temperatures, track & collect your parcel directly from the hub on Tuesday morning. <span className="font-bold">Do not wait for home delivery</span> to ensure livestock safety.
             </p>
           </div>
        </div>

        {result ? (
          <div className="space-y-10 animate-fade-in">
            {/* Quick Summary Card */}
            <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl flex flex-col lg:flex-row justify-between items-center gap-10">
              <div className="text-center lg:text-left">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Consignment Status</p>
                <div className="flex items-center gap-4">
                  <h3 className="text-4xl font-black text-sky-600 uppercase tracking-tighter">{result.status}</h3>
                  <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="h-px w-20 bg-slate-100 hidden lg:block" />
              <div className="grid grid-cols-2 gap-10">
                <div className="text-center lg:text-left">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Dispatch Date</p>
                  <p className="text-slate-900 font-black text-sm">{result.dispatchDate}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Collection</p>
                  <p className="text-slate-900 font-black text-sm">{result.estimatedCollection}</p>
                </div>
              </div>
              <a 
                href={result.trackingUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full lg:w-auto px-8 py-5 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white font-black rounded-2xl flex items-center justify-center space-x-3 transition-all border border-sky-100"
              >
                <span className="text-[10px] uppercase tracking-widest">Courier Website</span>
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Steps Progress */}
            <div className="bg-white border border-slate-200 p-12 rounded-[3.5rem] shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-12 flex items-center space-x-3 uppercase tracking-widest">
                <Truck className="text-sky-600" size={20} />
                <span>Logistics Timeline</span>
              </h3>
              <div className="relative space-y-16 pl-4">
                <div className="absolute left-[2.35rem] top-2 w-0.5 h-full bg-slate-100 -z-10" />
                {result.steps.map((step: any, i: number) => (
                  <div key={i} className="flex items-start space-x-10 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white transition-all shadow-md ${
                      step.completed ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-300'
                    }`}>
                      {step.completed ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                    </div>
                    <div>
                      <h4 className={`text-xl font-black tracking-tight ${step.completed ? 'text-slate-900' : 'text-slate-300'}`}>{step.status}</h4>
                      <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${step.completed ? 'text-slate-400' : 'text-slate-200'}`}>{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                 <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-3">Collection Protocol</h4>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium">
                   Collection from Courier Hub ensures your specimens are not exposed to extended heat in local delivery vans.
                 </p>
              </div>
              <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                 <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-3">Health Verification</h4>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium">
                   Unboxing videos are mandatory for DOA claims. We provide a 45% valuation refund for verified transit damages.
                 </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-8">
               <Package size={32} />
             </div>
             <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em] mb-4">No Active Session Detected</p>
             <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
               Enter your unique tracking ID sent to your WhatsApp to view the live dispatch progress.
             </p>
             <div className="mt-10">
                <a href={`https://wa.me/6302382280`} className="text-sky-600 font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                  Support Assistant via WhatsApp
                </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
