
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Home, Package, Info, Mail, LogOut, Menu, X, MessageCircle } from 'lucide-react';
import { COLORS, BUSINESS_INFO, WHATSAPP_NUMBER } from '../constants';

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
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Shop', path: '/shop', icon: <Package size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] flex items-center justify-center text-white font-black shadow-lg shadow-sky-500/20">M</div>
                <span className="text-xl font-black tracking-tight text-slate-900">MVS <span className="text-[#0ea5e9]">Aqua</span></span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 hover:text-[#0ea5e9] font-bold text-xs transition-all ${
                    location.pathname === link.path ? 'text-[#0ea5e9]' : 'text-slate-500'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="h-4 w-px bg-slate-200" />
              
              <Link to="/cart" className="relative p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl transition-all flex items-center space-x-2 border border-slate-100">
                <ShoppingCart size={18} />
                <span className="font-bold text-sm">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-[#0ea5e9] text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAdmin ? (
                <div className="flex items-center space-x-4">
                  <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-[#0ea5e9] hover:text-sky-700">Console</Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/admin-login" className="p-2 text-slate-400 hover:text-[#0ea5e9] transition-colors">
                  <User size={20} />
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center space-x-3">
              <Link to="/cart" className="relative p-2 bg-[#0ea5e9] text-white rounded-lg shadow-lg shadow-sky-500/20">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 focus:outline-none">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 py-6 px-4 space-y-4 shadow-2xl animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-4 text-lg font-black text-slate-900"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <hr className="border-slate-50" />
            <Link
              to="/admin-login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-4 text-lg font-black text-slate-400"
            >
              <User size={18} />
              <span>{isAdmin ? 'Admin Dashboard' : 'Staff Portal'}</span>
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-950 border-t border-sky-500/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand Minimal */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all">
              <div className="w-7 h-7 rounded-lg bg-[#0ea5e9]/20 border border-sky-500/20 flex items-center justify-center text-sky-500 font-black text-xs">M</div>
              <span className="text-sm font-black tracking-tight text-white">MVS <span className="text-[#0ea5e9]">Aqua</span></span>
            </Link>
            <div className="hidden lg:block h-3 w-px bg-slate-800" />
            <span className="hidden lg:block text-[9px] font-black uppercase text-slate-500 tracking-[0.3em]">Exotic Logistics</span>
          </div>
          
          {/* Navigation Bar Style */}
          <div className="flex items-center flex-wrap justify-center gap-x-8 gap-y-2">
            {[
              { label: 'Catalog', path: '/shop' },
              { label: 'Tracking', path: '/tracking' },
              { label: 'About', path: '/about' },
              { label: 'Support', path: '/contact' }
            ].map(link => (
              <Link 
                key={link.label} 
                to={link.path} 
                className="text-[10px] font-black uppercase text-slate-500 hover:text-sky-400 tracking-[0.2em] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social & Legal */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
               <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-slate-500 hover:text-emerald-500 transition-colors">
                  <MessageCircle size={16} />
               </a>
               <a href={`mailto:${BUSINESS_INFO.email}`} className="text-slate-500 hover:text-sky-500 transition-colors">
                  <Mail size={16} />
               </a>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">&copy; {new Date().getFullYear()}</span>
               <span className="text-[8px] font-black text-sky-900 uppercase tracking-[0.2em]">Tirupati HQ</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Layout;
