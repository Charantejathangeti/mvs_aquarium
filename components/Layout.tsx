
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, MessageCircle, Mail, Instagram, Youtube, Phone } from 'lucide-react';
import { BUSINESS_INFO, WHATSAPP_NUMBER } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, cartCount }) => {
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
                <div className="w-7 h-7 bg-black flex items-center justify-center text-white font-bold rounded-sm">M</div>
                <span className="text-base font-extrabold text-black tracking-tighter">MVS AQUA</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                    location.pathname === link.path ? 'text-sky-600' : 'text-slate-700 hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <Link to="/cart" className="relative p-1.5 text-slate-700 hover:text-black">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[8px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAdmin ? (
                <button onClick={handleLogout} className="p-1.5 text-slate-500 hover:text-red-600">
                  <LogOut size={18} />
                </button>
              ) : (
                <Link to="/admin-login" className="p-1.5 text-slate-500 hover:text-black">
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
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Branding & Origin */}
            <div className="flex flex-col space-y-2 items-center md:items-start">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-black flex items-center justify-center text-white font-bold rounded-sm text-[10px]">M</div>
                <span className="text-sm font-black text-black uppercase tracking-tighter">MVS AQUA</span>
              </div>
              <div className="flex flex-col space-y-0.5 text-center md:text-left">
                <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">TIRUPATI, AP</p>
                <p className="text-[9px] text-slate-400">Premium livestock fulfillment.</p>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="flex flex-col space-y-2 items-center md:items-start">
              <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Channels</h3>
              <div className="flex flex-col space-y-2">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 group">
                  <div className="p-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MessageCircle size={12} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 group-hover:text-black transition-colors">+91 {WHATSAPP_NUMBER.slice(2, 7)} {WHATSAPP_NUMBER.slice(7)}</span>
                </a>
                <a href={`mailto:${BUSINESS_INFO.email}`} className="flex items-center space-x-2 group">
                  <div className="p-1.5 bg-sky-50 border border-sky-100 text-sky-600 rounded-sm group-hover:bg-sky-600 group-hover:text-white transition-all">
                    <Mail size={12} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 group-hover:text-black transition-colors">{BUSINESS_INFO.email}</span>
                </a>
              </div>
            </div>

            {/* Social handles */}
            <div className="flex flex-col space-y-2 items-center md:items-start">
              <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Social</h3>
              <div className="flex flex-col space-y-2">
                <a href={BUSINESS_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 group">
                  <div className="p-2 bg-pink-50 border border-pink-100 text-[#E4405F] group-hover:bg-[#E4405F] group-hover:text-white transition-all rounded-sm">
                    <Instagram size={12} />
                  </div>
                  <span className="text-[10px] font-black text-slate-700 group-hover:text-black transition-colors uppercase tracking-widest">mvs_aqua</span>
                </a>
                <a href={BUSINESS_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                  <div className="p-2 bg-red-50 border border-red-100 text-[#FF0000] group-hover:bg-[#FF0000] group-hover:text-white transition-all rounded-sm">
                    <Youtube size={12} />
                  </div>
                  <span className="text-[10px] font-black text-slate-700 group-hover:text-black transition-colors uppercase tracking-widest">MVS Aqua</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-3 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <span>MONDAY ORDER</span>
              <span className="h-0.5 w-0.5 bg-slate-300 rounded-full" />
              <span>DOA: 45% REFUND</span>
              <span className="h-0.5 w-0.5 bg-slate-300 rounded-full" />
              <span>PREPAID ONLY</span>
            </div>
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MVS AQUA
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
