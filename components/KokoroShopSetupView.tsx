
import React, { useState } from 'react';
import { Icon } from './Icon';

interface KokoroShopSetupViewProps {
  onComplete: () => void;
}

export const KokoroShopSetupView: React.FC<KokoroShopSetupViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  const categories = ['Textiles', 'Electronics', 'Groceries', 'Hardware', 'Beauty'];

  return (
    <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark flex flex-col p-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full pb-20">
        <div className="text-center mb-10">
          <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <Icon name="storefront" className="text-5xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">Setup Your Shop</h1>
          <p className="text-slate-500">Kòkòrò helps you remember your stock and track your profit daily.</p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Shop Name</label>
              <input 
                type="text" 
                placeholder="e.g. Bisi's Boutique" 
                className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Trade Category</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(c => (
                  <button key={c} className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:border-primary active:bg-primary/5">
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={() => setStep(2)} className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 mt-4">
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">App Language</label>
              <div className="flex gap-3">
                <button className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold">English</button>
                <button className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">Yorùbá</button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-500/20 flex gap-4">
              <Icon name="verified_user" className="text-blue-500 text-2xl" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Structured Records</h4>
                <p className="text-xs text-slate-500 mt-1">Using Kokoro builds a business history that makes you eligible for larger loans later.</p>
              </div>
            </div>

            <button onClick={onComplete} className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 mt-4">
              Finish Setup
            </button>
            <button onClick={() => setStep(1)} className="w-full py-3 text-slate-400 font-bold text-sm">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
