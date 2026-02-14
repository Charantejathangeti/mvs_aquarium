
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Droplets, LayoutGrid, CheckCircle2, Star, Sparkles, Heart } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

const Home: React.FC = () => {
  const categoryTabs = [
    { name: 'Bettas', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400' },
    { name: 'Tetras', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400' },
    { name: 'Goldfish', image: 'https://images.unsplash.com/photo-1524704659690-3f7a3000bb24?auto=format&fit=crop&q=80&w=400' },
    { name: 'Plants', image: 'https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=400' }
  ];

  const featured = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero - Cinematic Background */}
      <section className="relative min-h-[70vh] flex items-center pt-8 pb-10 px-4 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1534685785832-62fe73994362?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 z-10">
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none uppercase">
              MVS AQUA.<br/>
              <span className="text-sky-500">EXOTICS.</span>
            </h1>
            <p className="text-base text-slate-400 max-w-lg mb-10 font-medium leading-relaxed">
              Premium livestock, professionally quarantined, shipped with absolute precision. We curate high-grade specimens for the serious aquarium hobbyist.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/shop" className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-sm text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sky-500 hover:text-white transition-all shadow-xl shadow-white/5">
                <span>Browse Catalog</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="w-full sm:w-auto px-10 py-5 border border-slate-700 text-slate-300 font-black rounded-sm text-[11px] uppercase tracking-widest hover:border-white hover:text-white transition-all">
                Our Story
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl animate-fade-in hidden lg:block">
             <div className="relative aspect-[4/3] rounded-sm overflow-hidden group">
               <div className="absolute inset-0 border-[20px] border-white/5 z-20 pointer-events-none" />
               <img 
                  src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200" 
                  alt="Fish" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
               />
               <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md p-6 border border-white/10 max-w-xs">
                  <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Featured Specimen</p>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Royal Blue Halfmoon</h3>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Enhanced */}
      <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-slate-200 rounded-sm flex flex-col gap-4 shadow-2xl shadow-slate-900/5">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 flex items-center justify-center rounded-sm"><Zap size={24} /></div>
            <div>
              <h3 className="text-xs font-black text-black uppercase tracking-widest mb-2">Monday Order Protocol</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-relaxed uppercase tracking-tight font-bold">Orders are finalized every Monday to ensure livestock safety during regional transit.</p>
            </div>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-sm flex flex-col gap-4 shadow-2xl shadow-slate-900/5">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-sm"><Shield size={24} /></div>
            <div>
              <h3 className="text-xs font-black text-black uppercase tracking-widest mb-2">DOA Protection</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-relaxed uppercase tracking-tight font-bold">Industry leading 45% valuation refund for verified transit casualties. We share the risk.</p>
            </div>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-sm flex flex-col gap-4 shadow-2xl shadow-slate-900/5">
            <div className="w-12 h-12 bg-slate-50 text-slate-900 flex items-center justify-center rounded-sm"><Droplets size={24} /></div>
            <div>
              <h3 className="text-xs font-black text-black uppercase tracking-widest mb-2">Health First</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-relaxed uppercase tracking-tight font-bold">All livestock undergo a minimum 14-day quarantine before listing in our catalog.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections - Grid */}
      <section className="max-w-7xl mx-auto px-4 pt-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
           <div>
              <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Collections.</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Curated biological classifications</p>
           </div>
           <Link to="/shop" className="text-[10px] font-black text-black uppercase tracking-widest hover:text-sky-600 transition-colors border-b-2 border-black pb-1">Explore Full Catalog</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {categoryTabs.map((cat, idx) => (
             <Link key={idx} to={`/shop?cat=${cat.name}`} className="group relative overflow-hidden aspect-[4/5] border border-slate-200 rounded-sm">
                 <img src={cat.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt={cat.name} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <span className="text-white text-lg font-black uppercase tracking-widest">{cat.name}</span>
                    <span className="text-sky-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">View Species</span>
                 </div>
             </Link>
           ))}
        </div>
      </section>

      {/* Latest Specimens */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-4">Latest Arrivals</h2>
            <p className="text-sm text-slate-400 font-medium max-w-md mx-auto uppercase tracking-widest">Freshly quarantined livestock now available for ordering.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featured.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden hover:border-black transition-colors group">
                 <div className="aspect-square relative overflow-hidden bg-slate-50">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                    <div className="absolute top-4 left-4">
                       <span className="px-2 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest">{p.category}</span>
                    </div>
                 </div>
                 <div className="p-6">
                    <h3 className="text-xs font-black text-black uppercase tracking-tight mb-2 line-clamp-1">{p.name}</h3>
                    <div className="flex justify-between items-center">
                       <span className="text-lg font-black text-black">₹{p.price}</span>
                       <Link to={`/product/${p.id}`} className="text-[10px] font-black text-sky-600 uppercase tracking-widest group-hover:underline">Details</Link>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Values - Row */}
      <section className="max-w-7xl mx-auto px-4 py-12">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Why MVS Aqua?</h2>
               <div className="space-y-6">
                  {[
                    { icon: CheckCircle2, title: 'Expert Curation', desc: 'Our team hand-picks every specimen based on genetic purity and structural health.' },
                    { icon: Star, title: 'Premium Packaging', desc: 'Triple-bagged, oxygen-enriched, and climate-controlled packaging for safe transit.' },
                    { icon: Heart, title: 'Hobbyist First', desc: 'We aren\'t just a store; we are keepers first. We understand the value of a healthy specimen.' }
                  ].map((v, i) => (
                    <div key={i} className="flex gap-6">
                       <div className="shrink-0 w-10 h-10 bg-slate-50 text-black flex items-center justify-center rounded-sm"><v.icon size={20} /></div>
                       <div>
                          <h4 className="text-xs font-black text-black uppercase tracking-widest mb-1">{v.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{v.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <div className="bg-slate-100 aspect-square rounded-sm overflow-hidden grayscale">
                  <img src="https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Quality" />
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
