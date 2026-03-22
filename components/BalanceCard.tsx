import React, { useState } from 'react';
import { Icon } from './Icon';
import { WalletModal } from './WalletModal';

interface BalanceCardProps {
    compact?: boolean;
    balance?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ compact = false, balance = 3400520 }) => {
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | null>(null);
  const [showBalance, setShowBalance] = useState(true);

  return (
    <>
      <div className={`
        relative overflow-hidden rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-all duration-300
        ${compact 
          ? 'bg-white dark:bg-slate-800/50' 
          : 'bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-black text-white'
        }
      `}>
        {/* Decorative Circles */}
        {!compact && (
          <>
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 size-32 rounded-full bg-primary/10 blur-2xl"></div>
          </>
        )}

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-medium ${compact ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400'}`}>
                    Available Balance
                </p>
                <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className={`p-1 -m-1 rounded-full transition-colors focus:outline-none ${
                        compact 
                        ? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300' 
                        : 'text-slate-500 hover:text-white'
                    }`}
                    title={showBalance ? "Hide Balance" : "Show Balance"}
                >
                    <Icon name={showBalance ? "visibility" : "visibility_off"} className="text-lg" />
                </button>
              </div>
              <h2 className={`text-5xl font-sans font-bold tracking-tight transition-all duration-300 ${compact ? 'text-slate-800 dark:text-white' : 'text-white'}`}>
                {showBalance ? `₦${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₦••••••••'}
              </h2>
            </div>
            {!compact && (
              <div className="size-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/5">
                <Icon name="account_balance_wallet" className="text-2xl text-white" />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setModalType('deposit')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98]
                ${compact 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90' 
                  : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90'
                }
              `}
            >
              <Icon name="add" className="text-xl" />
              <span>Deposit</span>
            </button>
            <button 
              onClick={() => setModalType('withdraw')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98]
                ${compact 
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600' 
                  : 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border border-white/5'
                }
              `}
            >
              <Icon name="arrow_upward" className="text-xl" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5 px-4 opacity-70">
           <Icon name="verified_user" className="text-[12px] text-slate-500 dark:text-slate-400 shrink-0" />
           <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 text-center whitespace-nowrap overflow-hidden text-ellipsis">
             All savings and investment are insured by <span className="font-bold">NDIC</span> and regulated by the <span className="font-bold">CBN</span>.
           </p>
        </div>
      )}

      <WalletModal 
        isOpen={!!modalType} 
        onClose={() => setModalType(null)} 
        type={modalType || 'deposit'} 
      />
    </>
  );
};