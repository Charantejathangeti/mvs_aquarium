
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { ShoppingCart, User, LogOut, Menu, X, MessageCircle, Mail, Instagram, Youtube, Globe } from 'lucide-react';
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
                <Link to="/admin" className="p-1.5 text-sky-600 hover:text-sky-700">
                  <User size={18} />
                </Link>
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

      <footer className="bg-white border-t border-slate-100 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black rounded-sm text-[11px]">M</div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-black uppercase tracking-tighter leading-none">MVS AQUA HUB</span>
                <div className="flex items-center gap-2 mt-1.5">
                   <Globe 
                    size={10} 
                    className={`${
                      cloudStatus === 'online' ? 'text-emerald-500' : 
                      cloudStatus === 'syncing' ? 'text-sky-500 animate-spin' : 
                      'text-red-500'
                    }`} 
                   />
                   <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest leading-none">
                     {cloudStatus === 'online' ? `GLOBAL SYNC: ${lastSync}` : cloudStatus === 'syncing' ? 'REFRESHING MASTER STOCK...' : 'REGISTRY DISCONNECTED'}
                   </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:scale-110 transition-transform"><MessageCircle size={16} /></a>
                <a href={`mailto:${BUSINESS_INFO.email}`} className="text-sky-600 hover:scale-110 transition-transform"><Mail size={16} /></a>
                <a href={BUSINESS_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:scale-110 transition-transform"><Instagram size={16} /></a>
                <a href={BUSINESS_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:scale-110 transition-transform"><Youtube size={16} /></a>
              </div>
              <div className="h-4 w-px bg-slate-100 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                <span className="bg-slate-50 px-2 py-0.5 border border-slate-100">PREPAID ONLY</span>
                <span>•</span>
                <span className="bg-slate-50 px-2 py-0.5 border border-slate-100">DOA COVERAGE</span>
              </div>
            </div>

            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MVS GLOBAL REGISTRY NODE
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
