
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface LinkAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'select_institution' | 'enter_credentials' | 'verifying' | 'success';

const INSTITUTIONS = [
  { id: 'ins_1', name: 'Chase', color: '#117ACA' },
  { id: 'ins_2', name: 'Bank of America', color: '#E31837' },
  { id: 'ins_3', name: 'Wells Fargo', color: '#CD1409' },
  { id: 'ins_4', name: 'Citi', color: '#003B70' },
  { id: 'ins_5', name: 'US Bank', color: '#004A8F' },
  { id: 'ins_6', name: 'Capital One', color: '#003A6F' },
];

export const LinkAccountModal: React.FC<LinkAccountModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>('select_institution');
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('select_institution');
      setSelectedInstitution(null);
    }
  }, [isOpen]);

  const handleSelectInstitution = (ins: any) => {
    setSelectedInstitution(ins);
    setStep('enter_credentials');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verifying');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
             <Icon name="verified_user" className="text-slate-900 dark:text-white" />
             <span className="font-bold text-slate-800 dark:text-white">Secure Link</span>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <Icon name="close" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {step === 'select_institution' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Select your bank</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Search or select from the most popular banks</p>
              </div>

              <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search institution"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INSTITUTIONS.map((ins) => (
                  <button
                    key={ins.id}
                    onClick={() => handleSelectInstitution(ins)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-2"
                  >
                    <div className="size-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: ins.color }}>
                      {ins.name[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{ins.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'enter_credentials' && selectedInstitution && (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col items-center mb-6">
                <div className="size-16 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg" style={{ backgroundColor: selectedInstitution.color }}>
                  {selectedInstitution.name[0]}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Login to {selectedInstitution.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Enter your online banking credentials</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Username</label>
                   <input 
                     type="text" 
                     required
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Password</label>
                   <input 
                     type="password" 
                     required
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white"
                   />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
              >
                Submit
              </button>
            </form>
          )}

          {step === 'verifying' && (
             <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-300">
                <div className="size-12 border-4 border-slate-200 dark:border-slate-700 border-t-primary rounded-full animate-spin"></div>
                <p className="font-medium text-slate-600 dark:text-slate-300">Verifying credentials...</p>
             </div>
          )}

          {step === 'success' && (
             <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in zoom-in duration-300">
                <div className="size-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                   <Icon name="check" className="text-4xl" />
                </div>
                <div className="text-center">
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white">Success!</h3>
                   <p className="text-slate-500 dark:text-slate-400">Your account has been linked successfully.</p>
                </div>
             </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
           <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
             <Icon name="lock" className="text-xs" />
             Secured by Plaid simulation
           </p>
        </div>
      </div>
    </div>
  );
};
