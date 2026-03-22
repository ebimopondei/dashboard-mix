
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ViewType } from '../types';

interface TaxProfileViewProps {
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
}

export const TaxProfileView: React.FC<TaxProfileViewProps> = ({ onBack, onNavigate }) => {
  const [country, setCountry] = useState('Nigeria');
  const [businessType, setBusinessType] = useState('Sole Prop');
  const [taxId, setTaxId] = useState('');
  const [vatRegistered, setVatRegistered] = useState(false);
  const [accountingBasis, setAccountingBasis] = useState('Cash');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!consent) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onNavigate(ViewType.TAX_DASHBOARD);
    }, 1500);
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
          TaxDesk Setup
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 mb-6">
            <div className="flex gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                    <Icon name="verified_user" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">Automated Compliance</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Configure your profile to enable real-time tax estimation and automated filing. Your data is encrypted.
                    </p>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            {/* Country */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tax Jurisdiction</label>
                <div className="relative">
                    <Icon name="public" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary appearance-none"
                    >
                        <option>Nigeria</option>
                        <option>Ghana</option>
                        <option>Kenya</option>
                    </select>
                    <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Business Type */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Business Structure</label>
                <div className="grid grid-cols-3 gap-3">
                    {['Individual', 'Sole Prop', 'Company'].map(type => (
                        <button
                            key={type}
                            onClick={() => setBusinessType(type)}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                                businessType === type
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tax ID */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tax Identification Number (TIN)</label>
                <input 
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="e.g. 23849201-0001"
                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Toggles */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">VAT Registered</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Do you charge VAT on sales?</p>
                    </div>
                    <div 
                        onClick={() => setVatRegistered(!vatRegistered)}
                        className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${vatRegistered ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                        <div className={`size-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${vatRegistered ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">Accounting Basis</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{accountingBasis} Basis</p>
                    </div>
                    <button 
                        onClick={() => setAccountingBasis(accountingBasis === 'Cash' ? 'Accrual' : 'Cash')}
                        className="text-xs font-bold bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300"
                    >
                        Switch
                    </button>
                </div>
            </div>

            {/* Consent */}
            <label className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 size-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    I consent to Mix Afrika computing my tax estimates and submitting filings on my behalf where I opt-in. I confirm the information provided is accurate.
                </span>
            </label>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto">
             <button 
                onClick={handleSave}
                disabled={!consent || isLoading}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
                 {isLoading ? (
                     <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                     <span>Save & Continue</span>
                 )}
             </button>
        </div>
      </div>
    </div>
  );
};
