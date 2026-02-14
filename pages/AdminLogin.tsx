
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShieldAlert, ArrowLeft, Loader2, Lock, ChevronRight, User, Eye, EyeOff } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../constants';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        setError('Verification Failed: Access Denied.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Hub</span>
          </Link>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">MVS Console v2.5</span>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-sm p-12 shadow-2xl relative">
          <div className="text-center mb-12">
            <div className="w-14 h-14 bg-sky-500 text-white flex items-center justify-center mx-auto mb-6 rounded-sm shadow-[0_0_30px_rgba(14,165,233,0.3)]">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Admin Authorization</h1>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-3">Identity Verification Protocol Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <User size={12} className="text-sky-500" />
                Registry ID
              </label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-slate-900 border border-white/5 rounded-sm text-white font-bold focus:outline-none focus:border-sky-500 transition-all text-sm placeholder:text-slate-700"
                placeholder="ADMIN_USER"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Lock size={12} className="text-sky-500" />
                Encryption Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-5 py-4 bg-slate-900 border border-white/5 rounded-sm text-white font-bold focus:outline-none focus:border-sky-500 transition-all text-sm placeholder:text-slate-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-sky-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 text-red-400 text-[10px] font-black flex items-center gap-3 rounded-sm border border-red-500/20 uppercase tracking-widest animate-shake">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-sky-500 hover:bg-sky-400 text-slate-900 font-black text-xs uppercase tracking-[0.4em] rounded-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Unlock Console</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.5em]">MVS AQUA HUB · TIRUPATI LOGISTICS</p>
        </div>
      </div>

      <style>{`
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
