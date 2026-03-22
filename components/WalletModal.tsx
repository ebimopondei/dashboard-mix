

import React, { useState } from 'react';
import { Icon } from './Icon';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, type }) => {
  const [amount, setAmount] = useState('');
  const isDeposit = type === 'deposit';

  if (!isOpen) return null;

  const quickAmounts = isDeposit 
    ? [50, 100, 500, 1000]
    : [25, 50, 100, 'Max'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call
    onClose();
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {isDeposit ? 'Add Funds' : 'Withdraw Funds'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Amount ({isDeposit ? 'NGN' : 'NGN'})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-3xl font-bold text-slate-800 dark:text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt === 'Max' ? '3400520' : amt.toString())}
                className="flex-1 min-w-[60px] py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {amt === 'Max' ? 'Max' : `₦${amt}`}
              </button>
            ))}
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
             <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Processing Time</span>
                <span className="font-medium text-slate-800 dark:text-white">Instant</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Transaction Fee</span>
                <span className="font-medium text-emerald-500">Free</span>
             </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg active:scale-[0.98] transition-all
              ${isDeposit 
                ? 'bg-primary shadow-primary/25 hover:bg-primary/90' 
                : 'bg-slate-800 dark:bg-white dark:text-slate-900 shadow-slate-400/20 hover:opacity-90'
              }
            `}
          >
            {isDeposit ? 'Confirm Deposit' : 'Request Withdrawal'}
          </button>
        </form>
        
        {/* Safe area for mobile bottom */}
        <div className="h-6 w-full sm:hidden"></div>
      </div>
    </div>
  );
};