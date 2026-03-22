
import React, { useState } from 'react';
import { Icon } from './Icon';
import { COLLECTIONS } from '../constants';

interface LoanApplicationViewProps {
  onBack: () => void;
}

export const LoanApplicationView: React.FC<LoanApplicationViewProps> = ({ onBack }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);

  // Filter collections for Trader application (mocking proximity or eligibility)
  const availableCollections = COLLECTIONS.slice(0, 3); 

  const interestRate = 0.15; // 15% flat for simplicity
  const totalRepayment = amount * (1 + interestRate);
  const dailyRepayment = duration > 0 ? totalRepayment / duration : 0;

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Apply for Loan
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        
        {/* Collection Selector */}
        <section>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Select Market / Hub</label>
            <div className="space-y-3">
                {availableCollections.map((col) => (
                    <div 
                        key={col.id}
                        onClick={() => setSelectedCollectionId(col.id)}
                        className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            selectedCollectionId === col.id 
                            ? 'bg-primary/5 border-primary ring-1 ring-primary' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                    >
                        <div className={`size-10 rounded-lg flex items-center justify-center text-white ${selectedCollectionId === col.id ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <Icon name={col.iconName} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-800 dark:text-white text-sm">{col.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{col.location}</p>
                        </div>
                        {selectedCollectionId === col.id && <Icon name="check_circle" className="text-primary" />}
                    </div>
                ))}
            </div>
        </section>

        {/* Amount Input */}
        <section>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Loan Amount</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₦</span>
                <input 
                    type="number" 
                    placeholder="0.00"
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">Max eligible: ₦50,000</p>
        </section>

        {/* Duration Selector */}
        <section>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Duration</label>
            <div className="grid grid-cols-3 gap-3">
                {[30, 60, 90].map((d) => (
                    <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                            duration === d 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        {d} Days
                    </button>
                ))}
            </div>
        </section>

        {/* Calculation Summary */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Principal</span>
                <span className="font-bold text-slate-800 dark:text-white">₦{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Interest (15%)</span>
                <span className="font-bold text-slate-800 dark:text-white">₦{(amount * interestRate).toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
            <div className="flex justify-between text-base">
                <span className="font-bold text-slate-700 dark:text-slate-300">Total Repayment</span>
                <span className="font-bold text-slate-900 dark:text-white">₦{totalRepayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center bg-white dark:bg-slate-700 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
                <span className="text-xs font-bold uppercase text-primary">Daily Payment</span>
                <span className="font-bold text-lg text-primary">₦{dailyRepayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
        </div>

      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto">
             <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-transform">
                 Submit Application
             </button>
        </div>
      </div>
    </div>
  );
};