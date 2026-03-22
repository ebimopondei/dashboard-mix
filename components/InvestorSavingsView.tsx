
import React, { useState } from 'react';
import { Icon } from './Icon';
import { UserProfile, ViewType } from '../types';
import { SavingsStreak } from './SavingsStreak';

interface InvestorSavingsViewProps {
  onNavigate: (view: ViewType, id?: string) => void;
  userProfile: UserProfile;
}

export const InvestorSavingsView: React.FC<InvestorSavingsViewProps> = ({ onNavigate, userProfile }) => {
  const [showInterestRates, setShowInterestRates] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const totalSaved = userProfile.savingsPlans.reduce((sum, plan) => sum + plan.balance, 0);

  const getLiquidityColor = (type: string) => {
      switch(type) {
          case 'Locked': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
          case 'Partial': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
          case 'Flexible': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  const rateOptions = [
    {
        title: 'Flex Save',
        rate: 8.0,
        desc: 'Withdraw anytime. Interest paid daily.',
        min: 1000,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-500/10',
        icon: 'savings',
        action: 'Start Flex'
    },
    {
        title: 'Target Locked',
        rate: 12.5,
        desc: 'Lock for 90-180 days. Higher returns.',
        min: 5000,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
        icon: 'lock_clock',
        action: 'Lock Funds'
    },
    {
        title: 'Wealth Builder',
        rate: 16.0,
        desc: '365 days lock. Maximize your yield.',
        min: 50000,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-500/10',
        icon: 'diamond',
        action: 'Invest Now'
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-4">
      {/* Header / Summary Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 size-32 rounded-full bg-emerald-500/10 blur-2xl"></div>
          
          <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-sm font-medium text-slate-300">Total Savings</h2>
                        <button 
                          onClick={() => setShowBalance(!showBalance)}
                          className="text-slate-400 hover:text-white transition-colors focus:outline-none"
                        >
                          <Icon name={showBalance ? "visibility" : "visibility_off"} className="text-base" />
                        </button>
                      </div>
                      <h1 className="text-4xl font-sans font-extrabold tracking-tight mb-2">
                          {showBalance ? `₦${totalSaved.toLocaleString()}` : '₦••••••••'}
                      </h1>
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                          <Icon name="trending_up" className="text-sm" />
                          <span>{showBalance ? '+₦840 interest accrued' : '•••••• interest'}</span>
                      </div>
                  </div>
                  <div className="size-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <Icon name="savings" className="text-xl" />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onNavigate(ViewType.INVESTOR_SAVINGS_CREATE)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors active:scale-[0.98]"
                  >
                      <Icon name="add" />
                      <span>Create Plan</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/5 active:scale-[0.98]">
                      <Icon name="bolt" />
                      <span>Quick Save</span>
                  </button>
              </div>
          </div>
      </div>

      <SavingsStreak onClick={() => onNavigate(ViewType.SAVINGS_STREAK_DETAIL)} />

      {/* View Toggle */}
      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex mb-2">
        <button
            onClick={() => setShowInterestRates(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${!showInterestRates ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
        >
            Active Plans
        </button>
        <button
            onClick={() => setShowInterestRates(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${showInterestRates ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
        >
            Interest Rates
        </button>
      </div>

      {/* Main Content Area */}
      {showInterestRates ? (
        <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-slate-800 dark:text-white">Available Products</h3>
            
            <div className="grid gap-4">
                {rateOptions.map((option, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3">
                                <div className={`size-10 rounded-full flex items-center justify-center ${option.bgColor} ${option.color}`}>
                                    <Icon name={option.icon} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{option.title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.desc}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg font-bold text-lg ${option.bgColor} ${option.color}`}>
                                {option.rate}% <span className="text-[10px] font-medium opacity-80">P.A.</span>
                            </div>
                        </div>
                        
                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700 mb-4" />
                        
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-400">Min Deposit: <span className="text-slate-600 dark:text-slate-300 font-bold">₦{option.min.toLocaleString()}</span></p>
                            <button 
                                onClick={() => onNavigate(ViewType.INVESTOR_SAVINGS_CREATE)}
                                className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90 transition-transform active:scale-95 shadow-sm"
                            >
                                {option.action}
                            </button>
                        </div>
                    </div>
                ))}
                
                <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg relative overflow-hidden mt-2 cursor-pointer hover:opacity-95 transition-opacity">
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg">Compare All Rates</p>
                            <p className="text-xs text-amber-100 opacity-90">See full breakdown by tenor and amount</p>
                        </div>
                        <div className="size-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Icon name="arrow_forward" />
                        </div>
                    </div>
                    <Icon name="table_chart" className="absolute -bottom-4 -right-4 text-8xl opacity-20" />
                </div>
            </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-in slide-in-from-left-4 duration-300">
            <h3 className="font-bold text-slate-800 dark:text-white">Active Plans</h3>
            
            {userProfile.savingsPlans.length > 0 ? (
                userProfile.savingsPlans.map((plan) => (
                    <div 
                        key={plan.id}
                        onClick={() => onNavigate(ViewType.INVESTOR_SAVINGS_DETAIL, plan.id)}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full flex items-center justify-center text-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                        <Icon name={plan.liquidityType === 'Locked' ? 'lock' : 'lock_open'} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">{plan.name}</h4>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={`px-1.5 py-0.5 rounded font-medium ${getLiquidityColor(plan.liquidityType)}`}>
                                                {plan.liquidityType}
                                            </span>
                                            <span className="text-slate-400">• {plan.tenorDays > 0 ? `${plan.tenorDays} Days` : 'Flexible'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Saved</p>
                                        <p className="font-bold text-lg text-slate-800 dark:text-white">{showBalance ? `₦${plan.balance.toLocaleString()}` : '₦••••••••'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Target</p>
                                        <p className="font-bold text-sm text-slate-600 dark:text-slate-300">₦{plan.targetAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min(100, (plan.balance / plan.targetAmount) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {plan.nextDepositDate && (
                            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 flex justify-between items-center text-xs">
                                <span className="text-slate-500 dark:text-slate-400">Next Due: <span className="font-bold text-slate-700 dark:text-slate-300">{plan.nextDepositDate}</span></span>
                                {plan.autoSaveEnabled && (
                                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                                        <Icon name="autorenew" className="text-xs" /> Auto-save on
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 text-slate-400">
                        <Icon name="savings" className="text-3xl" />
                    </div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-300">No Active Plans</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mb-4">Start a fixed deposit or target savings plan today.</p>
                    <button 
                        onClick={() => onNavigate(ViewType.INVESTOR_SAVINGS_CREATE)}
                        className="text-primary font-bold text-sm hover:underline"
                    >
                        Create your first plan
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
