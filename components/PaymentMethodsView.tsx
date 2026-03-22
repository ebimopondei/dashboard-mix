
import React, { useState } from 'react';
import { Icon } from './Icon';
import { MOCK_PAYMENT_METHODS } from '../constants';
import { LinkAccountModal } from './LinkAccountModal';
import { PaymentMethod } from '../types';

interface PaymentMethodsViewProps {
  onBack: () => void;
}

export const PaymentMethodsView: React.FC<PaymentMethodsViewProps> = ({ onBack }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);

  const handleLinkSuccess = () => {
    // In a real app, the new method would come from the API response
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'bank',
      name: 'Chase Checking', // Mocked
      mask: '**** 9988',
      status: 'active',
      icon: 'account_balance'
    };
    setMethods([...methods, newMethod]);
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
          Payment Methods
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Manage your linked bank accounts and cards for deposits and withdrawals.
          </p>
          
          <div className="flex flex-col gap-3">
            {methods.map((method) => (
              <div key={method.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                 <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <Icon name={method.icon} />
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-slate-800 dark:text-white">{method.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{method.mask}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    {method.status === 'active' ? (
                       <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">Active</span>
                    ) : (
                       <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full">Issue</span>
                    )}
                    <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                        <Icon name="delete" />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setIsLinkModalOpen(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2"
        >
           <Icon name="add_circle" />
           <span>Link New Account</span>
        </button>
      </div>

      <LinkAccountModal 
        isOpen={isLinkModalOpen} 
        onClose={() => setIsLinkModalOpen(false)}
        onSuccess={handleLinkSuccess}
      />
    </div>
  );
};
