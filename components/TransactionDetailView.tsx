
import React from 'react';
import { ActivityItem } from '../types';
import { Icon } from './Icon';

interface TransactionDetailViewProps {
  transaction: ActivityItem;
  onBack: () => void;
}

export const TransactionDetailView: React.FC<TransactionDetailViewProps> = ({ transaction, onBack }) => {
  const isPositive = transaction.amount > 0;
  
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'completed': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
          case 'pending': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
          case 'failed': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10';
          default: return 'text-slate-500 bg-slate-100 dark:bg-slate-700';
      }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1 text-center pr-8">
          Transaction Details
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
         {/* Receipt Card */}
         <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
            {/* Decorative Notch */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-background-light dark:bg-background-dark rounded-full"></div>
            
            <div className="flex flex-col items-center justify-center pt-6 pb-8 border-b border-dashed border-slate-200 dark:border-slate-700">
                 <div className={`size-16 rounded-full flex items-center justify-center mb-4 ${isPositive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>
                     <Icon name={isPositive ? 'arrow_downward' : 'arrow_upward'} className="text-3xl" />
                 </div>
                 <h2 className={`text-3xl font-bold mb-1 ${isPositive ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                     {isPositive ? '+' : ''}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}
                 </h2>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(transaction.status)}`}>
                     {transaction.status}
                 </span>
            </div>

            <div className="py-6 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Transaction Type</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white capitalize">{transaction.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Date & Time</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{transaction.date}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Description</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white max-w-[60%] text-right">{transaction.title}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Reference ID</span>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-mono text-slate-800 dark:text-white">REF-{transaction.id.toUpperCase().substring(0,8)}</span>
                        <Icon name="content_copy" className="text-xs text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total Amount</span>
                    <span className="text-lg font-bold text-slate-800 dark:text-white">{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}</span>
                 </div>
            </div>
         </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-4">
              <button className="py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Report Issue
              </button>
              <button className="py-3.5 rounded-xl font-bold text-white bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98]">
                  Share Receipt
              </button>
          </div>
      </div>
    </div>
  );
};