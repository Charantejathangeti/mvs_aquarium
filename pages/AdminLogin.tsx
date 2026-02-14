
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShieldAlert, ArrowLeft, Loader2, Lock, ChevronRight, User } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../constants.ts';

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
        setError('ACCESS DENIED: VERIFICATION FAILED.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-emerald-500 to-sky-500 animate-pulse" />
      
      <div className="w-full max-w-xs z-10 animate-fade-in transition-all duration-700 transform">
        {/* Simple Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-black mb-6 transition-colors group">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          <span>Exit to Terminal</span>
        </Link>

        <div className="bg-white border border-slate-200 rounded-sm p-8 shadow-2xl animate-[slide-up_0.6s_ease-out]">
          <div className="text-center mb-8">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-sm shadow-xl">
              <Lock size={16} />
            </div>
            <h1 className="text-lg font-black text-black uppercase tracking-[0.2em]">ADMIN <span className="text-sky-600">CONSOLE</span></h1>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-1.5">Authorization Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User size={8} />
                OPERATOR ID
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-black font-bold focus:outline-none focus:border-black focus:bg-white transition-all text-[10px]"
                placeholder="UID..."
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Lock size={8} />
                SECURE KEY
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-black font-bold focus:outline-none focus:border-black focus:bg-white transition-all text-[10px]"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-2 bg-red-50 text-red-600 text-[7px] font-black uppercase tracking-widest flex items-center gap-2 rounded-sm border border-red-100 animate-shake">
                <ShieldAlert size={12} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black hover:bg-sky-600 text-white font-black text-[9px] uppercase tracking-[0.3em] rounded-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  <span>LOGIN</span>
                  <ChevronRight size={12} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.5em]">MVS AQUA HUB · TIRUPATI</p>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
