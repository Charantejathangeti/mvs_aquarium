
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, QrCode, Instagram, Youtube } from 'lucide-react';
import { WHATSAPP_NUMBER, BUSINESS_INFO } from '../constants';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">Connect.</h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md">
              Reach out for livestock inquiries, logistics support, or professional consultations.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-slate-50 border border-slate-200 text-sky-600 rounded-sm">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-black uppercase tracking-widest">Email Support</h4>
                <p className="text-xs text-slate-700 font-bold">{BUSINESS_INFO.email}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-slate-50 border border-slate-200 text-emerald-600 rounded-sm">
                <MessageCircle size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-black uppercase tracking-widest">WhatsApp Support</h4>
                <p className="text-xs text-slate-700 font-bold">+91 {WHATSAPP_NUMBER.slice(2, 7)} {WHATSAPP_NUMBER.slice(7)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-slate-50 border border-slate-200 text-black rounded-sm">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-black uppercase tracking-widest">Location</h4>
                <p className="text-xs text-slate-700 font-bold max-w-xs">{BUSINESS_INFO.address}</p>
              </div>
            </div>
            
            {/* Social Media Section */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Channels</h4>
              <div className="flex flex-col gap-3">
                <a href={BUSINESS_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                  <div className="p-2 bg-pink-50 border border-pink-100 text-[#E4405F] group-hover:bg-[#E4405F] group-hover:text-white transition-all rounded-sm">
                    <Instagram size={16} />
                  </div>
                  <span className="text-xs font-black text-slate-700 group-hover:text-black transition-colors uppercase tracking-widest">mvs_aqua</span>
                </a>
                <a href={BUSINESS_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                  <div className="p-2 bg-red-50 border border-red-100 text-[#FF0000] group-hover:bg-[#FF0000] group-hover:text-white transition-all rounded-sm">
                    <Youtube size={16} />
                  </div>
                  <span className="text-xs font-black text-slate-700 group-hover:text-black transition-colors uppercase tracking-widest">MVS Aqua</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50"
              >
                <MessageCircle size={18} />
                <span>Open WhatsApp Dispatch</span>
              </a>
              <div className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-center space-x-3 text-slate-500">
                 <QrCode size={18} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Prepaid Only Verification</span>
              </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-8 shadow-sm">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
              <CheckCircle2 size={40} className="text-emerald-600" />
              <h3 className="text-sm font-black text-black uppercase tracking-widest">Request Logged</h3>
              <p className="text-[10px] text-slate-600 font-medium">
                Transmission successful. For immediate response, use the WhatsApp link.
              </p>
              <button onClick={() => setSubmitted(false)} className="text-[9px] font-black text-sky-600 uppercase underline underline-offset-4">New Inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-xs font-bold text-black focus:border-black outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-xs font-bold text-black focus:border-black outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-xs font-bold text-black focus:border-black outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inquiry Message</label>
                <textarea required rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-xs font-bold text-black focus:border-black outline-none resize-none" placeholder="Describe your request..." />
              </div>
              <button type="submit" className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <span>Submit Transmission</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
