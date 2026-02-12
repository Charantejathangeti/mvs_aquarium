
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Droplets, Anchor, ChevronRight, LayoutGrid } from 'lucide-react';

const Home: React.FC = () => {
  // Enhanced category list for visual navigation tabs
  const categoryTabs = [
    { 
      name: 'Bettas', 
      image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400', 
      tag: 'Premium'
    },
    { 
      name: 'Tetras', 
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400', 
      tag: 'Schooling'
    },
    { 
      name: 'Goldfish', 
      image: 'https://images.unsplash.com/photo-1524704659690-3f7a3000bb24?auto=format&fit=crop&q=80&w=400', 
      tag: 'Classic'
    },
    { 
      name: 'Plants', 
      image: 'https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=400', 
      tag: 'Flora'
    },
    { 
      name: 'Shrimps', 
      image: 'https://images.unsplash.com/photo-1509914398892-963f53ebe675?auto=format&fit=crop&q=80&w=400', 
      tag: 'Nano'
    },
    { 
      name: 'Discus', 
      image: 'https://images.unsplash.com/photo-1524704659690-3f7a3000bb24?auto=format&fit=crop&q=80&w=400', 
      tag: 'Elite'
    },
    { 
      name: 'Livebearers', 
      image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=400', 
      tag: 'Active'
    },
    { 
      name: 'Cichlids', 
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400', 
      tag: 'Strong'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-24 lg:pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-60">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-sky-50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] right-[-5%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              MVS <br />
              <span className="text-[#0ea5e9]">Aqua.</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-500 max-w-xl mb-12 font-medium leading-relaxed">
              Exotic breeds, professionally quarantined livestock, and premium aquatic essentials. Shipped with precision from Tirupati.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/shop" className="w-full sm:w-auto px-12 py-5 bg-[#0ea5e9] hover:bg-[#0369a1] text-white font-black rounded-2xl transition-all shadow-xl shadow-sky-500/30 flex items-center justify-center space-x-2 group transform hover:scale-105 active:scale-95">
                <span>Browse Full Catalog</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="flex-1 max-w-lg lg:max-w-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <div className="relative group">
               <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-[4rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
               <div className="relative bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden aspect-square shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=800" 
                    alt="Exotic Fish" 
                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                 <div className="absolute bottom-12 left-12">
                    <p className="text-white font-black text-4xl leading-tight">Elite Quality <br/> Livestock</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Species Selection Navigation Gallery (Visual Tabs) */}
      <section className="max-w-7xl mx-auto px-4 -mt-20 lg:-mt-28 relative z-30 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="bg-white/80 backdrop-blur-2xl border border-slate-100 rounded-[3.5rem] p-8 md:p-14 shadow-2xl shadow-slate-200/40">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start space-x-2 text-sky-500 mb-2">
                    <LayoutGrid size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">Species Quick Filters</span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Shop by Species</h2>
                 <p className="text-slate-400 text-sm font-medium mt-1">Select a category below to explore our verified stock.</p>
              </div>
              <Link to="/shop" className="hidden md:flex items-center space-x-2 px-6 py-3 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 rounded-xl text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all">
                 <span>View All Items</span>
                 <ChevronRight size={14} />
              </Link>
           </div>
           
           {/* Visual Tabs Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8">
              {categoryTabs.map((cat, idx) => (
                <Link 
                  key={idx} 
                  to={`/shop?cat=${cat.name}`}
                  className="flex flex-col items-center space-y-4 group"
                >
                  <div className="relative w-full aspect-square max-w-[110px]">
                    {/* Ring animation on hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-sky-500 rounded-full transition-all duration-500 scale-110 opacity-0 group-hover:opacity-100" />
                    
                    {/* Circular Image Portrait */}
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-xl group-hover:shadow-sky-100 transition-all duration-300">
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-115" 
                        />
                    </div>
                    
                    {/* Small badge label */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {cat.tag}
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] transition-colors group-hover:text-sky-600 mb-1">{cat.name}</h4>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="max-w-7xl mx-auto px-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
           <div className="relative h-[440px] rounded-[3rem] overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" 
                alt="Banner" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-10 lg:p-14 flex flex-col justify-center items-start">
                 <span className="px-4 py-1.5 bg-sky-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest mb-4">Staff Pick</span>
                 <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">Neon Tetra <br/> Collections</h3>
                 <p className="text-slate-300 mb-8 max-w-xs font-medium text-sm leading-relaxed">Vibrant specimens perfect for planted community tanks.</p>
                 <Link to="/shop?cat=Tetras" className="px-8 py-4 bg-white text-slate-900 font-black rounded-xl hover:bg-sky-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                    Explore Tetras
                 </Link>
              </div>
           </div>
           
           <div className="relative h-[440px] rounded-[3rem] overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" 
                alt="Plants Banner" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-10 lg:p-14 flex flex-col justify-center items-start">
                 <span className="px-4 py-1.5 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest mb-4">Natural Living</span>
                 <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">Lush Aquatic <br/> Ecosystems</h3>
                 <p className="text-slate-300 mb-8 max-w-xs font-medium text-sm leading-relaxed">Hardy plants to bring natural filtration to your tank.</p>
                 <Link to="/shop?cat=Plants" className="px-8 py-4 bg-white text-slate-900 font-black rounded-xl hover:bg-emerald-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                    View Flora
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <div className="bg-slate-50 border border-slate-100 rounded-[3.5rem] p-10 lg:p-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-50 rounded-full blur-[100px] -z-10 opacity-50" />
          
          <div className="space-y-6 relative z-10">
            <div className="mx-auto w-20 h-20 rounded-[1.5rem] bg-white text-blue-600 flex items-center justify-center border border-slate-100 shadow-lg">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Monday Dispatch</h3>
            <p className="text-slate-400 font-medium leading-relaxed px-4 text-xs">Exclusively via ST/Professional Courier for maximum safety.</p>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="mx-auto w-20 h-20 rounded-[1.5rem] bg-white text-amber-600 flex items-center justify-center border border-slate-100 shadow-lg">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">DOA Assurance</h3>
            <p className="text-slate-400 font-medium leading-relaxed px-4 text-xs">45% refund for damages reported with a clear unboxing video.</p>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="mx-auto w-20 h-20 rounded-[1.5rem] bg-white text-sky-600 flex items-center justify-center border border-slate-100 shadow-lg">
              <Droplets size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Prepaid Only</h3>
            <p className="text-slate-400 font-medium leading-relaxed px-4 text-xs">Secure processing with priority health handling.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
         <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight italic">
           "Place your orders and reunite with us for the finest aquatic treasures. 🤟🏻❤️‍🩹"
         </h4>
         <Link to="/contact" className="text-[#0ea5e9] font-black uppercase tracking-[0.2em] text-[9px] hover:underline decoration-2 underline-offset-8">
           Customer Support via WhatsApp
         </Link>
      </section>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
