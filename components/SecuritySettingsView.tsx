
import React, { useState } from 'react';
import { Icon } from './Icon';

interface SecuritySettingsViewProps {
  onBack: () => void;
}

export const SecuritySettingsView: React.FC<SecuritySettingsViewProps> = ({ onBack }) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Security Settings
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Authentication Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Authentication</h2>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                     <Icon name="password" />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-slate-800 dark:text-white">Change Password</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Last changed 3 months ago</p>
                  </div>
               </div>
               <Icon name="chevron_right" className="text-slate-400" />
            </button>

            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                     <Icon name="fingerprint" />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-slate-800 dark:text-white">Biometric Login</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Use FaceID or TouchID</p>
                  </div>
               </div>
               <div 
                 onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                 className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${biometricsEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
               >
                  <div className={`size-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${biometricsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
               </div>
            </div>

            <div className="flex items-center justify-between p-4">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                     <Icon name="lock" />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-slate-800 dark:text-white">2-Factor Authentication</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Extra layer of security</p>
                  </div>
               </div>
               <div 
                 onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                 className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${twoFactorEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
               >
                  <div className={`size-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
               </div>
            </div>
          </div>
        </section>

        {/* Transactions Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Transactions</h2>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                     <Icon name="dialpad" />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-slate-800 dark:text-white">Transaction PIN</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Required for withdrawals</p>
                  </div>
               </div>
               <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">Set</span>
            </button>
          </div>
        </section>

        {/* Active Sessions */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Active Devices</h2>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon name="smartphone" className="text-slate-400" />
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">iPhone 14 Pro</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">San Francisco, US • Current Session</p>
                    </div>
                </div>
                <div className="size-2 rounded-full bg-emerald-500"></div>
            </div>
            
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon name="laptop" className="text-slate-400" />
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">MacBook Pro</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">San Francisco, US • 2 days ago</p>
                    </div>
                </div>
                <button className="text-rose-500">
                    <Icon name="logout" className="text-lg" />
                </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};