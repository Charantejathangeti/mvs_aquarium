
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { ShoppingCart, User, LogOut, Menu, X, MessageCircle, Mail, Instagram, Youtube, Globe, ShieldCheck, Truck, ChevronRight, Anchor } from 'lucide-react';
import { BUSINESS_INFO, WHATSAPP_NUMBER } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
  cloudStatus?: 'online' | 'offline' | 'syncing';
  lastSync?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, cartCount, cloudStatus = 'offline', lastSync }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isAdmin = sessionStorage.getItem('mvs_aqua_admin') === '1';
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('mvs_aqua_admin');
    navigate('/admin-login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-black flex items-center justify-center text-white font-bold rounded-sm text-sm">M</div>
                <span className="text-base font-extrabold text-black tracking-tighter">MVS AQUA</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    location.pathname === link.path ? 'text-sky-600' : 'text-slate-700 hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <Link to="/cart" className="relative p-1.5 text-slate-700 hover:text-black transition-transform active:scale-95">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[8px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAdmin ? (
                <Link to="/admin" className="p-1.5 text-sky-600 hover:text-sky-700">
                  <User size={18} />
                </Link>
              ) : (
                <Link to="/admin-login" className="p-1.5 text-slate-400 hover:text-black transition-colors">
                  <User size={18} />
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 text-black">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 animate-fade-in">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:bg-slate-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-4 px-3">
                 <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <ShoppingCart size={14} /> Cart ({cartCount})
                 </Link>
                 <Link to="/admin-login" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <User size={14} /> Admin
                 </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 pt-20 pb-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            
            {/* Identity Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-black rounded-sm text-xs">M</div>
                <span className="text-xl font-black text-black tracking-tighter uppercase">MVS AQUA HUB</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                Institutional-grade biological fulfillment and livestock commerce. Establishing trust through rigorous quarantine and precision logistics.
              </p>
              <div className="inline-flex items-center gap-3 bg-slate-50 px-4 py-3 border border-slate-100 rounded-sm">
                 <Globe 
                  size={12} 
                  className={`${
                    cloudStatus === 'online' ? 'text-emerald-500' : 
                    cloudStatus === 'syncing' ? 'text-sky-500 animate-spin' : 
                    'text-red-500'
                  }`} 
                 />
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Registry Status</span>
                    <span className="text-[9px] font-black text-black uppercase tracking-widest mt-1">
                      {cloudStatus === 'online' ? `Online: ${lastSync}` : cloudStatus === 'syncing' ? 'Broadcasting...' : 'Node Disconnected'}
                    </span>
                 </div>
              </div>
            </div>

            {/* Discovery Column */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] border-b border-slate-100 pb-3">Discovery</h4>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-sky-600 flex items-center gap-2 group">
                    <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                ))}
                <Link to="/tracking" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-sky-600 flex items-center gap-2 group">
                  <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  Order Tracking
                </Link>
              </nav>
            </div>

            {/* Trust Column */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] border-b border-slate-100 pb-3">Trust Protocol</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 group">
                    <div className="w-8 h-8 bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-600 transition-all rounded-sm">
                      <ShieldCheck size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-black uppercase tracking-widest">DOA Coverage</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Verified Arrivals Only</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="w-8 h-8 bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all rounded-sm">
                      <Truck size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-black uppercase tracking-widest">Monday Logistics</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Cold-Chain Protocol</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="w-8 h-8 bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 transition-all rounded-sm">
                      <Anchor size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-black uppercase tracking-widest">14-Day Quarantine</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Lab Verified Specimens</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Connect Column */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] border-b border-slate-100 pb-3">Connection</h4>
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-4">
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all rounded-sm shadow-sm"><MessageCircle size={16} /></a>
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all rounded-sm shadow-sm"><Mail size={16} /></a>
                    <a href={BUSINESS_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all rounded-sm shadow-sm"><Instagram size={16} /></a>
                    <a href={BUSINESS_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-sm shadow-sm"><Youtube size={16} /></a>
                 </div>
                 <div className="pt-2">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] leading-loose">
                      {BUSINESS_INFO.address}
                    </p>
                 </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-100">
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">
              &copy; {new Date().getFullYear()} MVS GLOBAL REGISTRY NODE · ALL ASSETS PROTECTED
            </div>
            <div className="flex items-center gap-6 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                <span className="hover:text-black cursor-pointer transition-colors">Privacy Protocol</span>
                <span>•</span>
                <span className="hover:text-black cursor-pointer transition-colors">Logistics Agreement</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
