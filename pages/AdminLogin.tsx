
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Loader2, Lock, Fish, ChevronRight } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../constants';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('mvs_aqua_admin') === '1') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.user && password === ADMIN_CREDENTIALS.pass) {
        sessionStorage.setItem('mvs_aqua_admin', '1');
        navigate('/admin');
      } else {
        setError('Verification failed. Invalid credentials.');
        setIsLoading(false);
      }
    }, 1200);
  };

  // Generate dynamic fish elements with varying behaviors
  const fishes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    bottom: `${-10 - Math.random() * 20}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: 20 + Math.random() * 30,
    opacity: 0.1 + Math.random() * 0.3,
    type: i % 3 === 0 ? 'jump' : 'swim',
    flip: Math.random() > 0.5,
  }));

  return (
    <div className="relative min-h-screen bg-sky-50 flex items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Aquatic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {fishes.map((fish) => (
          <div
            key={fish.id}
            className={`absolute ${fish.type === 'jump' ? 'animate-fish-jump' : 'animate-fish-swim'}`}
            style={{
              left: fish.left,
              bottom: fish.bottom,
              animationDelay: fish.delay,
              animationDuration: fish.duration,
              opacity: fish.opacity,
              transform: fish.flip ? 'scaleX(-1)' : 'none',
            }}
          >
            <Fish size={fish.size} className="text-sky-400 fill-sky-200" />
          </div>
        ))}
        {/* Subtle water surface effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-60" />
      </div>

      {/* Login Card - High Contrast & Professional */}
      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-sm p-8 shadow-2xl shadow-sky-900/10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-sm shadow-lg">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-black text-black uppercase tracking-widest">Operator Portal</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">MVS Aqua Enterprise Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Identity UID</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-black font-bold focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 text-xs transition-all"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Access Code</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-black font-bold focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 text-xs transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-sm border border-red-100 animate-shake">
                <ShieldAlert size={12} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black hover:bg-sky-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <span>Initialize Session</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-slate-100" />
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">End-to-End Encrypted</span>
            <div className="h-px w-8 bg-slate-100" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-slate-400 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Stocklist</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fish-jump {
          0% { transform: translateY(0) rotate(0deg); bottom: -10%; }
          30% { transform: translateY(-300px) rotate(-45deg); bottom: 40%; }
          60% { transform: translateY(-300px) rotate(45deg); bottom: 40%; }
          100% { transform: translateY(0) rotate(180deg); bottom: -10%; }
        }
        @keyframes fish-swim {
          0% { transform: translateX(-100px) translateY(0); }
          50% { transform: translateX(100px) translateY(-20px); }
          100% { transform: translateX(-100px) translateY(0); }
        }
        .animate-fish-jump {
          animation: fish-jump linear infinite;
        }
        .animate-fish-swim {
          animation: fish-swim ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
