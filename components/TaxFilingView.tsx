
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ViewType } from '../types';

interface TaxFilingViewProps {
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
}

export const TaxFilingView: React.FC<TaxFilingViewProps> = ({ onBack, onNavigate }) => {
  const [isApproved, setIsApproved] = useState(false);
  const [step, setStep] = useState<'review' | 'success'>('review');
  const [isFiling, setIsFiling] = useState(false);

  const handleFile = () => {
      setIsFiling(true);
      setTimeout(() => {
          setIsFiling(false);
          setStep('success');
      }, 2000);
  };

  if (step === 'success') {
      return (
        <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
            <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <Icon name="check_circle" className="text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Filing Successful!</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
                Your VAT Return for Oct 2023 has been submitted to FIRS. Reference: <span className="font-mono font-bold">TAX-2023-OCT-VAT</span>
            </p>
            <button 
                onClick={() => onNavigate(ViewType.TAX_DASHBOARD)}
                className="w-full max-w-xs py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg"
            >
                Back to Dashboard
            </button>
        </div>
      );
  }

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
          Prepare Filing
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-28">
         <div className="mb-6">
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Filing Period</p>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">October 2023 VAT Return</h2>
         </div>

         {/* PDF Preview Mock */}
         <div className="bg-slate-200 dark:bg-slate-800 rounded-xl p-1 mb-6 border border-slate-300 dark:border-slate-700 shadow-inner h-[300px] relative overflow-hidden flex flex-col items-center justify-center">
             <div className="absolute inset-x-4 top-4 bottom-4 bg-white shadow-lg flex flex-col items-center p-8 opacity-90">
                 <div className="w-16 h-16 bg-green-700 rounded-full mb-4 flex items-center justify-center text-white font-bold text-xs">FIRS</div>
                 <div className="w-full h-2 bg-slate-200 mb-2 rounded"></div>
                 <div className="w-2/3 h-2 bg-slate-200 mb-4 rounded"></div>
                 
                 <div className="w-full grid grid-cols-2 gap-4 mt-4">
                     <div className="h-4 bg-slate-100 rounded"></div><div className="h-4 bg-slate-100 rounded"></div>
                     <div className="h-4 bg-slate-100 rounded"></div><div className="h-4 bg-slate-100 rounded"></div>
                 </div>
             </div>
             <button className="absolute bottom-6 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
                 <Icon name="visibility" /> Preview PDF
             </button>
         </div>

         {/* Summary */}
         <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 mb-6">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4">Liability Breakdown</h3>
             <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                     <span className="text-slate-500 dark:text-slate-400">Total Sales (Vatable)</span>
                     <span className="font-medium text-slate-800 dark:text-white">₦450,000.00</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-slate-500 dark:text-slate-400">Output VAT (7.5%)</span>
                     <span className="font-medium text-slate-800 dark:text-white">₦33,750.00</span>
                 </div>
                 <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                     <span>Input VAT Claimed</span>
                     <span className="font-medium">-₦1,125.00</span>
                 </div>
                 <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-base font-bold">
                     <span className="text-slate-800 dark:text-white">Net Payable</span>
                     <span className="text-slate-800 dark:text-white">₦32,625.00</span>
                 </div>
             </div>
         </div>

         {/* Approval */}
         <label className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
            <input 
                type="checkbox" 
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
                className="mt-1 size-5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                I declare that the information in this return is true and correct to the best of my knowledge. I authorize Mix Afrika to submit this filing to the Federal Inland Revenue Service.
            </span>
        </label>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto">
             <button 
                onClick={handleFile}
                disabled={!isApproved || isFiling}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
                 {isFiling ? (
                     <>
                        <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                     </>
                 ) : (
                     <span>File Return Now</span>
                 )}
             </button>
        </div>
      </div>
    </div>
  );
};
