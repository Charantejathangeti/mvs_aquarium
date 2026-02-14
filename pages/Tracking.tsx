
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
        status: 'SHIPPED',
        carrier: 'Professional Courier',
        trackingUrl: 'https://www.tpcindia.com/',
        orderDate: 'March 11, 2024',
        estimatedArrival: 'March 14, 2024',
        location: 'Hub Transit - Nellore',
        history: [
          { event: 'Order Received', desc: 'Order logged and confirmed', date: 'Mar 11, 09:24 AM', status: 'completed' },
          { event: 'Processing', desc: 'Product health check & packaging', date: 'Mar 11, 02:15 PM', status: 'completed' },
          { event: 'Shipped', desc: 'Handed over to delivery partner', date: 'Mar 12, 10:30 AM', status: 'completed' },
          { event: 'In Transit', desc: 'Arrived at regional sorting center', date: 'Mar 13, 04:45 AM', status: 'active' },
          { event: 'Delivered', desc: 'Finalized arrival at destination', date: 'Pending', status: 'pending' },
        ]
      });
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Search Header */}
      <div className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-500/5 skew-x-[-20deg] translate-x-1/2" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="px-2 py-0.5 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm">ORDER TRACKING</div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MVS Aqua Logistics</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Track Your Order.</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:bg-white/20 transition-all text-sm font-bold uppercase tracking-widest"
                placeholder="Enter Order ID (e.g. MVS-123456)"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="px-10 py-4 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-[11px] uppercase tracking-widest shadow-xl shadow-sky-900/20"
            >
              {isSearching ? <Clock className="animate-spin" size={16} /> : 'Track Order'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {result ? (
          <div className="space-y-6 animate-fade-in pb-24">
            {/* Summary Strip */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                <p className="text-sm font-black text-sky-600">#{result.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-sm font-black uppercase text-slate-900">{result.status}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier</p>
                <p className="text-sm font-black text-slate-900">{result.carrier}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Arrival</p>
                <p className="text-sm font-black text-slate-900">{result.estimatedArrival}</p>
              </div>
            </div>

            {/* Detailed Timeline */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
               <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <Truck size={18} className="text-slate-900" />
                     <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Shipment Progress</h2>
                  </div>
                  <a href={result.trackingUrl} target="_blank" className="text-[10px] font-black uppercase text-sky-600 flex items-center gap-2 hover:underline">
                    External Tracking <ExternalLink size={12} />
                  </a>
               </div>

               <div className="p-10 relative">
                  {/* The Timeline Line */}
                  <div className="absolute left-[47px] top-12 bottom-12 w-px bg-slate-100 hidden sm:block" />

                  <div className="space-y-12 relative">
                     {result.history.map((step: any, i: number) => (
                       <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
                          {/* Circle Icon */}
                          <div className={`relative z-10 w-8 h-8 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all ${
                            step.status === 'completed' ? 'bg-slate-900 border-slate-900 text-white' : 
                            step.status === 'active' ? 'bg-white border-sky-600 text-sky-600 shadow-lg shadow-sky-100' : 
                            'bg-slate-50 border-slate-200 text-slate-300'
                          }`}>
                            {step.status === 'completed' ? <CheckCircle2 size={16} /> : 
                             step.status === 'active' ? <Clock size={16} className="animate-pulse" /> : 
                             <Circle size={6} fill="currentColor" />}
                          </div>

                          {/* Event Text */}
                          <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                             <div className="space-y-1">
                                <h4 className={`text-sm font-black uppercase tracking-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>{step.event}</h4>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{step.desc}</p>
                             </div>
                             <div className="text-right flex flex-col items-start sm:items-end">
                                <span className={`text-[11px] font-black uppercase ${step.status === 'pending' ? 'text-slate-200' : 'text-slate-400'}`}>{step.date}</span>
                                {step.status === 'active' && (
                                   <span className="text-[9px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-sm uppercase tracking-widest mt-1">Live Update</span>
                                )}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Assistance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white border border-slate-200 p-8 rounded-sm space-y-4">
                  <div className="flex items-center gap-3 text-slate-900">
                     <AlertTriangle size={18} className="text-amber-500" />
                     <h3 className="text-[11px] font-black uppercase tracking-widest">Shipping Policy</h3>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed">
                    Livestock are shipped via premium specialized carriers. If your delivery is delayed more than 24 hours past the ETA, please contact us immediately.
                  </p>
               </div>
               <div className="bg-white border border-slate-200 p-8 rounded-sm space-y-4">
                  <div className="flex items-center gap-3 text-slate-900">
                     <HelpCircle size={18} className="text-sky-600" />
                     <h3 className="text-[11px] font-black uppercase tracking-widest">Customer Support</h3>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed">
                    Need help with unboxing or have a logistics question? Connect with our Tirupati team via WhatsApp for real-time assistance.
                  </p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-[11px] font-black text-sky-600 uppercase tracking-widest hover:underline block pt-2">
                    Message Support Team
                  </a>
               </div>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto py-32 text-center animate-fade-in space-y-8">
             <div className="w-20 h-20 bg-white border border-slate-200 text-slate-100 flex items-center justify-center mx-auto rounded-sm">
                <Box size={32} />
             </div>
             <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4">No Active Tracking Session</h3>
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-loose">
                  Please enter your unique order reference ID to see the live status of your shipment from our Tirupati hub.
                </p>
             </div>
             <div className="pt-8 border-t border-slate-100">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">MVS Aqua Logistics Core</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
