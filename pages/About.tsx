
import React from 'react';
import { Shield, Users, Globe, Award, Truck, ShieldCheck, RefreshCw, Anchor, Fish, FlaskConical, Map, History } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

const About: React.FC = () => {
  return (
    <div className="bg-white pb-24">
      {/* Header Banner - Minimalist Legacy */}
      <section className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <img src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="Banner" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Aquatic Legacy.</h1>
          <p className="text-base text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto uppercase tracking-wide">
            MVS Aqua is a premier biological fulfillment center based in Tirupati, 
            bridging the gap between ethical breeders and discerning aquarium hobbyists.
          </p>
        </div>
      </section>

      {/* Main Philosophy */}
      <section className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-sky-500/5 group-hover:bg-sky-500/10 transition-all rounded-sm -z-10" />
          <img src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200" alt="Exotic Betta" className="w-full aspect-square object-cover rounded-sm shadow-2xl" />
          <div className="absolute -bottom-8 -right-8 bg-white border border-slate-200 p-8 shadow-xl max-w-[240px]">
             <FlaskConical size={32} className="text-sky-600 mb-4" />
             <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">"Our water parameters are calibrated daily to simulate natural biotypes for zero-stress acclimation."</p>
          </div>
        </div>
        
        <div className="space-y-10">
          <div>
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-6">Scientific Rearing.</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              We operate under a simple but rigorous philosophy: livestock health is paramount. 
              Our Tirupati facility isn't just a warehouse—it's a sophisticated biological holding center 
              where every species from Bettas to Discus undergoes a systematic quarantine protocol.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-sky-600" />
                  <h4 className="text-xs font-black text-black uppercase tracking-widest">Quarantine Pro</h4>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed">Minimum 14-day observation period before any species enters our public stocklist.</p>
            </div>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <Map size={18} className="text-sky-600" />
                  <h4 className="text-xs font-black text-black uppercase tracking-widest">Regional Focus</h4>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed">Specialized logistics for Tamil Nadu, Telangana, and Andhra Pradesh for shorter transit times.</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center gap-6">
             <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=mvs${i}`} alt="Team" />
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Join 5000+ satisfied hobbyists</p>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-2">Our Core Pillars</h2>
            <div className="w-20 h-1 bg-sky-500 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-10 border border-slate-200 rounded-sm hover:translate-y-[-4px] transition-all">
                <History size={24} className="text-sky-600 mb-6" />
                <h4 className="text-xs font-black text-black uppercase tracking-widest mb-4">Precision Logistics</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Ordering exclusively on Mondays allows us to avoid the "weekend lag" where parcels sit in hot courier hubs. Every minute matters in live transit.
                </p>
             </div>
             <div className="bg-white p-10 border border-slate-200 rounded-sm hover:translate-y-[-4px] transition-all">
                <RefreshCw size={24} className="text-sky-600 mb-6" />
                <h4 className="text-xs font-black text-black uppercase tracking-widest mb-4">Risk Mitigation</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  With our 45% DOA refund policy, we stand by our packaging. We share the inherent risks of livestock shipping with our customers.
                </p>
             </div>
             <div className="bg-white p-10 border border-slate-200 rounded-sm hover:translate-y-[-4px] transition-all">
                <Users size={24} className="text-sky-600 mb-6" />
                <h4 className="text-xs font-black text-black uppercase tracking-widest mb-4">Support Ecosystem</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  We don't just sell fish. We provide setup advice, feeding protocols, and disease management support to ensure your specimens thrive.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Address & Trust */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
         <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-sky-100">
            <Anchor size={24} />
         </div>
         <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-4">Rooted in Tirupati.</h3>
         <p className="text-sm text-slate-500 leading-relaxed font-medium mb-10">
           Located at {BUSINESS_INFO.address}, MVS Aqua continues to serve as the gateway 
           to high-quality aquatics for the southern region. We invite you to be part of our growing aquatic community.
         </p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="px-6 py-3 bg-white border border-slate-200 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
               VAT Registered Entity
            </div>
            <div className="px-6 py-3 bg-white border border-slate-200 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
               Verified Export Grade
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
