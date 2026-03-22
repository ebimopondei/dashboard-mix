

import React, { useState } from 'react';
import { Icon } from './Icon';
import { UserRole } from '../types';

interface LoginViewProps {
  onLogin: () => void;
  onNavigateToSignup: () => void;
  role?: UserRole;
  onChangeRole?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigateToSignup, role = 'investor', onChangeRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock network delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // Mock Google Auth delay
    setTimeout(() => {
        setIsGoogleLoading(false);
        onLogin();
    }, 1500);
  };

  const isTrader = role === 'trader';
  const isAgent = role === 'agent';
  const roleLabel = isAgent ? 'Agent' : isTrader ? 'Trader' : 'Investor';
  const roleIcon = isAgent ? 'admin_panel_settings' : isTrader ? 'storefront' : 'savings';
  const roleColorClass = isAgent ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : isTrader ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-primary/10 text-primary';
  const buttonColorClass = isAgent ? 'bg-purple-600 shadow-purple-500/30 hover:bg-purple-700' : isTrader ? 'bg-emerald-600 shadow-emerald-500/30 hover:bg-emerald-700' : 'bg-primary shadow-primary/30 hover:bg-primary/90';
  const linkColorClass = isAgent ? 'text-purple-500' : isTrader ? 'text-emerald-500' : 'text-primary';

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-8 text-center">
            {onChangeRole && (
                <button onClick={onChangeRole} className="text-xs text-slate-400 hover:text-primary mb-4 flex items-center justify-center gap-1 mx-auto">
                    <Icon name="arrow_back" className="text-sm" /> Switch Role
                </button>
            )}
          <div className={`inline-flex items-center justify-center size-16 rounded-2xl mb-6 ${roleColorClass}`}>
            <Icon name={roleIcon} className="text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {roleLabel} Login
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isAgent ? 'Manage your traders and reports' : isTrader ? 'Access your loans and savings' : 'Sign in to manage your portfolio'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="mail" className="text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="lock" className="text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} />
              </button>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-primary hover:text-primary/80">
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${buttonColorClass}`}
          >
            {isLoading ? (
              <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <Icon name="arrow_forward" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background-light dark:bg-background-dark text-slate-500 font-bold">Or continue with</span>
            </div>
        </div>

        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isGoogleLoading ? (
                <span className="size-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
                <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                </>
            )}
        </button>

        <div className="mt-auto text-center pt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <button 
              onClick={onNavigateToSignup}
              className={`font-bold hover:underline ${linkColorClass}`}
            >
              Register as {roleLabel}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
