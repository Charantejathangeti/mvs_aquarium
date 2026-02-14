
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
        setError('Access Denied: Verification Failed.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-emerald-500 to-sky-500 animate-pulse" />
      
      <div className="w-full max-w-sm z-10 animate-fade-in transition-all duration-700 transform">
        {/* Simple Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Store</span>
        </Link>

        <div className="bg-white border border-slate-200 rounded-lg p-10 shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center mx-auto mb-6 rounded-lg shadow-xl">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 uppercase tracking-widest">Admin Access</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <User size={12} className="text-sky-500" />
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-bold focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm"
                placeholder="Enter ID"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Lock size={12} className="text-sky-500" />
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-bold focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold flex items-center gap-3 rounded-md border border-red-100 animate-shake">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 hover:bg-sky-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Login to Console</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">MVS Aqua · Tirupati Hub</p>
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
