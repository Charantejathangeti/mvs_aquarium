
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Loader2, Lock, User, Terminal, Activity, ShieldCheck, Heart, Fish } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../constants';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
        setIsSuccess(true);
        sessionStorage.setItem('mvs_aqua_admin', '1');
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      } else {
        setError('CRITICAL: Access Token Invalid. Permission Denied.');
        setIsLoading(false);
      }
    }, 1500);
  };

  // Multi-color palette for Valentine elements
  const colors = [
    'text-pink-400 fill-pink-100',
    'text-cyan-400 fill-cyan-100',
    'text-rose-500 fill-rose-100',
    'text-amber-400 fill-amber-100',
    'text-indigo-400 fill-indigo-100'
  ];

  const HeartFish = ({ className, delay, colorIdx }: { className: string; delay: string; colorIdx: number }) => (
    <div className={`absolute pointer-events-none ${className}`} style={{ animationDelay: delay }}>
      <div className="relative group scale-75 md:scale-100">
        <Heart size={32} className={`${colors[colorIdx]} transition-colors duration-500`} />
        <div className={`absolute right-[-6px] top-1/2 -translate-y-1/2 w-4 h-5 ${colors[colorIdx].split(' ')[0].replace('text', 'bg').replace('400', '200').replace('500', '200')} rounded-l-full rotate-[15deg] opacity-40 animate-pulse`} />
      </div>
    </div>
  );

  const SmallFish = ({ className, delay, colorIdx }: { className: string; delay: string; colorIdx: number }) => (
    <div className={`absolute pointer-events-none animate-swim-fast ${className}`} style={{ animationDelay: delay }}>
      <Fish size={16} className={`${colors[colorIdx].split(' ')[0]} opacity-40`} />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white relative overflow-hidden font-sans">
      {/* Valentine Aqua Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Ambient Color Washes */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-sky-100/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-pink-50/40 rounded-full blur-[150px] animate-float" style={{ animationDelay: '-5s' }} />

        {/* Diverse Heart Fishes */}
        <HeartFish className="top-[15%] left-[10%] animate-drift-slow" delay="0s" colorIdx={0} />
        <HeartFish className="top-[25%] left-[85%] animate-drift-slow" delay="2s" colorIdx={1} />
        <HeartFish className="top-[65%] left-[12%] animate-drift-slow" delay="4s" colorIdx={2} />
        <HeartFish className="top-[85%] left-[75%] animate-drift-slow" delay="1s" colorIdx={3} />
        <HeartFish className="top-[5%] left-[45%] animate-drift-slow" delay="6s" colorIdx={4} />

        {/* Small Darting Fishes */}
        <SmallFish className="top-[40%] left-[20%]" delay="0.5s" colorIdx={1} />
        <SmallFish className="top-[20%] left-[70%]" delay="2.5s" colorIdx={0} />
        <SmallFish className="top-[75%] left-[40%]" delay="4.5s" colorIdx={2} />
        <SmallFish className="top-[60%] left-[80%]" delay="1.5s" colorIdx={3} />
        <SmallFish className="top-[10%] left-[30%]" delay="3.5s" colorIdx={4} />

        {/* Rising Bubbles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-sky-400/10 rounded-full blur-[1px] animate-bubble-path"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-xl relative z-10 animate-fade-in-up">
        {/* Branding Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-4 mb-6 px-6 py-2 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
            <Terminal size={14} className="text-cyan-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Secure Uplink Protocol v4.0</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-[2.5rem] bg-cyan-500 flex items-center justify-center text-white font-black shadow-2xl shadow-cyan-500/30 text-4xl mb-6 transform hover:scale-105 transition-transform cursor-default relative group">
              M
              <Heart size={16} className="absolute -top-1 -right-1 text-pink-500 fill-pink-500 group-hover:scale-125 transition-transform" />
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
              ADMIN <span className="text-cyan-600">AUTH.</span>
            </h1>
            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Activity size={14} className="text-cyan-500 animate-pulse" />
              Valentine Operational Mode
            </div>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-slate-100 rounded-[4rem] p-12 lg:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden">
          {/* Subtle Scanning Beam */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-scan" />
          
          {isSuccess ? (
            <div className="py-14 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                <ShieldCheck size={52} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Identity Authorized</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Synchronizing Registry Access...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-12">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">
                  Staff Credential
                </label>
                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors">
                    <User size={22} />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    className="w-full pl-20 pr-10 py-7 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-black text-xl focus:outline-none focus:ring-8 focus:ring-cyan-500/5 focus:border-cyan-500/30 transition-all placeholder:text-slate-200"
                    placeholder="OPERATOR_ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">
                  Passkey Phrase
                </label>
                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors">
                    <Lock size={22} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-20 pr-10 py-7 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-black text-xl focus:outline-none focus:ring-8 focus:ring-cyan-500/5 focus:border-cyan-500/30 transition-all placeholder:text-slate-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-7 rounded-3xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest flex items-center space-x-5 animate-shake">
                  <ShieldAlert size={24} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-8 bg-slate-900 hover:bg-cyan-600 disabled:opacity-50 text-white font-black rounded-[2.5rem] flex items-center justify-center space-x-5 transition-all shadow-2xl shadow-slate-900/10 transform active:scale-[0.97] group/btn"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  <>
                    <span className="text-sm uppercase tracking-[0.4em]">Establish Secure Link</span>
                    <Heart size={18} className="text-pink-500 fill-pink-500 group-hover/btn:scale-125 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-4 text-slate-400 hover:text-slate-900 transition-all text-[11px] font-black uppercase tracking-[0.4em] py-3 px-10 rounded-full border border-slate-100 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            <span>Terminate Session</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-50px); opacity: 0; }
          50% { opacity: 1; }
          to { transform: translateY(500px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 5s linear infinite;
        }
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -20px) rotate(8deg); }
          66% { transform: translate(-20px, 40px) rotate(-8deg); }
        }
        .animate-drift-slow {
          animation: drift-slow 15s ease-in-out infinite;
        }
        @keyframes bubble-path {
          0% { transform: translateY(110vh) translateX(0) scale(0); opacity: 0; }
          20% { opacity: 0.4; }
          50% { transform: translateY(50vh) translateX(20px) scale(1); }
          100% { transform: translateY(-100px) translateX(-10px) scale(1.2); opacity: 0; }
        }
        .animate-bubble-path {
          animation: bubble-path infinite linear;
        }
        @keyframes swim-fast {
          0% { transform: translateX(-100vw) rotate(0deg); }
          50% { transform: translateX(50vw) translateY(-20px) rotate(10deg); }
          100% { transform: translateX(100vw) rotate(0deg); }
        }
        .animate-swim-fast {
          animation: swim-fast 20s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite alternate;
          animation-iteration-count: 2;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
