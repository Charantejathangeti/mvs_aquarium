
import React from 'react';
import { Shield, Users, Globe, Award, Truck, ShieldCheck, RefreshCw, Anchor } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

const About: React.FC = () => {
  return (
    <div className="space-y-24 py-20 px-4">
      <section className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-white mb-8">Pioneering Aquatic Excellence</h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          MVS Aqua is dedicated to providing high-quality aquatic livestock and products. 
          Operating from the heart of Tirupati, we ensure your aquatic friends reach you healthy and safe.
        </p>
      </section>

      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl h-[500px] relative group">
          <img src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=800" alt="Exotic Betta" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-10 left-10">
            <span className="px-4 py-2 bg-[#38bdf8] text-[#020617] font-black rounded-xl uppercase tracking-widest text-xs">Exotic Stock</span>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-white">Trust, Transparency, Quality</h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Every order at MVS Aqua is handled with professional care. We specialize in live fish shipping across T.S. and A.P.
          </p>
          
          <div className="space-y-4 p-8 bg-[#0b1220] border border-slate-800 rounded-[2rem]">
             <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                   <Truck size={24} />
                </div>
                <div>
                   <p className="text-white font-bold">Monday Dispatch Policy</p>
                   <p className="text-slate-500 text-sm leading-relaxed">Every MONDAY only we dispatch parcels❗️ Orders placed throughout the week are prepared and sent on Monday to ensure safe transit.</p>
                </div>
             </div>
             <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                   <ShieldCheck size={24} />
                </div>
                <div>
                   <p className="text-white font-bold">Prepaid Orders Only</p>
                   <p className="text-slate-500 text-sm leading-relaxed">No Cash on delivery (COD). We accept payments via Google Pay, PhonePe, and Paytm.</p>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <p className="text-3xl font-extrabold text-[#38bdf8]">T.S/A.P</p>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Main Service Area</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-extrabold text-[#38bdf8]">₹80/kg</p>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Shipping Rate</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-10 bg-[#0b1220] border border-slate-800 rounded-[2.5rem] group hover:border-[#38bdf8]/50 transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-[#38bdf8]/10 text-[#38bdf8] mb-6 border border-[#38bdf8]/20 group-hover:scale-110 transition-transform">
                <RefreshCw size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Refund Policy</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                In case of any transit damages, a <span className="text-white font-bold">45% refund</span> of the amount will be issued. No replacement accepted without an unboxing video 💯.
              </p>
            </div>
            <div className="text-center p-10 bg-[#0b1220] border border-slate-800 rounded-[2.5rem] group hover:border-[#38bdf8]/50 transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-[#38bdf8]/10 text-[#38bdf8] mb-6 border border-[#38bdf8]/20 group-hover:scale-110 transition-transform">
                <Anchor size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Our Base</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {BUSINESS_INFO.address}<br/>
                Proudly serving the aquarium community since 2015.
              </p>
            </div>
            <div className="text-center p-10 bg-[#0b1220] border border-slate-800 rounded-[2.5rem] group hover:border-[#38bdf8]/50 transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-[#38bdf8]/10 text-[#38bdf8] mb-6 border border-[#38bdf8]/20 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Community</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Another time we are waiting for your orders and reunite with us. Place more orders and keep supporting us.🤟🏻❤️‍🩹
              </p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;
