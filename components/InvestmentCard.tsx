
import React from 'react';
import { Investment } from '../types';
import { Icon } from './Icon';

interface InvestmentCardProps {
  investment: Investment;
  onClick?: () => void;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment, onClick }) => {
  const isPending = investment.status === 'Pending';
  const isRealEstate = investment.category === 'Real Estate';
  const isStock = investment.category === 'Stocks' || investment.category === 'Bonds';
  const isStartup = investment.category === 'Startups';
  
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col gap-4 rounded-[1.5rem] p-5 bg-white dark:bg-slate-800/50 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:dark:bg-slate-800/80 transition-all ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center rounded-xl size-12 ${
              isRealEstate ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' : 
              isStock ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600' :
              isStartup ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600' :
              'bg-primary/20 text-primary'
          }`}>
            {isStock && investment.ticker ? (
                <span className="font-black text-sm">{investment.ticker}</span>
            ) : (
                <Icon name={investment.iconName} className="text-2xl" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-800 dark:text-white truncate">{investment.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{investment.category}</p>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                  isRealEstate ? 'bg-indigo-600 text-white' : 
                  isStock ? 'bg-blue-600 text-white' :
                  isStartup ? 'bg-amber-500 text-white' :
                  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {isRealEstate ? (investment.purchaseType || 'Ownership') : isStock ? `${investment.units} Units` : isStartup ? `${investment.equityOwned?.toFixed(4)}% Stake` : investment.cycleDuration}
              </span>
            </div>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter
            ${isPending 
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400' 
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
            }`}
        >
          {investment.status}
        </span>
      </div>

      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{isStock ? 'Market Value' : isStartup ? 'Cost Basis' : 'Equity Invested'}</p>
          <p className="font-black text-xl text-slate-800 dark:text-white">
            ₦{(investment.investedAmount).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {isRealEstate ? 'Est. Yield' : isStock ? 'Total Gain' : isStartup ? 'Unrealized Multiple' : 'Accrued Return'}
          </p>
          {isStartup ? (
              <p className="font-black text-xl text-emerald-500">1.24x</p>
          ) : (
            <p className="font-black text-xl text-emerald-500">
                +₦{investment.currentReturn.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {isRealEstate && (
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                  <Icon name="manage_accounts" className="text-slate-400 text-sm" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{investment.managementType || 'Mix Afrika'} Managed</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <Icon name="token" className="text-indigo-400 text-sm" />
                  <span className="text-[10px] font-black text-indigo-400 uppercase">Tokenized Deed</span>
              </div>
          </div>
      )}

      {isStock && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-700/50">
              <div className="flex items-center gap-2">
                  <Icon name="show_chart" className="text-blue-400 text-sm" />
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Market Assets</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center">
                    <Icon name="trending_up" className="text-xs mr-1" />
                    Exchange Active
                  </span>
              </div>
          </div>
      )}

      {isStartup && (
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-700/50">
              <div className="flex items-center gap-2">
                  <Icon name="rocket_launch" className="text-amber-500 text-sm" />
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Post-Seed</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-amber-500 uppercase">Cap Table Token</span>
              </div>
          </div>
      )}

      {!isRealEstate && !isStock && !isStartup && (
        <div>
            <div className="flex justify-between mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">
                <span>Pool Progress</span>
                <span>{investment.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${investment.progress}%` }}
                />
            </div>
        </div>
      )}
    </div>
  );
};
