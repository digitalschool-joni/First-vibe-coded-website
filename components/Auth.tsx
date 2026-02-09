import React, { useState } from 'react';
import { login } from '../services/mockDb';
import { User, UserRole } from '../types';
import { SparklesIcon } from './Icons';

interface Props {
  onLogin: (user: User) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');

    try {
      const user = await login(email);
      onLogin(user);
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-900/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-dark-800 border border-dark-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
           <div className="bg-brand-600 p-3 rounded-xl inline-flex mb-4 shadow-lg shadow-brand-900/30">
             <SparklesIcon className="w-8 h-8 text-white" />
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">OpportunityBridge</h1>
           <p className="text-gray-400">Connect with your future.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
             <input 
               type="email" 
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
               placeholder="name@example.com"
             />
           </div>

           {error && (
             <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{error}</p>
           )}

           <button 
             type="submit"
             disabled={isLoading}
             className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isLoading ? 'Authenticating...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
           </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-brand-400 font-medium hover:underline">
               {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
          <div className="mt-4 pt-4 border-t border-dark-700 text-xs text-left space-y-1">
            <p className="font-semibold text-gray-400 mb-2">Demo accounts:</p>
            <p className="flex justify-between"><span>Seeker:</span> <code className="bg-dark-900 px-1 rounded">user@example.com</code></p>
            <p className="flex justify-between"><span>Company:</span> <code className="bg-dark-900 px-1 rounded">company@example.com</code></p>
            <p className="flex justify-between"><span>Admin:</span> <code className="bg-dark-900 px-1 rounded">admin@example.com</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
