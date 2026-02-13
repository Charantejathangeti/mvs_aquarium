
import React, { useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Home, Package, Info, Mail, LogOut, Menu, X, MessageCircle, Fish, Heart, Anchor, Sparkles } from 'lucide-react';
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
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Shop', path: '/shop', icon: <Package size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  // Highly vibrant color palette
  const neonColors = [
    { text: 'text-cyan-500', fill: 'fill-cyan-100', bg: 'bg-cyan-500', shadow: 'shadow-cyan-500/40' },
    { text: 'text-pink-500', fill: 'fill-pink-100', bg: 'bg-pink-500', shadow: 'shadow-pink-500/40' },
    { text: 'text-amber-500', fill: 'fill-amber-100', bg: 'bg-amber-500', shadow: 'shadow-amber-500/40' },
    { text: 'text-emerald-500', fill: 'fill-emerald-100', bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/40' },
    { text: 'text-indigo-500', fill: 'fill-indigo-100', bg: 'bg-indigo-500', shadow: 'shadow-indigo-500/40' },
    { text: 'text-rose-500', fill: 'fill-rose-100', bg: 'bg-rose-500', shadow: 'shadow-rose-500/40' },
    { text: 'text-orange-500', fill: 'fill-orange-100', bg: 'bg-orange-500', shadow: 'shadow-orange-500/40' },
  ];

  // Memoized background elements
  const aquaElements = useMemo(() => {
    // Schools of neon fish (Standard)
    const schools = Array.from({ length: 4 }).map((_, sIdx) => {
      const baseTop = 20 + Math.random() * 60;
      const baseDelay = Math.random() * 10;
      const color = neonColors[sIdx % neonColors.length];
      return Array.from({ length: 3 }).map((_, i) => ({
        top: `${baseTop + (i * 4)}%`,
        delay: `${baseDelay + (i * 0.5)}s`,
        duration: `${18 + Math.random() * 7}s`,
        color: color.text,
        size: 14 + Math.random() * 6,
        type: 'neon'
      }));
    }).flat();

    // Fast-darting ZigZag fish
    const zigzags = Array.from({ length: 5 }).map((_, i) => ({
      top: `${Math.random() * 90}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${12 + Math.random() * 8}s`,
      color: neonColors[(i + 2) % neonColors.length].text,
      size: 10 + Math.random() * 5
    }));

    // Majestic Heart Specimens
    const heartFish = Array.from({ length: 4 }).map((_, i) => ({
      top: `${Math.random() * 70 + 15}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${25 + Math.random() * 10}s`,
      color: neonColors[(i + 4) % neonColors.length],
      size: 28 + Math.random() * 12
    }));

    // Bubbles
    const bubbles = Array.from({ length: 20 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 15 + 4}px`,
      delay: `${Math.random() * 20}s`,
      duration: `${8 + Math.random() * 10}s`
    }));

    // Swaying Plants (Bottom)
    const plants = Array.from({ length: 15 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      height: `${Math.random() * 100 + 50}px`,
      delay: `${Math.random() * 5}s`,
      color: i % 2 === 0 ? 'bg-emerald-400/20' : 'bg-cyan-400/15'
    }));

    return { schools, zigzags, heartFish, bubbles, plants };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Dynamic Aquarium Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        
        {/* Ambient Vibrant Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-sky-100/40 rounded-full blur-[120px] animate-float opacity-60" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-pink-50/50 rounded-full blur-[140px] animate-float opacity-50" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-amber-50/40 rounded-full blur-[100px] animate-float opacity-40" style={{ animationDelay: '-10s' }} />

        {/* Bottom Plants (Swaying) */}
        <div className="absolute bottom-0 left-0 w-full h-32 flex items-end justify-around px-10">
          {aquaElements.plants.map((p, i) => (
            <div 
              key={`plant-${i}`}
              className={`w-3 ${p.color} rounded-t-full animate-sway blur-[1px]`}
              style={{ 
                height: p.height, 
                left: p.left,
                animationDelay: p.delay
              }}
            />
          ))}
        </div>

        {/* Standard Schools of Neon Fish */}
        {aquaElements.schools.map((f, i) => (
          <div 
            key={`school-${i}`}
            className={`absolute animate-swim-standard ${f.color} opacity-0`}
            style={{ 
              top: f.top,
              animationDelay: f.delay,
              animationDuration: f.duration
            }}
          >
            <Fish size={f.size} className="transform scale-x-[-1] drop-shadow-[0_0_8px_currentColor]" />
          </div>
        ))}

        {/* Fast ZigZag Fish */}
        {aquaElements.zigzags.map((f, i) => (
          <div 
            key={`zigzag-${i}`}
            className={`absolute animate-swim-zigzag ${f.color} opacity-0`}
            style={{ 
              top: f.top,
              animationDelay: f.delay,
              animationDuration: f.duration
            }}
          >
            <Fish size={f.size} className="transform scale-x-[-1] drop-shadow-[0_0_12px_currentColor]" />
          </div>
        ))}

        {/* Majestic Heart Specimens */}
        {aquaElements.heartFish.map((hf, i) => (
          <div 
            key={`hfish-${i}`}
            className={`absolute animate-swim-standard opacity-0 ${hf.color.text}`}
            style={{ 
              top: hf.top,
              animationDelay: hf.delay,
              animationDuration: hf.duration
            }}
          >
            <div className="relative group animate-pulse-vibrant">
              <Heart size={hf.size} className={`fill-current opacity-40`} />
              <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-[30%] h-[40%] rounded-l-full bg-current opacity-30 rotate-[15deg] animate-pulse`} />
              <Sparkles size={hf.size/3} className="absolute -top-1 -right-1 text-white opacity-60 animate-bounce" />
            </div>
          </div>
        ))}

        {/* Bubbles */}
        {aquaElements.bubbles.map((b, i) => (
          <div 
            key={`bubble-${i}`} 
            className="absolute bg-sky-400/10 rounded-full border border-sky-200/20 backdrop-blur-[1px] animate-bubble-organic" 
            style={{ 
              left: b.left, 
              width: b.size, 
              height: b.size, 
              animationDelay: b.delay,
              animationDuration: b.duration
            }} 
          />
        ))}
      </div>

      {/* Main Content Interface */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] flex items-center justify-center text-white font-black shadow-lg shadow-sky-500/20 group-hover:rotate-12 transition-transform">M</div>
                <span className="text-xl font-black tracking-tight text-slate-900">MVS <span className="text-[#0ea5e9]">Aqua</span></span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 hover:text-[#0ea5e9] font-bold text-xs transition-all tracking-widest uppercase ${
                    location.pathname === link.path ? 'text-[#0ea5e9]' : 'text-slate-500'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="h-4 w-px bg-slate-200" />
              
              <Link to="/cart" className="relative p-2.5 bg-white/50 hover:bg-white text-slate-900 rounded-xl transition-all flex items-center space-x-2 border border-slate-100 group shadow-sm">
                <ShoppingCart size={18} className="group-hover:text-[#0ea5e9] transition-colors" />
                <span className="font-black text-xs uppercase tracking-widest">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#0ea5e9] text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-fade-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAdmin ? (
                <div className="flex items-center space-x-4">
                  <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-[#0ea5e9] hover:text-sky-700 bg-sky-50 px-4 py-2 rounded-xl">Console</Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/admin-login" className="p-2 text-slate-400 hover:text-[#0ea5e9] transition-colors bg-slate-50 rounded-xl border border-slate-100">
                  <User size={20} />
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center space-x-3">
              <Link to="/cart" className="relative p-2.5 bg-[#0ea5e9] text-white rounded-xl shadow-lg shadow-sky-500/30">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[8px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 focus:outline-none p-2 bg-slate-50 rounded-xl border border-slate-100">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-3xl border-b border-slate-100 py-8 px-6 space-y-6 shadow-2xl animate-fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-5 text-xl font-black text-slate-900 tracking-tight"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#0ea5e9]">{link.icon}</div>
                <span>{link.name}</span>
              </Link>
            ))}
            <hr className="border-slate-100" />
            <Link
              to="/admin-login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-5 text-xl font-black text-slate-400 tracking-tight"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><User size={20} /></div>
              <span>{isAdmin ? 'Management Console' : 'Operator Login'}</span>
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-grow relative z-10">
        {children}
      </main>

      <footer className="relative z-10 bg-slate-950/95 backdrop-blur-2xl border-t border-sky-500/10 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          
          <div className="flex items-center space-x-5">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#0ea5e9] flex items-center justify-center text-white font-black text-lg">M</div>
              <span className="text-xl font-black tracking-tight text-white">MVS <span className="text-[#0ea5e9]">Aqua</span></span>
            </Link>
            <div className="hidden lg:block h-6 w-px bg-slate-800" />
            <span className="hidden lg:block text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Livestock Hub India</span>
          </div>
          
          <div className="flex items-center flex-wrap justify-center gap-x-12 gap-y-4">
            {[
              { label: 'Market', path: '/shop' },
              { label: 'Dispatch', path: '/tracking' },
              { label: 'Registry', path: '/about' },
              { label: 'Contact', path: '/contact' }
            ].map(link => (
              <Link 
                key={link.label} 
                to={link.path} 
                className="text-[11px] font-black uppercase text-slate-500 hover:text-sky-400 tracking-[0.25em] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-6">
               <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-slate-500 hover:text-emerald-500 transition-all hover:scale-110">
                  <MessageCircle size={22} />
               </a>
               <a href={`mailto:${BUSINESS_INFO.email}`} className="text-slate-500 hover:text-sky-500 transition-all hover:scale-110">
                  <Mail size={22} />
               </a>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex flex-col items-end">
               <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">&copy; {new Date().getFullYear()}</span>
               <span className="text-[10px] font-black text-sky-900 uppercase tracking-[0.3em]">Tirupati Operations</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
