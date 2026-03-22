
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ViewType, TaxTransaction } from '../types';
import { TAX_TRANSACTIONS_MOCK, TAX_FILINGS_MOCK } from '../constants';

interface TaxDashboardViewProps {
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
}

export const TaxDashboardView: React.FC<TaxDashboardViewProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [transactions, setTransactions] = useState(TAX_TRANSACTIONS_MOCK);

  // Estimates Mock
  const totalVat = transactions.reduce((sum, t) => sum + (t.vatAmount > 0 ? t.vatAmount : 0), 0);
  const totalIncomeTax = 12500; // Mock calculation
  const totalDue = totalVat + totalIncomeTax;

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Verified': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
          case 'Review Needed': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
          default: return 'text-slate-500 bg-slate-100 dark:bg-slate-700';
      }
  };

  const handleReclassify = (id: string) => {
      // Mock reclassification logic
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'Verified', category: 'Cost of Sales' } : t));
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          TaxDesk
        </h1>
        <button 
            onClick={() => onNavigate(ViewType.TAX_PROFILE)}
            className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="settings" />
        </button>
      </header>

      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">
         <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
         >
            Overview
         </button>
         <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
         >
            Transactions
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'overview' ? (
            <div className="space-y-6 animate-in fade-in">
                {/* Estimates Card */}
                <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Icon name="gavel" className="text-9xl" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Est. Taxes (Next 30 Days)</p>
                        <h2 className="text-4xl font-extrabold mb-6">₦{totalDue.toLocaleString()}</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                                <p className="text-xs text-slate-300 mb-1">VAT Payable</p>
                                <p className="font-bold">₦{totalVat.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                                <p className="text-xs text-slate-300 mb-1">Income Tax</p>
                                <p className="font-bold">₦{totalIncomeTax.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => onNavigate(ViewType.TAX_FILING)}
                        className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
                    >
                        <div className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                            <Icon name="assignment" />
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-white">Create Filing</span>
                    </button>
                    <button className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
                        <div className="size-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                            <Icon name="savings" />
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-white">Tax Buffer</span>
                    </button>
                </div>

                {/* Recent Filings */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-slate-800 dark:text-white">Recent Filings</h3>
                        <button 
                            onClick={() => onNavigate(ViewType.TAX_ADMIN)}
                            className="text-xs text-primary font-bold"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {TAX_FILINGS_MOCK.map(filing => (
                            <div key={filing.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                        <Icon name="description" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{filing.taxType} Return</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{filing.period}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">₦{filing.amountDue.toLocaleString()}</p>
                                    <p className={`text-[10px] font-bold uppercase ${filing.status === 'Filed' ? 'text-emerald-500' : 'text-amber-500'}`}>{filing.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="space-y-4 animate-in fade-in">
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    {['All', 'Review Needed', 'Sales', 'Expenses'].map(f => (
                        <button key={f} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {f}
                        </button>
                    ))}
                </div>

                {transactions.map(tx => (
                    <div key={tx.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">{tx.description}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{tx.date} • {tx.category}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                                    {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                                </p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>
                                    {tx.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                            <button 
                                onClick={() => handleReclassify(tx.id)}
                                className="flex-1 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1 hover:text-primary transition-colors"
                            >
                                <Icon name="edit" className="text-sm" /> Reclassify
                            </button>
                            <div className="w-px bg-slate-100 dark:bg-slate-700" />
                            <button className="flex-1 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1 hover:text-primary transition-colors">
                                <Icon name={tx.hasInvoice ? 'visibility' : 'upload_file'} className="text-sm" /> 
                                {tx.hasInvoice ? 'View Invoice' : 'Add Invoice'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
