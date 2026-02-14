
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShieldAlert, ArrowLeft, Loader2, Lock, ChevronRight, User, Eye, EyeOff, Globe } from 'lucide-react';
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

    // Brief artificial delay for "Tactical" feel
    setTimeout(() => {
      const normalizedInputUser = username.trim();
      const normalizedInputPass = password.trim();

      if (normalizedInputUser === ADMIN_CREDENTIALS.user && normalizedInputPass === ADMIN_CREDENTIALS.pass) {
        sessionStorage.setItem('mvs_aqua_admin', '1');
        navigate('/admin');
      } else {
        setError('Authentication Failed: Invalid Credentials Provided.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm z-10 animate-fade-in">
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Storefront</span>
          </Link>
          <div className="flex items-center gap-2">
            <Globe size={10} className="text-slate-300" />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Secure Auth v2.5</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-10 shadow-sm rounded-sm">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-6">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Admin Access</h1>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.4em] mt-3">Personnel Identity Verification</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identifier</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 font-bold focus:outline-none focus:border-cyan-600 transition-all text-xs placeholder:text-slate-300 uppercase"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secret Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 font-bold focus:outline-none focus:border-cyan-600 transition-all text-xs placeholder:text-slate-300"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-cyan-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-[9px] font-black flex items-center gap-3 border border-red-100 uppercase tracking-widest animate-fade-in">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 hover:bg-cyan-600 text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-slate-200"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Unlock Hub</span>
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-12 text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.6em]">
          MVS AQUA · Tirupati Hub · Protected Endpoint
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
