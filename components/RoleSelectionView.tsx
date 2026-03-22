


import React from 'react';
import { Icon } from './Icon';
import { UserRole } from '../types';

interface RoleSelectionViewProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        
        <div>
          <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-primary/10 text-primary mb-6">
            <Icon name="token" className="text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome</h1>
          <p className="text-slate-500 dark:text-slate-400">Choose how you want to use the platform</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onSelectRole('investor')}
            className="w-full group relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-2xl p-6 text-left shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 relative z-10">
                <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                  <Icon name="trending_up" className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Investor</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                  Fund businesses, earn attractive returns, and track your portfolio.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-full p-2 text-slate-400 group-hover:text-primary transition-colors">
                <Icon name="arrow_forward" />
              </div>
            </div>
          </button>

          <button 
            onClick={() => onSelectRole('trader')}
            className="w-full group relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 relative z-10">
                <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                  <Icon name="storefront" className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Trader</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                  Apply for loans, grow your business, and join Esusu savings groups.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-full p-2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                <Icon name="arrow_forward" />
              </div>
            </div>
          </button>

          <button 
            onClick={() => onSelectRole('agent')}
            className="w-full group relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 relative z-10">
                <div className="size-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                  <Icon name="admin_panel_settings" className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Agent</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                  Onboard traders, monitor repayments, and manage field operations.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-full p-2 text-slate-400 group-hover:text-purple-500 transition-colors">
                <Icon name="arrow_forward" />
              </div>
            </div>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};
