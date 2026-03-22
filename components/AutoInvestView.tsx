
import React, { useState } from 'react';
import { Icon } from './Icon';
import { GOALS } from '../constants';

interface AutoInvestViewProps {
  onBack: () => void;
}

export const AutoInvestView: React.FC<AutoInvestViewProps> = ({ onBack }) => {
  const [autoDepositEnabled, setAutoDepositEnabled] = useState(false);
  const [smartAllocationEnabled, setSmartAllocationEnabled] = useState(true);

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Auto-Pilot & Goals
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        
        {/* Intro */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl text-white shadow-lg relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-10 p-4 transform translate-x-1/4 -translate-y-1/4">
                 <Icon name="rocket_launch" className="text-9xl" />
             </div>
             <div className="relative z-10">
                 <h2 className="text-xl font-bold mb-1">Put your money to work</h2>
                 <p className="text-blue-100 text-sm mb-4 max-w-[80%]">
                     Automate your deposits and let our smart allocation strategy diversify your portfolio for maximum growth.
                 </p>
                 <div className="flex items-center gap-2 text-xs font-bold bg-white/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full">
                     <Icon name="verified" className="text-sm" />
                     <span>Proven Strategy</span>
                 </div>
             </div>
        </div>

        {/* Recurring Deposit */}
        <section className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Icon name="savings" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white">Recurring Deposit</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Add funds automatically</p>
                    </div>
                </div>
                <div 
                    onClick={() => setAutoDepositEnabled(!autoDepositEnabled)}
                    className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${autoDepositEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <div className={`size-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${autoDepositEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
            </div>

            {autoDepositEnabled && (
                <div className="p-5 space-y-4 animate-in slide-in-from-top-2">
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                                <input type="number" defaultValue="500" className="w-full pl-6 pr-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Frequency</label>
                            <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500">
                                <option>Weekly</option>
                                <option>Bi-Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Icon name="account_balance" className="text-sm" />
                        <span>Drawing from Chase Checking (****8823)</span>
                    </div>
                </div>
            )}
        </section>

        {/* Smart Allocation */}
        <section className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Icon name="pie_chart" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white">Smart Allocation</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Diversify across sectors</p>
                    </div>
                </div>
                 <div 
                    onClick={() => setSmartAllocationEnabled(!smartAllocationEnabled)}
                    className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${smartAllocationEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <div className={`size-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${smartAllocationEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
            </div>
            
            {smartAllocationEnabled && (
                <div className="p-4">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-white">Balanced Strategy</span>
                        <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">Recommended</span>
                     </div>
                     <div className="flex h-4 rounded-full overflow-hidden w-full mb-3">
                         <div className="bg-emerald-500 w-[35%]" />
                         <div className="bg-blue-500 w-[30%]" />
                         <div className="bg-amber-500 w-[20%]" />
                         <div className="bg-indigo-500 w-[15%]" />
                     </div>
                     <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                         <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-emerald-500" /> Agriculture 35%</div>
                         <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-blue-500" /> Technology 30%</div>
                         <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-amber-500" /> Manufacturing 20%</div>
                         <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-indigo-500" /> Retail 15%</div>
                     </div>
                </div>
            )}
        </section>

        {/* Financial Goals */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white">Financial Goals</h3>
                <button className="text-primary text-sm font-bold flex items-center gap-1">
                    <Icon name="add" className="text-lg" /> New Goal
                </button>
            </div>
            
            <div className="space-y-4">
                {GOALS.map((goal) => (
                    <div key={goal.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`size-10 rounded-full ${goal.color} flex items-center justify-center text-white`}>
                                    <Icon name={goal.icon} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">{goal.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Target: ₦{goal.targetAmount.toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-lg">
                                Due {goal.deadline}
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                             <div className="flex justify-between text-sm">
                                 <span className="font-medium text-slate-600 dark:text-slate-300">₦{goal.currentAmount.toLocaleString()} saved</span>
                                 <span className="font-bold text-slate-800 dark:text-white">{Math.round((goal.currentAmount/goal.targetAmount)*100)}%</span>
                             </div>
                             <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                 <div className={`h-full ${goal.color}`} style={{ width: `${(goal.currentAmount/goal.targetAmount)*100}%` }} />
                             </div>
                             <p className="text-xs text-slate-400 text-right pt-1">On track to reach goal</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
};