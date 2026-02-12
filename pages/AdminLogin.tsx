
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Loader2, Lock, User } from 'lucide-react';
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
        setError('Unauthorized credentials. Please check your access key.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-50 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#0ea5e9] flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform shadow-lg shadow-sky-500/20 text-xl">M</div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">MVS <span className="text-[#0ea5e9]">Aqua</span></span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Staff Portal</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure Logistics Access</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label htmlFor="username" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">
                Operator ID
              </label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0ea5e9] transition-colors">
                  <User size={22} />
                </span>
                <input
                  id="username"
                  type="text"
                  required
                  autoFocus
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-[#0ea5e9] transition-all"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">
                Auth Token
              </label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0ea5e9] transition-colors">
                  <Lock size={22} />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-[#0ea5e9] transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest flex items-center space-x-3">
                <ShieldAlert size={20} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-slate-900 hover:bg-[#0ea5e9] disabled:opacity-70 text-white font-black rounded-[2rem] flex items-center justify-center space-x-4 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Authorizing...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">Gain Access</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 text-slate-400 hover:text-slate-900 transition-colors text-xs font-black uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} />
            <span>Store Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
