
import React, { useState } from 'react';
import { 
  Search, Package, Truck, CheckCircle2, MapPin, 
  ExternalLink, AlertTriangle, ShieldCheck, Box, 
  Calendar, Clock, Circle, Map, HelpCircle
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const Tracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulating a registry lookup
    setTimeout(() => {
      setResult({
        id: orderId.toUpperCase(),
        status: 'DISPATCHED',
        carrier: 'Professional Courier',
        trackingUrl: 'https://www.tpcindia.com/',
        orderDate: 'March 11, 2024',
        estimatedArrival: 'March 14, 2024',
        location: 'Hub Transit - Nellore',
        history: [
          { event: 'Order Placed', desc: 'Registry logged successfully', date: 'Mar 11, 09:24 AM', status: 'completed' },
          { event: 'Processing', desc: 'Health verification & packaging', date: 'Mar 11, 02:15 PM', status: 'completed' },
          { event: 'Dispatched', desc: 'Handed over to carrier partners', date: 'Mar 12, 10:30 AM', status: 'completed' },
          { event: 'In Transit', desc: 'Arrived at regional sort center', date: 'Mar 13, 04:45 AM', status: 'active' },
          { event: 'Delivered', desc: 'Finalized arrival at destination', date: 'Pending', status: 'pending' },
        ]
      });
      setIsSearching(false);
    }, 800;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Search Header */}
      <div className="bg-black text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-500/10 skew-x-[-20deg] translate-x-1/2" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="px-2 py-0.5 bg-sky-500 text-black text-[7px] font-black uppercase tracking-widest rounded-sm">REGISTRY TRACKING</div>
             <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">v4.0 Logistics Core</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">Track_Consignment.</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                required
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:bg-white/20 transition-all text-xs font-black uppercase tracking-widest"
                placeholder="Enter Consignment ID (e.g. INV-123456)"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-black font-black rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-[10px] uppercase tracking-widest"
            >
              {isSearching ? <Clock className="animate-spin" size={14} /> : 'Execute Lookup'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {result ? (
          <div className="space-y-4 animate-fade-in pb-20">
            {/* Summary Strip */}
            <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <div className="space-y-0.5">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Consignment ID</p>
                <p className="text-[11px] font-black text-sky-600">#{result.id}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-[11px] font-black uppercase text-black">{result.status}</p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Carrier Partner</p>
                <p className="text-[11px] font-black text-black">{result.carrier}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Est. Arrival</p>
                <p className="text-[11px] font-black text-black">{result.estimatedArrival}</p>
              </div>
            </div>

            {/* Detailed Timeline */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <Truck size={14} className="text-black" />
                     <h2 className="text-[9px] font-black uppercase tracking-widest text-black">Transit Journey Ledger</h2>
                  </div>
                  <a href={result.trackingUrl} target="_blank" className="text-[7px] font-black uppercase text-sky-600 flex items-center gap-1.5 hover:underline">
                    External Link <ExternalLink size={8} />
                  </a>
               </div>

               <div className="p-8 relative">
                  {/* The Timeline Line */}
                  <div className="absolute left-[39px] top-10 bottom-10 w-px bg-slate-100 hidden sm:block" />

                  <div className="space-y-10 relative">
                     {result.history.map((step: any, i: number) => (
                       <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
                          {/* Circle Icon */}
                          <div className={`relative z-10 w-6 h-6 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all ${
                            step.status === 'completed' ? 'bg-black border-black text-white' : 
                            step.status === 'active' ? 'bg-white border-sky-500 text-sky-500 shadow-lg shadow-sky-100' : 
                            'bg-slate-50 border-slate-200 text-slate-300'
                          }`}>
                            {step.status === 'completed' ? <CheckCircle2 size={12} /> : 
                             step.status === 'active' ? <Clock size={12} className="animate-pulse" /> : 
                             <Circle size={4} fill="currentColor" />}
                          </div>

                          {/* Event Text */}
                          <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full">
                             <div className="space-y-0.5">
                                <h4 className={`text-[10px] font-black uppercase tracking-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-black'}`}>{step.event}</h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{step.desc}</p>
                             </div>
                             <div className="text-right flex flex-col items-start sm:items-end">
                                <span className={`text-[9px] font-black uppercase ${step.status === 'pending' ? 'text-slate-200' : 'text-slate-400'}`}>{step.date}</span>
                                {step.status === 'active' && (
                                   <span className="text-[6px] font-black text-sky-500 bg-sky-50 px-1.5 py-0.5 rounded-sm uppercase tracking-widest mt-1">Live Update</span>
                                )}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center gap-8">
                  <div className="flex items-center gap-1.5 opacity-40">
                    <ShieldCheck size={10} />
                    <span className="text-[7px] font-black uppercase tracking-widest">Encrypted Data</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <Map size={10} />
                    <span className="text-[7px] font-black uppercase tracking-widest">Real-time Node Tracking</span>
                  </div>
               </div>
            </div>

            {/* Assistance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white border border-slate-200 p-6 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-black">
                     <AlertTriangle size={14} className="text-amber-500" />
                     <h3 className="text-[9px] font-black uppercase tracking-widest">Transit Protocol</h3>
                  </div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase leading-relaxed">
                    Livestock are shipped via premium cold-chain carriers. If delayed by >24h beyond ETA, contact emergency dispatch immediately.
                  </p>
               </div>
               <div className="bg-white border border-slate-200 p-6 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-black">
                     <HelpCircle size={14} className="text-sky-500" />
                     <h3 className="text-[9px] font-black uppercase tracking-widest">Need Dispatch Assistance?</h3>
                  </div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase leading-relaxed">
                    Contact our Tirupati fulfillment hub directly via WhatsApp for unboxing verification or logistics disputes.
                  </p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-[8px] font-black text-sky-600 uppercase tracking-widest hover:underline block pt-1">
                    Connect to Live Support
                  </a>
               </div>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto py-24 text-center animate-fade-in space-y-6">
             <div className="w-16 h-16 bg-white border border-slate-200 text-slate-100 flex items-center justify-center mx-auto rounded-sm">
                <Box size={24} />
             </div>
             <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">No Active Session Logged</h3>
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-loose">
                  Please enter the unique consignment reference provided at checkout to retrieve the live logistics journey from the MVS Aqua registry.
                </p>
             </div>
             <div className="pt-6 border-t border-slate-100">
                <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Tirupati Biological Hub Logistics Core</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
