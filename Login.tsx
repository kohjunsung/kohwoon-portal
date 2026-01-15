import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { User } from './types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API Call
    setTimeout(() => {
      // Master Admin Account
      if (id === 'kwad@kohwoonc.com' && password === 'rhdns12!') {
        onLogin({
          id: 'master-admin',
          name: '관리자(Master)',
          clinicName: 'Kohwoon Ad HQ',
          role: 'admin',
          email: id
        });
      } 
      // Standard Admin (Read-only for sensitive settings) - Optional/Legacy
      else if (id === 'admin@kohwoonc.com' && password === 'admin1234') {
        onLogin({
          id: 'admin1',
          name: '일반 관리자',
          clinicName: 'Kohwoon Ad HQ',
          role: 'admin',
          email: id
        });
      }
      // Client User
      else if (id === 'doc@gowoon.com' && password === 'user1234') {
        onLogin({
          id: 'u1',
          name: '김원장',
          clinicName: '고운 성형외과',
          role: 'user',
          email: id
        });
      } else {
        setError('아이디 또는 비밀번호를 확인해주세요.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-white">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
             <img 
               src="/logo.png" 
               alt="Kohwoon Ad" 
               className="h-20 w-auto object-contain"
               onError={(e) => {
                   // Fallback
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextElementSibling?.classList.remove('hidden');
               }}
             />
             <div className="hidden inline-flex items-center justify-center w-16 h-16 bg-black rounded-none">
                 <span className="font-bold text-2xl text-white">K</span>
             </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kohwoon Ad</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">파트너 포털 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">아이디 (이메일)</label>
            <input 
              type="text" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm font-medium"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm font-medium"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-xl shadow-gray-200"
          >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                <span>로그인</span>
                <ArrowRight size={18} />
                </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
            <p className="text-xs text-gray-400">계정 문의: <a href="mailto:admin@kohwoonc.com" className="underline">admin@kohwoonc.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;