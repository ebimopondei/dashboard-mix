
import React, { useState } from 'react';
import { Icon } from './Icon';

interface NotificationSettingsViewProps {
  onBack: () => void;
}

export const NotificationSettingsView: React.FC<NotificationSettingsViewProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
      investmentUpdates: true,
      transactionAlerts: true,
      securityAlerts: true,
      promotionalOffers: false,
      newsletters: true,
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false
  });

  const toggle = (key: keyof typeof settings) => {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
          Notification Preferences
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
         
         {/* Channels */}
         <section>
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 mb-3">Channels</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                {[
                    { key: 'pushNotifications', label: 'Push Notifications', icon: 'notifications' },
                    { key: 'emailNotifications', label: 'Email', icon: 'mail' },
                    { key: 'smsNotifications', label: 'SMS Messages', icon: 'sms' },
                ].map((item, idx) => (
                    <div key={item.key} className={`flex items-center justify-between p-4 ${idx !== 2 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                                <Icon name={item.icon} />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white">{item.label}</span>
                        </div>
                        <div 
                            onClick={() => toggle(item.key as keyof typeof settings)}
                            className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${settings[item.key as keyof typeof settings] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <div className={`size-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${settings[item.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    </div>
                ))}
            </div>
         </section>

         {/* Alerts */}
         <section>
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 mb-3">Alert Types</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                {[
                    { key: 'transactionAlerts', label: 'Transactions', sub: 'Deposits, Withdrawals, Payouts' },
                    { key: 'investmentUpdates', label: 'Investment Updates', sub: 'Maturity, Cycles, Delays' },
                    { key: 'securityAlerts', label: 'Security Alerts', sub: 'Login attempts, Password changes' },
                    { key: 'newsletters', label: 'Market News', sub: 'Weekly digest, Market trends' },
                    { key: 'promotionalOffers', label: 'Promotions', sub: 'New features, Referral bonuses' },
                ].map((item, idx) => (
                    <div key={item.key} className={`flex items-center justify-between p-4 ${idx !== 4 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                         <div>
                            <p className="font-bold text-slate-800 dark:text-white">{item.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.sub}</p>
                         </div>
                         <div 
                            onClick={() => toggle(item.key as keyof typeof settings)}
                            className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${settings[item.key as keyof typeof settings] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <div className={`size-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${settings[item.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    </div>
                ))}
            </div>
         </section>
      </div>
    </div>
  );
};
