
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, QrCode } from 'lucide-react';
import { WHATSAPP_NUMBER, BUSINESS_INFO } from '../constants';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl font-extrabold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-slate-400 mb-12">
            MVS Aqua is here to help with your aquarium needs. Reach out to us for orders, support, or partnership.
          </p>

          <div className="space-y-8 mb-12">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#38bdf8] shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Email Us</h4>
                <p className="text-slate-400">{BUSINESS_INFO.email}</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#38bdf8] shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Call Us</h4>
                <p className="text-slate-400">{BUSINESS_INFO.phone}</p>
                <p className="text-slate-500 text-sm">Mon-Sat, 10am - 8pm IST</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#38bdf8] shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">MVS Aqua HQ</h4>
                <p className="text-slate-400 leading-relaxed max-w-xs">{BUSINESS_INFO.address}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle size={22} />
                <span>Chat via WhatsApp</span>
              </a>
              <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-3 text-slate-400">
                 <QrCode size={24} />
                 <span className="text-xs font-bold uppercase tracking-widest">Prepaid Support Only</span>
              </div>
          </div>
        </div>

        <div className="bg-[#0b1220] border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white">Inquiry Received</h3>
              <p className="text-slate-400 leading-relaxed">
                Thank you for reaching out. For faster response, we recommend contacting us on WhatsApp.
              </p>
              <button onClick={() => setSubmitted(false)} className="text-[#38bdf8] font-bold hover:underline">New Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">First Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Last Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">How can we help?</label>
                <textarea required rows={4} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 resize-none" placeholder="Enter your query here..." />
              </div>
              <button type="submit" className="w-full py-5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#020617] font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#38bdf8]/20">
                <span>Send message</span>
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
