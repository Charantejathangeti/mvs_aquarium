
import React from 'react';
/* Import from react-router instead of react-router-dom to fix missing export errors in v7 environments */
import { Link, useNavigate, useLocation } from 'react-router';
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

      {/* Reduced & Compact Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Minimal Branding */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-black flex items-center justify-center text-white font-black rounded-sm text-[10px]">M</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-black uppercase tracking-tighter">MVS AQUA</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Tirupati Registry</span>
              </div>
            </div>

            {/* Combined compact links */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                  <MessageCircle size={14} />
                </a>
                <a href={`mailto:${BUSINESS_INFO.email}`} className="text-sky-600 hover:text-sky-700 transition-colors">
                  <Mail size={14} />
                </a>
                <a href={BUSINESS_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 transition-colors">
                  <Instagram size={14} />
                </a>
                <a href={BUSINESS_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 transition-colors">
                  <Youtube size={14} />
                </a>
              </div>
              <div className="h-3 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <span className="hidden sm:inline">Prepaid Only</span>
                <span className="hidden sm:inline">•</span>
                <span>Monday Dispatch Protocol</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">DOA Coverage</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MVS AQUA
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
