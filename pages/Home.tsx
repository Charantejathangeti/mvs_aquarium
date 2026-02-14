
import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Zap, Shield, Droplets, CheckCircle2, Star, Heart, ArrowUpRight, Anchor, FlaskConical, Globe } from 'lucide-react';
import { Product } from '../types';

interface HomeProps {
  products: Product[];
}

const Home: React.FC<HomeProps> = ({ products }) => {
  const categoryTabs = [
    { name: 'Bettas', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400', count: '12 Species' },
    { name: 'Tetras', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400', count: '08 Species' },
    { name: 'Goldfish', image: 'https://images.unsplash.com/photo-1524704659690-3f7a3000bb24?auto=format&fit=crop&q=80&w=400', count: '05 Species' },
    { name: 'Plants', image: 'https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=400', count: '15 Varieties' }
  ];

  const featured = products.slice(-4).reverse();

  return (
    <div className="space-y-24 pb-32">
      {/* Premium Split-Screen Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <img src="https://images.unsplash.com/photo-1534685785832-62fe73994362?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="Deep Sea" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10 py-20">
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-px w-10 bg-cyan-500" />
                 <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em]">Tirupati Hub Node v2.5</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none uppercase">
                MVS<br/>
                <span className="text-cyan-500">AQUA.</span>
              </h1>
            </div>
            
            <p className="text-lg text-slate-400 max-w-lg font-medium leading-relaxed">
              Biological excellence in aquatic commerce. Premium livestock, expert-calibrated water parameters, and precision logistics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/shop" className="w-full sm:w-auto px-12 py-6 bg-white text-black font-black rounded-sm text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-cyan-500 transition-all shadow-3xl shadow-white/5 active:scale-95">
                <span>Enter Catalog</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="w-full sm:w-auto px-12 py-6 border-2 border-slate-700 text-slate-300 font-black rounded-sm text-[11px] uppercase tracking-[0.4em] hover:border-white hover:text-white transition-all text-center">
                Registry Profile
              </Link>
            </div>
            
            <div className="flex items-center gap-10 pt-8 border-t border-white/5">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">500+</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Hobbyists</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">100%</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Quarantine Rate</span>
               </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative group animate-fade-in">
             <div className="absolute -inset-4 bg-cyan-500/10 rounded-sm -z-10 group-hover:bg-cyan-500/20 transition-all duration-1000" />
             <div className="aspect-[4/5] bg-slate-900 border-8 border-white/5 rounded-sm overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200" 
                  alt="Elite Specimen" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]" 
                />
                <div className="absolute bottom-10 left-10 bg-black/60 backdrop-blur-xl p-8 border border-white/10 max-w-[280px] shadow-2xl">
                   <div className="flex items-center gap-2 mb-2">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em]">Specimen of the Week</span>
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Royal Halfmoon</h3>
                   <Link to="/shop" className="text-[10px] font-black text-white uppercase tracking-widest border-b-2 border-cyan-500 pb-1 flex items-center gap-2 w-fit">
                      Analyze Specimen <ArrowUpRight size={14} />
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Protocol Strip */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Monday Logistics', desc: 'Consignments finalized every Monday to ensure 72h window transit safety.' },
            { icon: Shield, title: 'Registry DOA Lock', desc: 'Comprehensive coverage for all verified casualties during biological transport.' },
            { icon: FlaskConical, title: 'Lab Quarantine', desc: 'Every specimen undergoes a rigorous 14-day observation protocol.' }
          ].map((f, i) => (
            <div key={i} className="p-10 bg-white border border-slate-200 rounded-sm flex flex-col gap-6 shadow-3xl shadow-slate-900/5 hover:border-cyan-500 transition-colors">
              <div className="w-14 h-14 bg-slate-950 text-cyan-400 flex items-center justify-center rounded-sm"><f.icon size={28} /></div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-3">{f.title}</h3>
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-tight leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Biotopes expert series */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
           <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">Biotopes.</h2>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.5em] mt-2">Expert curated series 2024</p>
           </div>
           <Link to="/shop" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] hover:text-cyan-600 transition-all flex items-center gap-3 border-b-2 border-slate-900 pb-2">
              Browse Full Node <ArrowRight size={16} />
           </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {categoryTabs.map((cat, idx) => (
             <Link key={idx} to={`/shop?cat=${cat.name}`} className="group relative overflow-hidden aspect-[3/4] rounded-sm bg-slate-100 shadow-xl">
                 <img src={cat.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt={cat.name} />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-8">
                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-2">{cat.count}</span>
                    <span className="text-2xl font-black text-white uppercase tracking-widest">{cat.name}</span>
                    <div className="h-1 w-0 bg-cyan-500 mt-4 group-hover:w-full transition-all duration-700" />
                 </div>
             </Link>
           ))}
        </div>
      </section>

      {/* New Arrivals: Biological Drop */}
      <section className="bg-slate-50 py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-20 space-y-6">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Biological Catalog Drop.</h2>
            <p className="text-[11px] text-slate-400 font-black max-w-md uppercase tracking-[0.3em] leading-relaxed">Recently cleared quarantine units now available for procurement.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {featured.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden hover:border-slate-900 hover:shadow-2xl transition-all group relative">
                 <Link to={`/product/${p.id}`} className="block aspect-square relative overflow-hidden bg-slate-100">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                    <div className="absolute top-6 left-6">
                       <span className="px-3 py-1 bg-black/90 text-white text-[9px] font-black uppercase tracking-[0.2em]">{p.category}</span>
                    </div>
                 </Link>
                 <div className="p-8">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-4 line-clamp-1">{p.name}</h3>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                       <span className="text-xl font-black text-slate-900">₹{p.price}</span>
                       <Link to={`/product/${p.id}`} className="p-2 bg-slate-50 text-slate-400 hover:text-cyan-600 transition-colors"><ArrowUpRight size={18} /></Link>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy: Registry Values */}
      <section className="max-w-7xl mx-auto px-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
               <div className="space-y-4">
                  <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">The Registry Protocol.</h2>
                  <p className="text-[11px] text-cyan-600 font-black uppercase tracking-[0.5em]">Establishing biological trust since 2021</p>
               </div>
               
               <div className="space-y-10">
                  {[
                    { icon: CheckCircle2, title: 'Genetic Purity', desc: 'Every specimen is analyzed for structural integrity and genetic purity before listing.' },
                    { icon: Globe, title: 'Cold-Chain Dispatch', desc: 'Our proprietary packaging ensures oxygen saturation for up to 96 hours.' },
                    { icon: Anchor, title: 'Regional Integrity', desc: 'Direct supply chain from Tirupati hub to your destination node.' }
                  ].map((v, i) => (
                    <div key={i} className="flex gap-8 group">
                       <div className="shrink-0 w-14 h-14 bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-center rounded-sm group-hover:bg-cyan-500 group-hover:text-white transition-all"><v.icon size={24} /></div>
                       <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">{v.title}</h4>
                          <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">{v.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative group">
               <div className="absolute -inset-10 bg-slate-100 rounded-full -z-10 group-hover:scale-110 transition-transform duration-1000" />
               <div className="bg-slate-900 aspect-square rounded-sm overflow-hidden shadow-3xl">
                  <img src="https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt="Master Node" />
               </div>
               <div className="absolute -bottom-10 -right-10 p-10 bg-white border border-slate-200 shadow-3xl max-w-xs animate-bounce-slow">
                  <FlaskConical size={32} className="text-cyan-600 mb-6" />
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-loose italic">
                    "We don't just sell aquatic life; we manage biological assets with institutional precision."
                  </p>
               </div>
            </div>
         </div>
      </section>

      <style>{`
         @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
         }
         .animate-bounce-slow {
            animation: bounce-slow 4s ease-in-out infinite;
         }
      `}</style>
    </div>
  );
};

export default Home;
